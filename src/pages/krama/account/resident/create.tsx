import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';

import type { FormValidationErrors } from '@/types/form';

import residentService from '@/services/krama-resident.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import {
  LayoutContent,
  LayoutContentBackButton,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { ResidentForm } from '@/components/resident-form';

export default function KramaAccountResidentCreatePage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormValidationErrors | null>(null);

  useBreadcrumb([{ title: 'Akun' }, { title: 'Penduduk' }, { title: 'Tambah Penduduk' }]);

  const handleSubmit = async (formData: FormData) => {
    setErrors(null);
    try {
      await residentService.createResident(formData);
      toast.success('Permintaan tambah penduduk berhasil dikirim.');
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error?.details) {
        setErrors(err.response.data.error.details);
        toast.error('Gagal mengirim data. Mohon periksa input form.');
      } else {
        const message =
          err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan data.';
        toast.error(message);
      }
      throw err;
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Tambah Penduduk" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/account/resident')} />}
        header={
          <div>
            <LayoutContentHead>Tambah Penduduk</LayoutContentHead>
            <LayoutContentSubHead>
              Isi data penduduk baru dengan lengkap dan benar.
            </LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <ResidentForm onSubmit={handleSubmit} serverErrors={errors} />
      </LayoutContentBody>
    </LayoutContent>
  );
}
