import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loader2, Save } from 'lucide-react';

import adminAnnouncementService, {
  type AnnouncementFormData,
} from '@/services/admin-announcement.service';

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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

export default function AdminAnnouncementEditPage() {
  useBreadcrumb([
    { title: 'Kelola Pengumuman', href: '/admin/announcement' },
    { title: 'Ubah Pengumuman' },
  ]);

  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
        setFormData({
          title: response.data.title,
          content: response.data.content,
          is_active: response.data.is_active,
        });
      } else {
        setError('Data pengumuman tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat data pengumuman.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!id) return;

    try {
      const response = await adminAnnouncementService.updateAnnouncement(parseInt(id), formData);
      if (response.success) {
        navigate('/admin/announcement');
      } else {
        setError(response.error?.message || 'Gagal memperbarui pengumuman.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <LayoutContent>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Edit Pengumuman" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Ubah Pengumuman</LayoutContentHead>
            <LayoutContentSubHead>Perbarui informasi pengumuman</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Judul pengumuman..."
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Konten</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  placeholder="Isi pengumuman..."
                  rows={5}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  disabled={loading}
                />
                <Label htmlFor="is_active">Aktifkan Pengumuman</Label>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/announcement')}
                className="mr-2"
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
              </Button>
            </CardFooter>
          </Card>
        </form>
      </LayoutContentBody>
    </LayoutContent>
  );
}
