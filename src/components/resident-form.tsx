import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AlertCircle, SaveIcon, UploadCloud } from 'lucide-react';

import type { Resident } from '@/types/entity';

import residentService from '@/services/krama-resident.service';
import { type ResidentStatus, residentStatusService } from '@/services/resident-status.service';

import { MapPicker } from '@/components/map-picker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [error, setError] = useState<string | Record<string, string[]> | null>(null);
  const [banjars, setBanjars] = useState<{ id: number; name: string }[]>([]);
  const [residentStatuses, setResidentStatuses] = useState<ResidentStatus[]>([]);

  // Form State
  const [formData, setFormData] = useState({
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
  const [files, setFiles] = useState<{
    photo_house: File | null;
    resident_photo: File | null;
    photo_ktp: File | null;
  }>({
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
    setError(null);

    // Basic Validation
    if (!formData.nik || formData.nik.length !== 16) {
      setError('NIK harus 16 digit.');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!formData.banjar_id) {
      setError('Pilih Banjar terlebih dahulu.');
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
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
        setError(err.response.data.error.details);
      } else {
        setError(
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
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mt-2">
            {/* Check if error is a string or an object with details */}
            {typeof error === 'string' ? (
              <p>{error}</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {Object.entries(error).map(([key, messages]: any) => (
                  <li key={key}>
                    <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                    {messages[0]}
                  </li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Data Pribadi</CardTitle>
          <CardDescription>Informasi utama identitas penduduk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>NIK (Nomor Induk Kependudukan)</FieldLabel>
              <FieldContent>
                <Input
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="16 digit NIK"
                  maxLength={16}
                  className="text-lg"
                  required
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Nomor Kartu Keluarga</FieldLabel>
              <FieldContent>
                <Input
                  name="family_card_number"
                  value={formData.family_card_number}
                  onChange={handleChange}
                  placeholder="16 digit No KK"
                  maxLength={16}
                  className="text-lg"
                  required
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel>Nama Lengkap</FieldLabel>
            <FieldContent>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama sesuai KTP"
                className="text-lg font-medium"
                required
              />
            </FieldContent>
          </Field>

          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Jenis Kelamin</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.gender}
                  onValueChange={(val) => handleSelectChange('gender', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Golongan Darah (Opsional)</FieldLabel>
              <FieldContent>
                <div className="text-muted-foreground pt-2 text-sm">Tidak tersedia di form ini</div>
              </FieldContent>
            </Field>
          </FieldGroup>

          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Tempat Lahir</FieldLabel>
              <FieldContent>
                <Input
                  name="place_of_birth"
                  value={formData.place_of_birth}
                  onChange={handleChange}
                  required
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Tanggal Lahir</FieldLabel>
              <FieldContent>
                <Input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Status Keluarga</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.family_status}
                  onValueChange={(val) => handleSelectChange('family_status', val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HEAD_OF_FAMILY">Kepala Keluarga</SelectItem>
                    <SelectItem value="HUSBAND">Suami</SelectItem>
                    <SelectItem value="WIFE">Istri</SelectItem>
                    <SelectItem value="CHILD">Anak</SelectItem>
                    <SelectItem value="PARENT">Orang Tua</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Status Perkawinan</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.marital_status}
                  onValueChange={(val) => handleSelectChange('marital_status', val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MARRIED">Kawin</SelectItem>
                    <SelectItem value="SINGLE">Belum Kawin</SelectItem>
                    <SelectItem value="DEAD_DIVORCE">Cerai Mati</SelectItem>
                    <SelectItem value="LIVING_DIVORCE">Cerai Hidup</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Adat & Alamat</CardTitle>
          <CardDescription>Status kependudukan adat dan lokasi tinggal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup className="grid gap-4 md:grid-cols-3">
            <Field>
              <FieldLabel>Banjar Adat</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.banjar_id}
                  onValueChange={(val) => handleSelectChange('banjar_id', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Banjar" />
                  </SelectTrigger>
                  <SelectContent>
                    {banjars.map((banjar) => (
                      <SelectItem key={banjar.id} value={banjar.id.toString()}>
                        {banjar.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Status Krama (Iuran)</FieldLabel>
              <FieldContent>
                <Select
                  value={formData.resident_status_id}
                  onValueChange={(val) => handleSelectChange('resident_status_id', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status Krama" />
                  </SelectTrigger>
                  <SelectContent>
                    {residentStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id.toString()}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </FieldGroup>

          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>Alamat Asal (Sesuai KTP)</FieldLabel>
              <FieldContent>
                <Input
                  name="origin_address"
                  value={formData.origin_address}
                  onChange={handleChange}
                  placeholder="Jl..."
                  required
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Alamat Domisili (Di Desa)</FieldLabel>
              <FieldContent>
                <Input
                  name="residential_address"
                  value={formData.residential_address}
                  onChange={handleChange}
                  placeholder="Jl..."
                  required
                />
              </FieldContent>
            </Field>
          </FieldGroup>
          <Field>
            <FieldLabel>Nomor Rumah</FieldLabel>
            <FieldContent>
              <Input
                name="house_number"
                value={formData.house_number}
                onChange={handleChange}
                placeholder="No. 123"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Lokasi Rumah (GPS)</FieldLabel>
            <FieldContent>
              <div className="overflow-hidden rounded-lg border">
                <MapPicker value={location} onChange={setLocation} />
              </div>
              <div className="text-muted-foreground mt-1 text-xs">
                Klik pada peta untuk menandai lokasi rumah.{' '}
                {location
                  ? `Lat: ${location.lat.toFixed(6)}, Lng: ${location.lng.toFixed(6)}`
                  : 'Belum memilih lokasi.'}
              </div>
            </FieldContent>
          </Field>

          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel>No. Handphone / WA</FieldLabel>
              <FieldContent>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08..."
                  type="tel"
                />
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel>Email (Opsional)</FieldLabel>
              <FieldContent>
                <Input name="email" value={formData.email} onChange={handleChange} type="email" />
              </FieldContent>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dokumen Pendukung</CardTitle>
          <CardDescription>Upload foto dokumen anda. Pastikan terlihat jelas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Field>
            <FieldLabel>Foto Diri (Wajah Jelas)</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-4">
                <Input
                  name="resident_photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {files.resident_photo && (
                  <span className="text-sm text-green-600">
                    <UploadCloud className="inline h-4 w-4" /> Terpilih
                  </span>
                )}
              </div>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Foto KTP</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-4">
                <Input name="photo_ktp" type="file" accept="image/*" onChange={handleFileChange} />
                {files.photo_ktp && (
                  <span className="text-sm text-green-600">
                    <UploadCloud className="inline h-4 w-4" /> Terpilih
                  </span>
                )}
              </div>
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Foto Rumah (Tampak Depan)</FieldLabel>
            <FieldContent>
              <div className="flex items-center gap-4">
                <Input
                  name="photo_house"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {files.photo_house && (
                  <span className="text-sm text-green-600">
                    <UploadCloud className="inline h-4 w-4" /> Terpilih
                  </span>
                )}
              </div>
            </FieldContent>
          </Field>
        </CardContent>
      </Card>

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
