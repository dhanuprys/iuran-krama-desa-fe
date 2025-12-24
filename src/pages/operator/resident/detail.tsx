import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, Edit, Loader2, MapPin } from 'lucide-react';
import { ImageIcon } from 'lucide-react';

import type { Resident } from '@/types/entity';

import operatorResidentService from '@/services/operator-resident.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import {
  LayoutContent,
  LayoutContentBackButton,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { MapPicker } from '@/components/map-picker';
import { PageHead } from '@/components/page-head';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { formatCurrency } from '@/lib/utils';

export default function OperatorResidentDetailPage() {


  const { id } = useParams();
  const navigate = useNavigate();
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useBreadcrumb([
    { title: 'Kelola Penduduk', href: '/operator/resident' },
    {
      title: resident ? `Detail Penduduk - ${resident.name}` : 'Detail Penduduk',
    },
  ]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (id) {
      fetchResident(parseInt(id));
    }
  }, [id]);

  const fetchResident = async (residentId: number) => {
    try {
      const response = await operatorResidentService.getOne(residentId);
      if (response.success && response.data) {
        setResident(response.data);
        if (response.data.location) {
          try {
            const parsed = JSON.parse(response.data.location);
            setLocation({ lat: parseFloat(parsed.lat), lng: parseFloat(parsed.lng) });
          } catch (e) {
            console.error('Failed to parse location', e);
          }
        }
      } else {
        setError('Data penduduk tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat data penduduk.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_BASE_URL}/storage/${path}`;
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
          <AlertDescription>{error || 'Data tidak ditemukan'}</AlertDescription>
        </Alert>
        <Button variant="link" onClick={() => navigate('/operator/resident')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
        </Button>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Detail Penduduk" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/operator/resident')} />}
        header={
          <div>
            <LayoutContentHead>Detail Penduduk</LayoutContentHead>
            <LayoutContentSubHead>
              Informasi lengkap data penduduk: {resident.name}
            </LayoutContentSubHead>
          </div>
        }
        info={
          <div className="flex gap-2">
            <Button onClick={() => navigate(`/operator/resident/${resident.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Data
            </Button>
          </div>
        }
      />
      <LayoutContentBody>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profil & Kontak</TabsTrigger>
            <TabsTrigger value="documents">Dokumen & Foto</TabsTrigger>
            <TabsTrigger value="location">Lokasi</TabsTrigger>
            <TabsTrigger value="history">Riwayat Pembayaran</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Data Pribadi</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">NIK</p>
                      <p className="font-mono font-medium">{resident.nik}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">No. KK</p>
                      <p className="font-mono font-medium">{resident.family_card_number}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Nama Lengkap</p>
                    <p className="text-lg font-medium">{resident.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">Jenis Kelamin</p>
                      <p>{resident.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Tanggal Lahir</p>
                      <p>
                        {new Date(resident.date_of_birth).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-muted-foreground text-xs">{resident.place_of_birth}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">Status Keluarga</p>
                      <p>{resident.family_status?.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Status Perkawinan</p>
                      <p>{resident.marital_status?.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">Agama</p>
                      <p>{resident.religion || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Pekerjaan</p>
                      <p>{resident.work_type || '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status & Kontak</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Status Validasi</p>
                    <Badge
                      variant={
                        resident.validation_status === 'APPROVED'
                          ? 'default'
                          : resident.validation_status === 'PENDING'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {resident.validation_status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">Banjar</p>
                      <p className="font-medium">{resident.banjar?.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Status Krama</p>
                      <p>{resident.resident_status?.name || '-'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Alamat Domisili</p>
                    <p>{resident.residential_address}</p>
                    <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      {resident.rt_number && <p>RT: {resident.rt_number}</p>}
                      {resident.house_number && <p>No. Rumah: {resident.house_number}</p>}
                    </div>
                    {resident.residence_name && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        Perumahan: {resident.residence_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Alamat Asal (KTP)</p>
                    <p>{resident.origin_address}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-sm">No. Telepon / WA</p>
                      <p className="font-mono">{resident.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-sm">Email</p>
                      <p>{resident.email || '-'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Foto & Dokumen</CardTitle>
                <CardDescription>Dokumen yang diunggah oleh penduduk.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Foto Profil</p>
                    <Avatar className="aspect-square h-full w-full max-w-[300px] rounded-lg border">
                      <AvatarImage
                        src={getImageUrl(resident.resident_photo) || undefined}
                        alt="Foto Profil"
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-lg">
                        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs">Tidak ada foto</span>
                        </div>
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Foto KTP</p>
                    <Avatar className="aspect-video h-full w-full rounded-lg border">
                      <AvatarImage
                        src={getImageUrl(resident.photo_ktp) || undefined}
                        alt="Foto KTP"
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-lg">
                        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs">Tidak ada foto</span>
                        </div>
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Foto Rumah</p>
                    <Avatar className="aspect-video h-full w-full rounded-lg border">
                      <AvatarImage
                        src={getImageUrl(resident.photo_house) || undefined}
                        alt="Foto Rumah"
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-lg">
                        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs">Tidak ada foto</span>
                        </div>
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Lokasi Rumah</CardTitle>
                <CardDescription>Titik koordinat lokasi rumah penduduk.</CardDescription>
              </CardHeader>
              <CardContent>
                {location ? (
                  <div className="h-[400px] overflow-hidden rounded-lg border">
                    <MapPicker value={location} onChange={() => { }} />
                  </div>
                ) : (
                  <div className="bg-muted text-muted-foreground flex h-[200px] flex-col items-center justify-center rounded-lg border">
                    <MapPin className="mb-2 h-8 w-8 opacity-50" />
                    <p>Lokasi belum ditandai.</p>
                  </div>
                )}
                {location && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Latitude:</span>{' '}
                      <span className="font-mono">{location.lat}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Longitude:</span>{' '}
                      <span className="font-mono">{location.lng}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Tagihan</CardTitle>
                <CardDescription>Daftar tagihan dan pembayaran penduduk ini.</CardDescription>
              </CardHeader>
              <CardContent>
                {!resident.invoices || resident.invoices.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center">
                    Belum ada riwayat tagihan.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Keterangan</TableHead>
                        <TableHead>Total Tagihan</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resident.invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>
                            {new Date(invoice.invoice_date).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>
                            Iuran Bulanan
                            {invoice.payments && invoice.payments.length > 0 && (
                              <div className="text-muted-foreground mt-1 text-xs">
                                Dibayar pada:{' '}
                                {new Date(invoice.payments[0].date).toLocaleDateString('id-ID')}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                invoice.payments &&
                                  invoice.payments.length > 0 &&
                                  invoice.payments[0].status === 'paid'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {invoice.payments && invoice.payments.length > 0
                                ? invoice.payments[0].status
                                : 'UNPAID'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </LayoutContentBody>
    </LayoutContent>
  );
}
