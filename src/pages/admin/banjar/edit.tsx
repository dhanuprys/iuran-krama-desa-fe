import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import type { FormValidationErrors } from '@/types/form';

import adminBanjarService from '@/services/admin-banjar.service';

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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { getFieldErrors } from '@/lib/utils';

export default function AdminBanjarEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [errors, setErrors] = useState<FormValidationErrors | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });

  useBreadcrumb([
    { title: 'Kelola Banjar', href: '/admin/banjar' },
    { title: formData.name ? `Edit Banjar - ${formData.name}` : 'Edit Banjar' },
  ]);

  useEffect(() => {
    const fetchBanjar = async () => {
      if (!id) return;
      try {
        const response = await adminBanjarService.getBanjar(parseInt(id));
        if (response.success && response.data) {
          setFormData({
            name: response.data.name,
            address: response.data.address || '',
          });
        } else {
          toast.error('Data banjar tidak ditemukan.');
        }
      } catch (err) {
        toast.error('Gagal memuat data banjar.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBanjar();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    if (!id) return;

    try {
      const response = await adminBanjarService.updateBanjar(parseInt(id), formData);
      if (response.success) {
        toast.success('Banjar berhasil diperbarui.');
        navigate('/admin/banjar');
      } else {
        toast.error(response.error?.message || 'Gagal memperbarui banjar.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error?.details) {
        setErrors(err.response.data.error.details);
        toast.error('Gagal memperbarui banjar. Mohon periksa input form.');
      } else {
        const message =
          err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan data.';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Edit Banjar" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/banjar')} />}
        header={
          <div>
            <LayoutContentHead>Edit Banjar</LayoutContentHead>
            <LayoutContentSubHead>Perbarui informasi banjar.</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Banjar</CardTitle>
              <CardDescription>Ubah data banjar di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama Banjar <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Contoh: Banjar Dauh Peken"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <FieldError errors={getFieldErrors(errors, 'name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Alamat lengkap banjar"
                  value={formData.address}
                  onChange={handleChange}
                />
                <FieldError errors={getFieldErrors(errors, 'address')} />
              </div>
            </CardContent>
          </Card>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/banjar')}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
            </Button>
          </div>
        </form>
      </LayoutContentBody>
    </LayoutContent>
  );
}
