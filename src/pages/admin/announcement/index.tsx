import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Edit, Eye, MoreHorizontal, Plus, Trash } from 'lucide-react';

import adminAnnouncementService, { type Announcement } from '@/services/admin-announcement.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import { AppPagination } from '@/components/app-pagination';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminAnnouncementListPage() {
  useBreadcrumb([{ title: 'Kelola Pengumuman' }]);

  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null); // Replace any with proper pagination type if available
  const [searchParams, setSearchParams] = useState({ page: 1, per_page: 10 });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [searchParams]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await adminAnnouncementService.getAnnouncements(searchParams);
      if (response.success) {
        setAnnouncements(response.data);
        setPagination(response.meta);
      }
    } catch (error) {
      console.error('Failed to fetch announcements', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setAnnouncementToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;

    try {
      await adminAnnouncementService.deleteAnnouncement(announcementToDelete);
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement', error);
    } finally {
      setDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Daftar Pengumuman" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Daftar Pengumuman</LayoutContentHead>
            <LayoutContentSubHead>Kelola pengumuman untuk krama desa</LayoutContentSubHead>
          </div>
        }
        info={
          <Button onClick={() => navigate('/admin/announcement/create')}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Pengumuman
          </Button>
        }
      />
      <LayoutContentBody>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat Pada</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Tidak ada data pengumuman.
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? 'Aktif' : 'Tidak Aktif'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleDateString('id-ID')}</TableCell>
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
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/announcement/${item.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/announcement/${item.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(item.id)}
                            className="text-destructive focus:text-destructive"
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
            <AppPagination
              meta={pagination}
              onPageChange={(page) => setSearchParams({ ...searchParams, page })}
            />
          </div>
        )}
      </LayoutContentBody>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Pengumuman yang dihapus tidak dapat dikembalikan.
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
