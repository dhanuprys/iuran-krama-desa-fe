import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function AdminBanjarCreatePage() {
  useBreadcrumb([{ title: 'Kelola Banjar', href: '/admin/banjar' }, { title: 'Tambah Banjar' }]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormValidationErrors | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      const response = await adminBanjarService.createBanjar(formData);
      if (response.success) {
        toast.success('Banjar berhasil dibuat.');
        navigate('/admin/banjar');
      } else {
        toast.error(response.error?.message || 'Gagal membuat banjar.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error?.details) {
        setErrors(err.response.data.error.details);
        toast.error('Gagal membuat banjar. Mohon periksa input form.');
      } else {
        const message =
          err.response?.data?.message || err.message || 'Terjadi kesalahan saat menyimpan data.';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Tambah Banjar" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/banjar')} />}
        header={
          <div>
            <LayoutContentHead>Tambah Banjar</LayoutContentHead>
            <LayoutContentSubHead>Tambahkan banjar baru ke dalam sistem.</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Banjar</CardTitle>
              <CardDescription>Lengkapi data banjar di bawah ini.</CardDescription>
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
              <Save className="mr-2 h-4 w-4" /> Simpan
            </Button>
          </div>
        </form>
      </LayoutContentBody>
    </LayoutContent>
  );
}
