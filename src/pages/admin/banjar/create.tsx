import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader2, Save } from 'lucide-react';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function AdminBanjarCreatePage() {
  useBreadcrumb([{ title: 'Kelola Banjar', href: '/admin/banjar' }, { title: 'Tambah Banjar' }]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    try {
      const response = await adminBanjarService.createBanjar(formData);
      if (response.success) {
        navigate('/admin/banjar');
      } else {
        setError(response.error?.message || 'Gagal membuat banjar.');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat menyimpan data.',
      );
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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
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
