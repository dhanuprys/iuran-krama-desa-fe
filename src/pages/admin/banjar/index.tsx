import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Edit, Eye, Loader2, MoreHorizontal, Plus, Trash } from 'lucide-react';

import adminBanjarService, { type Banjar } from '@/services/admin-banjar.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';
import { useDebounce } from '@/hooks/use-debounce';

import { AppPagination } from '@/components/app-pagination';
import {
  LayoutContent,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

export default function AdminBanjarListPage() {
  useBreadcrumb([{ title: 'Kelola Banjar' }]);

  const navigate = useNavigate();
  const [banjars, setBanjars] = useState<Banjar[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [banjarToDelete, setBanjarToDelete] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const fetchBanjars = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await adminBanjarService.getBanjars(params);
      if (response.success) {
        setBanjars(response.data);
        setPagination(response.meta);
      }
    } catch (error) {
      console.error(error);
      setError('Gagal memuat data banjar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanjars({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, fetchBanjars]);

  const handlePageChange = (page: number) => {
    fetchBanjars({ search: debouncedSearch, page });
  };

  const handleDelete = (id: number) => {
    setBanjarToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!banjarToDelete) return;

    try {
      const response = await adminBanjarService.deleteBanjar(banjarToDelete);
      if (response.success) {
        fetchBanjars({ search: debouncedSearch, page: pagination?.current_page || 1 });
      } else {
        setError(response.error?.message || 'Gagal menghapus banjar.');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat menghapus data.',
      );
    } finally {
      setDeleteDialogOpen(false);
      setBanjarToDelete(null);
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Daftar Banjar" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Kelola Banjar</LayoutContentHead>
            <LayoutContentSubHead>Daftar banjar di desa adat.</LayoutContentSubHead>
          </div>
        }
        info={
          <Button onClick={() => navigate('/admin/banjar/create')}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Banjar
          </Button>
        }
      />
      <LayoutContentBody>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="mb-4 flex items-center justify-between">
          <Input
            placeholder="Cari Banjar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Banjar</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : banjars.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    Tidak ada data banjar.
                  </TableCell>
                </TableRow>
              ) : (
                banjars.map((banjar) => (
                  <TableRow key={banjar.id}>
                    <TableCell className="font-medium">{banjar.name}</TableCell>
                    <TableCell>{banjar.address}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => navigate(`/admin/banjar/${banjar.id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/banjar/${banjar.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(banjar.id)}
                            className="text-red-600 focus:text-red-600"
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

        {pagination && (
          <div className="mt-4">
            <AppPagination meta={pagination} onPageChange={handlePageChange} />
          </div>
        )}
      </LayoutContentBody>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data banjar yang dihapus tidak dapat
              dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 focus:ring-red-600">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutContent>
  );
}
