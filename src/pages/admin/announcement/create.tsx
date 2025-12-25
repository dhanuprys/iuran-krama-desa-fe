import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import type { FormValidationErrors } from '@/types/form';

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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import { getFieldErrors } from '@/lib/utils';

export default function AdminAnnouncementCreatePage() {
  useBreadcrumb([
    { title: 'Kelola Pengumuman', href: '/admin/announcement' },
    { title: 'Tambah Pengumuman' },
  ]);

  const navigate = useNavigate();
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormValidationErrors | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      const response = await adminAnnouncementService.createAnnouncement(formData);
      if (response.success) {
        toast.success('Pengumuman berhasil dibuat.');
        navigate('/admin/announcement');
      } else {
        toast.error(response.error?.message || 'Gagal membuat pengumuman.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error?.details) {
        setErrors(err.response.data.error.details);
        toast.error('Gagal membuat pengumuman. Mohon periksa input form.');
      } else {
        const message = err.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Tambah Pengumuman" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Tambah Pengumuman</LayoutContentHead>
            <LayoutContentSubHead>Buat pengumuman baru</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="space-y-4 pt-6">
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
                <FieldError errors={getFieldErrors(errors, 'title')} />
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
                <FieldError errors={getFieldErrors(errors, 'content')} />
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
                <Save className="mr-2 h-4 w-4" /> Simpan
              </Button>
            </CardFooter>
          </Card>
        </form>
      </LayoutContentBody>
    </LayoutContent>
  );
}
