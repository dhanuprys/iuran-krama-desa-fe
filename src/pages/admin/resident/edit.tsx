import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Loader2 } from 'lucide-react';

import adminResidentService, { type Resident } from '@/services/admin-resident.service';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminResidentEditPage() {


  const { id } = useParams();
  const [resident, setResident] = useState<Resident | null>(null);

  useBreadcrumb([
    { title: 'Kelola Penduduk', href: '/admin/resident' },
    { title: resident ? `Edit Penduduk - ${resident.name}` : 'Edit Penduduk' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchResident(parseInt(id));
    }
  }, [id]);

  const fetchResident = async (residentId: number) => {
    try {
      const response = await adminResidentService.getOne(residentId);
      if (response.success && response.data) {
        setResident(response.data);
      } else {
        setError('Data penduduk tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat data penduduk.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (id) {
      await adminResidentService.update(parseInt(id), formData);
    }
  };

  if (loading) {
    return (
      <LayoutContent>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </LayoutContent>
    );
  }

  if (error || !resident) {
    return (
      <LayoutContent>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Data penduduk tidak ditemukan.'}</AlertDescription>
        </Alert>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Edit Penduduk" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Edit Penduduk</LayoutContentHead>
            <LayoutContentSubHead>Perbarui informasi data penduduk.</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <ResidentForm
          initialData={resident}
          onSubmit={handleSubmit}
          isEditing={true}
          cancelPath="/admin/resident"
          successPath="/admin/resident"
        />
      </LayoutContentBody>
    </LayoutContent>
  );
}
