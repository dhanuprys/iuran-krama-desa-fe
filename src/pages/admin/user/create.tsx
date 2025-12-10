import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import adminUserService from '@/services/admin-user.service';

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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function AdminUserCreatePage() {
  useBreadcrumb([{ title: 'Kelola Pengguna', href: '/admin/user' }, { title: 'Buat Pengguna' }]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('krama');
  const [canCreateResident, setCanCreateResident] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const data = {
      name: formData.get('name'),
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: role,
      can_create_resident: canCreateResident,
    };

    try {
      await adminUserService.createUser(data);
      toast.success('Pengguna berhasil dibuat.');
      navigate('/admin/user');
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Gagal membuat pengguna.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Buat Pengguna" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/user')} />}
        header={
          <div>
            <LayoutContentHead>Buat Pengguna</LayoutContentHead>
            <LayoutContentSubHead>Buat pengguna baru untuk penduduk.</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" placeholder="Masukan nama lengkap" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" placeholder="Masukan username" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Masukan email" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Masukan password"
                  required
                  minLength={8}
                />
              </div>

              <div className="grid gap-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="krama">Krama (Penduduk)</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Izin Pembuatan Penduduk</Label>
                  <p className="text-muted-foreground text-sm">
                    Izinkan pengguna ini mengisi formulir pendaftaran penduduk sendiri?
                  </p>
                </div>
                <Switch checked={canCreateResident} onCheckedChange={setCanCreateResident} />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </LayoutContentBody>
    </LayoutContent>
  );
}
