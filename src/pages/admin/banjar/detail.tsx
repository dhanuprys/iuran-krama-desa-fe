import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, Edit, Loader2, MapPin, Users } from 'lucide-react';

import adminBanjarService, { type Banjar } from '@/services/admin-banjar.service';

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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AdminBanjarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [banjar, setBanjar] = useState<Banjar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useBreadcrumb([{ title: 'Kelola Banjar', href: '/admin/banjar' }, { title: 'Detail Banjar' }]);

  useEffect(() => {
    const fetchBanjar = async () => {
      if (!id) return;
      try {
        const response = await adminBanjarService.getBanjar(parseInt(id));
        if (response.success && response.data) {
          setBanjar(response.data);
        } else {
          setError('Data banjar tidak ditemukan.');
        }
      } catch (err) {
        setError('Gagal memuat data banjar.');
      } finally {
        setLoading(false);
      }
    };

    fetchBanjar();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !banjar) {
    return (
      <LayoutContent>
        <LayoutContentBody>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Banjar tidak ditemukan'}</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => navigate('/admin/banjar')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
          </Button>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Detail Banjar" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/banjar')} />}
        header={
          <div>
            <LayoutContentHead>Detail Banjar</LayoutContentHead>
            <LayoutContentSubHead>Informasi detail banjar.</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{banjar.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {banjar.address || '-'}
              </CardDescription>
            </div>
            <Button onClick={() => navigate(`/admin/banjar/${banjar.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </CardHeader>
          <CardContent className="mt-4 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground text-sm font-medium">
                    Jumlah Penduduk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-2xl font-bold">
                    <Users className="text-primary h-6 w-6" />
                    {banjar.residents_count ?? 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="text-muted-foreground grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="text-foreground font-medium">Dibuat pada:</span>{' '}
                {new Date(banjar.created_at).toLocaleDateString('id-ID', {
                  dateStyle: 'full',
                })}
              </div>
              <div>
                <span className="text-foreground font-medium">Diperbarui pada:</span>{' '}
                {new Date(banjar.updated_at).toLocaleDateString('id-ID', {
                  dateStyle: 'full',
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </LayoutContentBody>
    </LayoutContent>
  );
}
