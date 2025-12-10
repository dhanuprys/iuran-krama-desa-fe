import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, Edit, Loader2 } from 'lucide-react';

import adminAnnouncementService, { type Announcement } from '@/services/admin-announcement.service';

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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminAnnouncementDetailPage() {
  useBreadcrumb([
    { title: 'Kelola Pengumuman', href: '/admin/announcement' },
    { title: 'Detail Pengumuman' },
  ]);

  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchAnnouncement(parseInt(id));
    }
  }, [id]);

  const fetchAnnouncement = async (announcementId: number) => {
    try {
      const response = await adminAnnouncementService.getAnnouncement(announcementId);
      if (response.success && response.data) {
        setAnnouncement(response.data);
      } else {
        setError('Data pengumuman tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat data pengumuman.');
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

  if (error || !announcement) {
    return (
      <LayoutContent>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Data tidak ditemukan'}</AlertDescription>
        </Alert>
        <Button variant="link" onClick={() => navigate('/admin/announcement')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
        </Button>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Detail Pengumuman" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/announcement')} />}
        header={
          <div>
            <LayoutContentHead>Detail Pengumuman</LayoutContentHead>
            <LayoutContentSubHead>Informasi detail pengumuman</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">{announcement.title}</CardTitle>
              <Badge variant={announcement.is_active ? 'default' : 'secondary'}>
                {announcement.is_active ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Dibuat pada:{' '}
              {new Date(announcement.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </CardHeader>
          <CardContent className="leading-relaxed whitespace-pre-wrap">
            {announcement.content}
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate(`/admin/announcement/${announcement.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Pengumuman
            </Button>
          </CardFooter>
        </Card>
      </LayoutContentBody>
    </LayoutContent>
  );
}
