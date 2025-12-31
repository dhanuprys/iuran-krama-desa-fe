import { useState } from 'react';

import { toast } from 'sonner';

import type { FormValidationErrors } from '@/types/form';

import adminResidentService from '@/services/admin-resident.service';

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

export default function AdminResidentCreatePage() {
  const [serverErrors, setServerErrors] = useState<FormValidationErrors | null>(null);

  useBreadcrumb([
    { title: 'Kelola Penduduk', href: '/admin/resident' },
    { title: 'Tambah Penduduk' },
  ]);

  const handleSubmit = async (formData: FormData) => {
    setServerErrors(null);
    try {
      const response = await adminResidentService.create(formData);
      if (response.success) {
        toast.success('Data penduduk berhasil ditambahkan.');
      } else {
        toast.error(response.message || 'Gagal menambahkan data penduduk.');
      }
    } catch (err: any) {
      console.error(err);
      if (err?.response?.data?.error?.details) {
        setServerErrors(err.response.data.error.details);
        toast.error('Gagal menambahkan data. Mohon periksa input form.');
      } else {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'Terjadi kesalahan saat menyimpan data.';
        toast.error(message);
      }
      throw err;
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
          cancelPath="/admin/resident"
          successPath="/admin/resident"
          serverErrors={serverErrors}
        />
      </LayoutContentBody>
    </LayoutContent>
  );
}
