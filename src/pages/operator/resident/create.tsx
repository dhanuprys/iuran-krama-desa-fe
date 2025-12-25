import { useState } from 'react';

import { toast } from 'sonner';

import type { FormValidationErrors } from '@/types/form';

import operatorResidentService from '@/services/operator-resident.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import {
  LayoutContent,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { ResidentForm } from '@/components/resident-form';

export default function OperatorResidentCreatePage() {
  useBreadcrumb([
    { title: 'Kelola Penduduk', href: '/operator/resident' },
    { title: 'Tambah Penduduk' },
  ]);

  const [errors, setErrors] = useState<FormValidationErrors | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setErrors(null);
    try {
      const response = await operatorResidentService.create(formData);
      if (response.success) {
        toast.success('Penduduk berhasil ditambahkan.');
      } else {
        toast.error(response.message || 'Gagal menambahkan penduduk.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error?.details) {
        setErrors(err.response.data.error.details);
        toast.error('Gagal menambahkan penduduk. Mohon periksa input form.');
      } else {
        const message =
          err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan data.';
        toast.error(message);
      }
      throw err; // Re-throw to allow ResidentForm to handle generic errors if needed, though we handle toast here
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Tambah Penduduk" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Tambah Penduduk</LayoutContentHead>
            <LayoutContentSubHead>Tambahkan data penduduk baru secara manual.</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <ResidentForm
          onSubmit={handleSubmit}
          cancelPath="/operator/resident"
          successPath="/operator/resident"
          serverErrors={errors}
        />
      </LayoutContentBody>
    </LayoutContent>
  );
}
