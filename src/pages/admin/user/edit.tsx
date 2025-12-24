import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

export default function AdminUserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState('krama');
  const [canCreateResident, setCanCreateResident] = useState(false);
  const [defaultValues, setDefaultValues] = useState<any>({});

  useBreadcrumb([
    { title: 'Kelola Pengguna', href: '/admin/user' },
    { title: defaultValues.name ? `Edit Pengguna - ${defaultValues.name}` : 'Edit Pengguna' },
  ]);

  useEffect(() => {
    if (id) fetchUser(Number(id));
  }, [id]);

  const fetchUser = async (userId: number) => {
    try {
      const response = await adminUserService.getUser(userId);
      if (response.data) {
        setDefaultValues(response.data);
        setRole(response.data.role);
        setCanCreateResident(response.data.can_create_resident || false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data pengguna.');
      navigate('/admin/user');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const data: any = {
      name: formData.get('name'),
      username: formData.get('username'),
      email: formData.get('email'),
      role: role,
      can_create_resident: canCreateResident,
    };

    const password = formData.get('password');
    if (password && (password as string).length > 0) {
      data.password = password;
    }

    try {
      await adminUserService.updateUser(Number(id), data);
      toast.success('Pengguna berhasil diperbarui.');
      navigate('/admin/user');
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Gagal memperbarui pengguna.';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Edit Pengguna" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/user')} />}
        header={
          <div>
            <LayoutContentHead>Edit Pengguna</LayoutContentHead>
            <LayoutContentSubHead>Ubah informasi pengguna.</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        {loading ? (
          <div className="mx-auto max-w-2xl space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={defaultValues.name}
                    placeholder="Masukan nama lengkap"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    defaultValue={defaultValues.username}
                    placeholder="Masukan username"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={defaultValues.email}
                    placeholder="Masukan email"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Password (Opsional)</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Kosongkan jika tidak ingin mengubah password"
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
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </LayoutContentBody>
    </LayoutContent>
  );
}
