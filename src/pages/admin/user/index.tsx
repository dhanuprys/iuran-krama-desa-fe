import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Edit, Eye as EyeIcon, MoreHorizontal, Plus, Search, Trash } from 'lucide-react';
import { toast } from 'sonner';

import type { User } from '@/types/entity';
import { type PaginationMeta } from '@/types/http';

import adminUserService from '@/services/admin-user.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import {
  LayoutContent,
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { formatRole } from '@/lib/utils';

export default function AdminUserListPage() {
  useBreadcrumb([{ title: 'Kelola Pengguna' }]);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0,
    path: '',
  });

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchUsers();
  }, [searchParams]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const pageParam = searchParams.get('page');
      const page = pageParam ? parseInt(pageParam) : 1;
      const validPage = isNaN(page) || page < 1 ? 1 : page;

      const params = {
        page: validPage,
        search: searchQuery,
        role: searchParams.get('role'),
      };
      const response = await adminUserService.getUsers(params);
      setUsers(response.data);
      setPagination({
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
        from: response.meta.from,
        to: response.meta.to,
        path: response.meta.path,
      });
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data pengguna.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    setSearchParams({ search, page: '1' });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminUserService.deleteUser(deleteId);
      toast.success('Pengguna berhasil dihapus.');
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus pengguna. Pastikan bukan diri sendiri.');
    } finally {
      setDeleteId(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (isNaN(page) || page < 1) return;
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('page', page.toString());
    setSearchParams(currentParams);
  };

  return (
    <LayoutContent>
      <PageHead title="Kelola Pengguna" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Kelola Pengguna</LayoutContentHead>
            <LayoutContentSubHead>Daftar pengguna sistem.</LayoutContentSubHead>
          </div>
        }
        info={
          <Button onClick={() => navigate('/admin/user/create')}>
            <Plus className="mr-2 h-4 w-4" /> Buat Pengguna
          </Button>
        }
      />
      <LayoutContentBody>
        <div className="mb-4 flex items-center justify-between">
          <form onSubmit={handleSearch} className="flex w-full max-w-sm gap-2">
            <Input
              name="search"
              placeholder="Cari nama, username, atau email..."
              defaultValue={searchQuery}
            />
            <Button type="submit" size="icon" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <div className="w-[200px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {searchParams.get('role') === 'admin'
                    ? 'Admin'
                    : searchParams.get('role') === 'krama'
                      ? 'Krama'
                      : 'Semua User'}
                  <MoreHorizontal className="ml-2 h-4 w-4 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel>Filter Role</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete('role');
                    params.set('page', '1');
                    setSearchParams(params);
                  }}
                >
                  Semua User
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('role', 'admin');
                    params.set('page', '1');
                    setSearchParams(params);
                  }}
                >
                  Admin Only
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set('role', 'krama');
                    params.set('page', '1');
                    setSearchParams(params);
                  }}
                >
                  Krama Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Izin Penduduk</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Memuat...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground h-24 text-center">
                    Tidak ada pengguna ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {formatRole(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.can_create_resident ? (
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-600"
                        >
                          Ya
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">Tidak</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/admin/user/${user.id}`)}>
                            <EyeIcon className="mr-2 h-4 w-4" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/user/${user.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => setDeleteId(user.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls - Assuming simple next/prev for now if Pagination component not fully compatible
                    Actually let's use a simple Previous/Next flow manually or check the Pagination component usage.
                    Checking Pagination usage in other files would be ideal.
                    I'll implement basic prev/next buttons here to be safe and fast.
                */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page <= 1}
          >
            Previous
          </Button>
          <div className="text-muted-foreground text-sm">
            Halaman {pagination.current_page} dari {pagination.last_page}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page >= pagination.last_page}
          >
            Next
          </Button>
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Pengguna ini akan dihapus permanen dari sistem.
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
