import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AlertCircle, SaveIcon } from 'lucide-react';

import type { Resident } from '@/types/entity';
import type { FormValidationErrors } from '@/types/form';

import residentService from '@/services/krama-resident.service';
import residentStatusService from '@/services/resident-status.service';
import { type ResidentStatus } from '@/services/resident-status.service';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { AdatAndAddressDetails } from './resident-form/adat-address-details';
import { PersonalDetails } from './resident-form/personal-details';
import { SupportDocuments } from './resident-form/support-documents';
import type { ResidentFormData, ResidentFormFiles } from './resident-form/types';

interface ResidentFormProps {
  initialData?: Resident;
  onSubmit: (formData: FormData) => Promise<void>;
  isEditing?: boolean;
  cancelPath?: string;
  successPath?: string;
  submitLabel?: string;
}

export function ResidentForm({
  initialData,
  onSubmit,
  isEditing = false,
  cancelPath = '/account/resident',
  successPath = '/account/resident',
  submitLabel,
}: ResidentFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormValidationErrors | null>(null);
  const [banjars, setBanjars] = useState<{ id: number; name: string }[]>([]);
  const [residentStatuses, setResidentStatuses] = useState<ResidentStatus[]>([]);

  // Form State
  const [formData, setFormData] = useState<ResidentFormData>({
    nik: initialData?.nik || '',
    family_card_number: initialData?.family_card_number || '',
    name: initialData?.name || '',
    gender: initialData?.gender || 'L',
    place_of_birth: initialData?.place_of_birth || '',
    date_of_birth: initialData?.date_of_birth?.split('T')[0] || '',
    family_status: initialData?.family_status || 'HEAD_OF_FAMILY',
    religion: initialData?.religion || 'Hindu',
    education: initialData?.education || '',
    work_type: initialData?.work_type || '',
    marital_status: initialData?.marital_status || 'MARRIED',
    origin_address: initialData?.origin_address || '',
    residential_address: initialData?.residential_address || '',
    rt_number: initialData?.rt_number || '',
    residence_name: initialData?.residence_name || '',
    house_number: initialData?.house_number || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    banjar_id: initialData?.banjar?.id?.toString() || '', // Default empty
    resident_status_id: initialData?.resident_status?.id?.toString() || '',
  });

  const parseLocation = (loc: any) => {
    if (!loc) return null;
    if (typeof loc === 'string') {
      try {
        const parsed = JSON.parse(loc);
        return { lat: parseFloat(parsed.lat), lng: parseFloat(parsed.lng) };
      } catch (e) {
        return null;
      }
    }
    if (typeof loc === 'object') {
      return { lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) };
    }
    return null;
  };

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    parseLocation(initialData?.location),
  );

  // File State
  const [files, setFiles] = useState<ResidentFormFiles>({
    photo_house: null,
    resident_photo: null,
    photo_ktp: null,
  });

  useEffect(() => {
    residentService.getBanjars().then(setBanjars).catch(console.error);
    residentStatusService
      .getAll()
      .then((res) => {
        if (res.success && res.data) {
          setResidentStatuses(res.data);
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setFieldErrors(null);

    // Basic Validation
    if (!formData.nik || formData.nik.length !== 16) {
      setFieldErrors({ nik: ['NIK harus 16 digit.'] });
      setGeneralError('Mohon periksa input form anda.');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const isHead = formData.family_status === 'HEAD_OF_FAMILY';

    if (isHead) {
      if (!formData.banjar_id) {
        setFieldErrors({ banjar_id: ['Pilih Banjar terlebih dahulu.'] });
        setGeneralError('Mohon periksa input form anda.');
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    try {
      const data = new FormData();
      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      // Append location as array fields
      if (location) {
        // PHP/Laravel array naming convention
        data.append('location[lat]', location.lat.toString());
        data.append('location[lng]', location.lng.toString());
      }

      // Append files if selected
      if (files.photo_house) data.append('photo_house', files.photo_house);
      if (files.resident_photo) data.append('resident_photo', files.resident_photo);
      if (files.photo_ktp) data.append('photo_ktp', files.photo_ktp);

      await onSubmit(data);
      navigate(successPath);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.data?.error?.details) {
        // Set error as object for details
        setFieldErrors(err.response.data.error.details);
        setGeneralError('Terdapat kesalahan validasi. Mohon periksa input anda.');
      } else {
        setGeneralError(
          err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat menyimpan data.',
        );
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {generalError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-2">
            <p>{generalError}</p>
          </AlertDescription>
        </Alert>
      )}

      <PersonalDetails
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
        errors={fieldErrors}
      />

      {formData.family_status === 'HEAD_OF_FAMILY' && (
        <>
          <AdatAndAddressDetails
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            banjars={banjars}
            residentStatuses={residentStatuses}
            location={location}
            setLocation={setLocation}
            errors={fieldErrors}
          />
          <SupportDocuments
            files={files}
            handleFileChange={handleFileChange}
            errors={fieldErrors}
          />
        </>
      )}

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate(cancelPath)}>
          Batal
        </Button>
        <Button type="submit" size="lg" disabled={loading}>
          {loading && (
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
          )}
          <SaveIcon className="mr-2 h-4 w-4" />
          {submitLabel || (isEditing ? 'Simpan Perubahan' : 'Kirim Data')}
        </Button>
      </div>
    </form>
  );
}
