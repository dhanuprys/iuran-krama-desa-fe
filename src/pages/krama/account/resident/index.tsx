import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  CheckCircle2,
  Clock,
  EditIcon,
  MapPinIcon,
  PlusIcon,
  UserIcon,
  XCircle,
} from 'lucide-react';

import type { Resident } from '@/types/entity';
import type { PaginatedResponse } from '@/types/http';

import residentService from '@/services/krama-resident.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import { AppPagination } from '@/components/app-pagination';
import {
  LayoutContent,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { formatFamilyStatus } from '@/lib/utils';

export default function KramaAccountResidentPage() {
  useBreadcrumb([{ title: 'Akun' }, { title: 'Penduduk' }]);

  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginatedResponse<Resident>['meta'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResidents(1);
  }, []);

  const fetchResidents = async (page: number) => {
    setLoading(true);
    try {
      const data = await residentService.getResidents(page);
      setResidents(data.data);
      setMeta(data.meta);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data penduduk.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Disetujui
          </Badge>
        );
      case 'PENDING':
        return (
          <Badge className="bg-yellow-600 hover:bg-yellow-700">
            <Clock className="mr-1 h-3 w-3" /> Menunggu Validasi
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Ditolak
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Daftar Penduduk" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Penduduk</LayoutContentHead>
            <LayoutContentSubHead>Status data kependudukan anda</LayoutContentSubHead>
          </div>
        }
        info={
          <Button asChild>
            <Link to="/account/resident/create">
              <PlusIcon className="mr-2 h-4 w-4" />
              Tambah Penduduk
            </Link>
          </Button>
        }
      />
      <LayoutContentBody>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : residents.length === 0 ? (
          <div className="text-muted-foreground bg-muted/30 rounded-lg border border-dashed py-10 text-center">
            <p className="mb-4">Anda belum mendaftarkan data penduduk.</p>
            <Button asChild variant="outline">
              <Link to="/account/resident/create">Mulai Pendaftaran</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {residents.map((resident) => (
              <Card key={resident.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 md:flex-row">
                    <Avatar className="border-border h-16 w-16 border-2 md:h-20 md:w-20">
                      <AvatarImage
                        src={resident.resident_photo || undefined}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        <UserIcon className="text-muted-foreground h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
                        <div>
                          <h3 className="text-lg font-semibold">{resident.name}</h3>
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <span>NIK: {resident.nik}</span>
                            <span className="hidden md:inline">•</span>
                            <span className="flex items-center gap-1">
                              <MapPinIcon className="h-3 w-3" />{' '}
                              {resident.banjar?.name || 'Banjar?'}
                            </span>
                          </div>
                        </div>
                        {getStatusBadge(resident.validation_status)}
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1 text-sm md:grid-cols-2">
                        <div className="grid grid-cols-[100px_1fr]">
                          <span className="text-muted-foreground">Jenis Kelamin:</span>
                          <span>{resident.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                        </div>
                        <div className="grid grid-cols-[100px_1fr]">
                          <span className="text-muted-foreground">Status:</span>
                          <span>{formatFamilyStatus(resident.family_status)}</span>
                        </div>

                        <div className="grid grid-cols-[100px_1fr]">
                          <span className="text-muted-foreground">Alamat:</span>
                          <span className="truncate">{resident.residential_address || '-'}</span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      {/* Action Bar */}
                      <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                        <Button asChild variant="secondary" size="sm">
                          <Link to={`/account/resident/${resident.id}`}>Lihat Detail</Link>
                        </Button>
                        {(resident.validation_status === 'PENDING' ||
                          resident.validation_status === 'REJECTED') && (
                          <Button
                            asChild
                            variant={
                              resident.validation_status === 'REJECTED' ? 'destructive' : 'outline'
                            }
                            size="sm"
                          >
                            <Link to={`/account/resident/${resident.id}/edit`}>
                              <EditIcon className="mr-2 h-3.5 w-3.5" />
                              {resident.validation_status === 'REJECTED'
                                ? 'Perbaiki Data'
                                : 'Ubah Data'}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <AppPagination meta={meta} onPageChange={(p) => fetchResidents(p)} className="mt-6" />
          </div>
        )}
      </LayoutContentBody>
    </LayoutContent>
  );
}
