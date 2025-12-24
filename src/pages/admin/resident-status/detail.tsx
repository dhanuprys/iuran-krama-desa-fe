import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Edit, Trash } from 'lucide-react';

import residentStatusService, { type ResidentStatus } from '@/services/resident-status.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import {
  LayoutContent,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { formatCurrency } from '@/lib/utils';

export default function AdminResidentStatusDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<ResidentStatus | null>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useBreadcrumb([
    { title: 'Status Warga', href: '/admin/resident-status' },
    { title: status ? `Detail Status - ${status.name}` : 'Detail Status' },
  ]);

  useEffect(() => {
    if (id) {
      fetchStatus(Number(id));
    }
  }, [id]);

  const fetchStatus = async (statusId: number) => {
    try {
      const response = await residentStatusService.getById(statusId);
      if (response.success && response.data) {
        setStatus(response.data);
      } else {
        setError(response.message || 'Gagal mengambil data status.');
      }
    } catch (err) {
      setError('Gagal mengambil data status.');
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!status) return;

    try {
      const response = await residentStatusService.delete(status.id);
      if (response.success) {
        navigate('/admin/resident-status');
      } else {
        setError(response.message || 'Gagal menghapus status.');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat menghapus data.',
      );
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (fetching) {
    return (
      <LayoutContent>
        <PageHead title="Detail Status Warga" />
        <LayoutContentHeader
          header={
            <div>
              <LayoutContentHead>Detail Status Warga</LayoutContentHead>
              <LayoutContentSubHead>Informasi detail status kependudukan.</LayoutContentSubHead>
            </div>
          }
        />
        <LayoutContentBody>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <div className="text-muted-foreground mb-2 text-sm font-medium">ID</div>
                  <Skeleton className="h-6 w-12" />
                </div>
                <div>
                  <div className="text-muted-foreground mb-2 text-sm font-medium">Nama Status</div>
                  <Skeleton className="h-6 w-48" />
                </div>
                <div>
                  <div className="text-muted-foreground mb-2 text-sm font-medium">Jumlah Iuran</div>
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  if (!status) {
    return (
      <LayoutContent>
        <LayoutContentBody>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Data tidak ditemukan.</AlertDescription>
          </Alert>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Detail Status Warga" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Detail Status Warga</LayoutContentHead>
            <LayoutContentSubHead>Informasi detail status kependudukan.</LayoutContentSubHead>
          </div>
        }
        info={
          <div className="flex space-x-2">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash className="mr-2 h-4 w-4" /> Hapus
            </Button>
            <Button onClick={() => navigate(`/admin/resident-status/${status.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </div>
        }
      />
      <LayoutContentBody>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="text-muted-foreground text-sm font-medium">ID</div>
                <div>{status.id}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm font-medium">Nama Status</div>
                <div className="font-semibold">{status.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm font-medium">Jumlah Iuran</div>
                <div>{formatCurrency(status.contribution_amount)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </LayoutContentBody>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data status warga yang dihapus tidak dapat
              dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 focus:ring-red-600">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutContent>
  );
}
