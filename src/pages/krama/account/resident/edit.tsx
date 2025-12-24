import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AlertCircle } from 'lucide-react';

import type { Resident } from '@/types/entity';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function KramaAccountResidentEditPage() {


  const { id } = useParams();
  const navigate = useNavigate();
  const [resident, setResident] = useState<Resident | null>(null);

  useBreadcrumb([
    { title: 'Akun' },
    { title: 'Penduduk' },
    { title: resident ? `Ubah Data Penduduk - ${resident.name}` : 'Ubah Data Penduduk' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchResident(id);
    }
  }, [id]);

  const fetchResident = async (residentId: string) => {
    setLoading(true);
    try {
      const response = await residentService.getResidentById(parseInt(residentId));
      const data = response.data;

      // Security check / UX check: Only pending or rejected allowed
      if (data.validation_status !== 'PENDING' && data.validation_status !== 'REJECTED') {
        setError('Data penduduk yang sudah disetujui tidak dapat diubah lagi.');
      } else {
        setResident(data);
      }
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 403) {
        setError('Anda tidak memiliki izin untuk mengubah data ini (Mungkin sudah disetujui).');
      } else {
        setError('Gagal memuat data penduduk.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (id) {
      await residentService.updateResident(id, formData);
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Edit Penduduk" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/account/resident')} />}
        header={
          <div>
            <LayoutContentHead>Ubah Data Penduduk</LayoutContentHead>
            <LayoutContentSubHead>
              Perbarui data penduduk (Hanya status Pending atau Ditolak)
            </LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        {resident?.validation_status === 'REJECTED' && resident.rejection_reason && (
          <Card className="border-destructive/50 bg-destructive/5 mb-6">
            <CardHeader className="pb-3">
              <div className="text-destructive flex items-center gap-2 text-lg font-bold">
                <AlertCircle className="h-5 w-5" />
                Pengajuan Ditolak
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border bg-white p-3 text-sm dark:bg-zinc-900">
                <span className="text-muted-foreground mr-2 font-semibold">Alasan Penolakan:</span>
                <span className="font-medium">{resident.rejection_reason}</span>
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Silakan perbaiki formulir di bawah ini dan tekan tombol "Ajukan Kembali".
              </p>
            </CardContent>
          </Card>
        )}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Tidak Dapat Mengubah Data</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : resident ? (
          <ResidentForm
            initialData={resident}
            onSubmit={handleSubmit}
            isEditing
            submitLabel={resident.validation_status === 'REJECTED' ? 'Ajukan Kembali' : undefined}
          />
        ) : (
          <div>Data tidak ditemukan</div>
        )}
      </LayoutContentBody>
    </LayoutContent>
  );
}
