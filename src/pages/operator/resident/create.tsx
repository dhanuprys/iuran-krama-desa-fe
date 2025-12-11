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

  const handleSubmit = async (formData: FormData) => {
    await operatorResidentService.create(formData);
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
        />
      </LayoutContentBody>
    </LayoutContent>
  );
}
