import { useNavigate } from 'react-router-dom';

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
  useBreadcrumb([{ title: 'Akun' }, { title: 'Penduduk' }, { title: 'Tambah Penduduk' }]);

  const handleSubmit = async (formData: FormData) => {
    await residentService.createResident(formData);
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
        <ResidentForm onSubmit={handleSubmit} />
      </LayoutContentBody>
    </LayoutContent>
  );
}
