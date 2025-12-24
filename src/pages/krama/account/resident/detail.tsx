import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link, useNavigate, useParams } from 'react-router-dom';

import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import {
  ArrowLeftIcon,
  CheckCircle2,
  Clock,
  EditIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  XCircle,
} from 'lucide-react';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

import { formatFamilyStatus } from '@/lib/utils';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export default function KramaResidentDetailPage() {


  const navigate = useNavigate();
  const { id: residentId } = useParams();
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useBreadcrumb([
    { title: 'Akun' },
    { title: 'Penduduk', href: '/account/resident' },
    {
      title: resident ? `Detail Penduduk - ${resident.name}` : 'Detail Penduduk',
    },
  ]);

  useEffect(() => {
    if (residentId) {
      fetchResident(residentId);
    }
  }, [residentId]);

  const fetchResident = async (id: string) => {
    setLoading(true);
    try {
      const data = await residentService.getResidentById(id);
      setResident(data.data as any); // Unwrap data wrapper if needed
    } catch (err) {
      console.error(err);
      setError('Gagal memuat detail penduduk.');
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

  const getLocation = (loc: any) => {
    if (!loc) return null;
    if (typeof loc === 'string') {
      try {
        const parsed = JSON.parse(loc);
        return { lat: parseFloat(parsed.lat), lng: parseFloat(parsed.lng) };
      } catch (e) {
        return null;
      }
    }
    if (typeof loc === 'object') {
      return { lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) };
    }
    return null;
  };

  const location = resident ? getLocation(resident.location) : null;

  if (loading) {
    return (
      <LayoutContent>
        <LayoutContentBody>
          <div className="space-y-6">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-20" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Skeleton className="h-[400px]" />
              <Skeleton className="h-[400px] md:col-span-2" />
            </div>
          </div>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  if (error || !resident) {
    return (
      <LayoutContent>
        <LayoutContentBody>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Data tidak ditemukan'}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link to="/account/resident">
                <ArrowLeftIcon className="mr-2 h-4 w-4" /> Kembali ke Daftar
              </Link>
            </Button>
          </div>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Detail Penduduk" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/account/resident')} />}
        header={
          <div>
            <LayoutContentHead>{resident.name}</LayoutContentHead>
            <LayoutContentSubHead className="flex items-center gap-2">
              NIK: {resident.nik} <span className="text-muted-foreground">•</span>{' '}
              {getStatusBadge(resident.validation_status)}
            </LayoutContentSubHead>
          </div>
        }
        info={
          (resident.validation_status === 'PENDING' ||
            resident.validation_status === 'REJECTED') && (
            <Button
              asChild
              variant={resident.validation_status === 'REJECTED' ? 'destructive' : 'default'}
            >
              <Link to={`/account/resident/${resident.id}/edit`}>
                <EditIcon className="mr-2 h-4 w-4" />
                {resident.validation_status === 'REJECTED' ? 'Perbaiki Data' : 'Ubah Data'}
              </Link>
            </Button>
          )
        }
      />
      <LayoutContentBody>
        {resident.validation_status === 'REJECTED' && resident.rejection_reason && (
          <Card className="border-destructive/50 bg-destructive/5 mb-6">
            <CardHeader className="pb-3">
              <div className="text-destructive flex items-center gap-2 text-lg font-bold">
                <XCircle className="h-5 w-5" />
                Pengajuan Ditolak
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="rounded-md border bg-white p-3 text-sm dark:bg-zinc-900">
                  <span className="text-muted-foreground mr-2 font-semibold">
                    Alasan Penolakan:
                  </span>
                  <span className="font-medium">{resident.rejection_reason}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Mohon perbaiki data sesuai catatan di atas dan ajukan kembali.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Summary and Map */}
          <div className="space-y-6">
            <Card>
              <CardContent className="flex flex-col items-center pt-6 text-center">
                <Avatar className="border-muted h-32 w-32 border-4">
                  <AvatarImage
                    src={resident.resident_photo || undefined}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    <UserIcon className="text-muted-foreground h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-bold">{resident.name}</h3>

                <p className="text-primary mt-1 text-sm font-medium">
                  {resident.resident_status?.name}
                </p>
                <div className="text-muted-foreground mt-1 flex items-center gap-1 text-sm">
                  <MapPinIcon className="h-3 w-3" />
                  {resident.banjar?.name || '-'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lokasi Rumah</CardTitle>
              </CardHeader>
              <CardContent className="relative h-[250px] overflow-hidden p-0">
                {location ? (
                  <MapContainer
                    center={location}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={location}>
                      <Popup>{resident.name}</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <div className="text-muted-foreground bg-muted/20 flex h-full items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="mx-auto mb-2 h-8 w-8 opacity-50" />
                      <p>Lokasi belum ditandai</p>
                    </div>
                  </div>
                )}
              </CardContent>
              {/* Only show coordinates if available */}
              {location && (
                <div className="bg-muted/10 text-muted-foreground border-t p-4 text-xs">
                  Lat: {location.lat}, Lng: {location.lng}
                </div>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                    <PhoneIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">No. Telepon / WA</p>
                    <p className="font-medium">{resident.phone || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                    <MailIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <p className="font-medium">{resident.email || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
                <CardDescription>Data detail identitas penduduk</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">NIK</p>
                    <p className="text-lg font-medium">{resident.nik}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Nomor Kartu Keluarga</p>
                    <p className="text-lg font-medium">{resident.family_card_number}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Tempat, Tanggal Lahir</p>
                    <p className="font-medium">
                      {resident.place_of_birth},{' '}
                      {new Date(resident.date_of_birth).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Jenis Kelamin</p>
                    <p className="font-medium">
                      {resident.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Agama</p>
                    <p className="font-medium">{resident.religion}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Pekerjaan</p>
                    <p className="font-medium">{resident.work_type || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Status Perkawinan</p>
                    <p className="font-medium">{formatFamilyStatus(resident.marital_status)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Status Keluarga</p>
                    <p className="font-medium">{formatFamilyStatus(resident.family_status)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alamat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Alamat Asal (Sesuai KTP)</p>
                  <p className="font-medium">{resident.origin_address}</p>
                </div>
                <Separator />
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm">Alamat Domisili</p>
                    <p className="font-medium">{resident.residential_address}</p>
                    {resident.residence_name && (
                      <p className="text-muted-foreground text-sm">
                        Perumahan: {resident.residence_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="flex gap-4">
                      <div>
                        <p className="text-muted-foreground mb-1 text-sm">RT</p>
                        <p className="font-medium">{resident.rt_number || '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1 text-sm">Nomor Rumah</p>
                        <p className="font-medium">{resident.house_number || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Banjar Adat</p>
                  <p className="font-medium">{resident.banjar?.name}</p>
                  <p className="text-muted-foreground text-xs">{resident.banjar?.address}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dokumen</CardTitle>
                <CardDescription>Foto dokumen pendukung</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Foto KTP</p>
                    <div className="bg-muted/20 flex aspect-video items-center justify-center overflow-hidden rounded-lg border">
                      <Avatar
                        className="h-full w-full cursor-pointer rounded-none transition-transform hover:scale-105"
                        onClick={() =>
                          resident.photo_ktp && window.open(resident.photo_ktp, '_blank')
                        }
                      >
                        <AvatarImage
                          src={resident.photo_ktp || undefined}
                          alt="KTP"
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-none">
                          <span className="text-muted-foreground text-sm">Tidak ada foto</span>
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Foto Rumah</p>
                    <div className="bg-muted/20 flex aspect-video items-center justify-center overflow-hidden rounded-lg border">
                      <Avatar
                        className="h-full w-full cursor-pointer rounded-none transition-transform hover:scale-105"
                        onClick={() =>
                          resident.photo_house && window.open(resident.photo_house, '_blank')
                        }
                      >
                        <AvatarImage
                          src={resident.photo_house || undefined}
                          alt="Rumah"
                          className="object-cover"
                        />
                        <AvatarFallback className="rounded-none">
                          <span className="text-muted-foreground text-sm">Tidak ada foto</span>
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutContentBody>
    </LayoutContent>
  );
}
