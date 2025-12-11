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
  useBreadcrumb([
    { title: 'Kelola Penduduk', href: '/admin/resident' },
    { title: 'Tambah Penduduk' },
  ]);

  const handleSubmit = async (formData: FormData) => {
    await adminResidentService.create(formData);
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
        />
      </LayoutContentBody>
    </LayoutContent>
  );
}
