import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

import type { User } from '@/types/entity';

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { formatDate } from '@/lib/utils';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();



  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useBreadcrumb([
    { title: 'Kelola Pengguna', href: '/admin/user' },
    { title: user ? `Detail Pengguna - ${user.name}` : 'Detail Pengguna' },
  ]);

  useEffect(() => {
    if (id) fetchUser(Number(id));
  }, [id]);

  const fetchUser = async (userId: number) => {
    try {
      const response = await adminUserService.getUser(userId);
      setUser(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data pengguna.');
      navigate('/admin/user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      await adminUserService.deleteUser(user.id);
      toast.success('Pengguna berhasil dihapus.');
      navigate('/admin/user');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus pengguna.');
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Detail Pengguna" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/user')} />}
        header={
          <div>
            <LayoutContentHead>Detail Pengguna</LayoutContentHead>
            <LayoutContentSubHead>Informasi detail pengguna #{id}.</LayoutContentSubHead>
          </div>
        }
        info={
          user && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/user/${user.id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                <Trash className="mr-2 h-4 w-4" /> Hapus
              </Button>
            </div>
          )
        }
      />
      <LayoutContentBody>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : user ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Informasi Akun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-muted-foreground text-sm font-medium">Nama Lengkap</h4>
                    <p className="text-lg font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <h4 className="text-muted-foreground text-sm font-medium">Username</h4>
                    <p className="text-lg">{user.username}</p>
                  </div>
                  <div>
                    <h4 className="text-muted-foreground text-sm font-medium">Email</h4>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <h4 className="text-muted-foreground text-sm font-medium">Role</h4>
                    <div className="mt-1">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-muted-foreground text-sm font-medium">
                      Izin Pembuatan Residen
                    </h4>
                    <div className="mt-1">
                      {user.can_create_resident ? (
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-600"
                        >
                          Ya
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Tidak
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-muted-foreground text-sm font-medium">Terdaftar Sejak</h4>
                    <p className="text-lg">{user.created_at ? formatDate(user.created_at) : '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user.residents && user.residents.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Data Penduduk Terhubung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Foto</TableHead>
                          <TableHead>Nama</TableHead>
                          <TableHead>NIK</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.residents.map((resident) => (
                          <TableRow
                            key={resident.id}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => navigate(`/admin/resident/${resident.id}`)}
                          >
                            <TableCell>
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={resident.resident_photo || undefined}
                                  alt={resident.name}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {resident.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{resident.name}</TableCell>
                            <TableCell>{resident.nik}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px]">
                                {resident.validation_status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="text-muted-foreground py-12 text-center">Pengguna tidak ditemukan.</div>
        )}

        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Pengguna {user?.name} akan dihapus permanen
                dari sistem.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </LayoutContentBody>
    </LayoutContent>
  );
}
