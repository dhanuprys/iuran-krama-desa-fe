import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ExternalLink, Loader2, MapPin, Users } from 'lucide-react';

import type { Family } from '@/types/entity';

import adminFamilyService from '@/services/admin-family.service';

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

export default function AdminFamilyDetailPage() {
  useBreadcrumb([{ title: 'Keluarga', href: '/admin/family' }, { title: 'Detail Keluarga' }]);

  const { id: family_card_number } = useParams();
  const navigate = useNavigate();
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (family_card_number) {
      fetchFamily(family_card_number);
    }
  }, [family_card_number]);

  const fetchFamily = async (id: string) => {
    try {
      const response = await adminFamilyService.getFamily(id);
      if (response.success && response.data) {
        setFamily(response.data);
      } else {
        setError('Data keluarga tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat detail keluarga.');
    } finally {
      setLoading(false);
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

  if (error || !family) {
    return (
      <LayoutContent>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Data tidak ditemukan'}</AlertDescription>
        </Alert>
        <Button variant="link" onClick={() => navigate('/admin/family')} className="mt-4">
          Kembali ke Daftar
        </Button>
      </LayoutContent>
    );
  }

  // Determine address from Head of Family or first member
  const address =
    family.head_of_family?.residential_address || family.members?.[0]?.residential_address || '-';
  const banjar = family.head_of_family?.banjar?.name || family.members?.[0]?.banjar?.name || '-';

  return (
    <LayoutContent>
      <PageHead title="Detail Keluarga" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/family')} />}
        header={
          <div>
            <LayoutContentHead>Detail Keluarga</LayoutContentHead>
            <LayoutContentSubHead>
              Informasi Kartu Keluarga No. {family.family_card_number}
            </LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <div className="grid gap-6">
          {/* Family Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum</CardTitle>
              <CardDescription>Detail informasi kartu keluarga</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">Nomor Kartu Keluarga</p>
                  <p className="text-lg font-semibold">{family.family_card_number}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">Kepala Keluarga</p>
                  {family.head_of_family ? (
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{family.head_of_family.name}</p>
                      <Badge variant="outline">NIK: {family.head_of_family.nik}</Badge>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">Belum ditentukan</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">Alamat</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <span>{address}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">Banjar</p>
                  <div className="flex items-center gap-2">
                    <Users className="text-muted-foreground h-4 w-4" />
                    <span>{banjar}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Family Members Table */}
          <Card>
            <CardHeader>
              <CardTitle>Anggota Keluarga</CardTitle>
              <CardDescription>Daftar penduduk yang terdaftar dalam KK ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIK</TableHead>
                      <TableHead>Nama Lengkap</TableHead>
                      <TableHead>Status Hubungan</TableHead>
                      <TableHead>Jenis Kelamin</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {family.members && family.members.length > 0 ? (
                      family.members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.nik}</TableCell>
                          <TableCell>{member.name}</TableCell>
                          <TableCell>
                            {member.family_status === 'HEAD_OF_FAMILY' ? (
                              <Badge variant="default">Kepala Keluarga</Badge>
                            ) : (
                              <Badge variant="secondary">
                                {member.family_status?.replace(/_/g, ' ') || '-'}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{member.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/resident/${member.id}`)}
                              title="Lihat Detail Penduduk"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                          Tidak ada anggota keluarga terdaftar.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutContentBody>
    </LayoutContent>
  );
}
