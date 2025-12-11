import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Edit, Eye, Loader2, MoreHorizontal, Plus, Trash } from 'lucide-react';

import residentStatusService, { type ResidentStatus } from '@/services/resident-status.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';
import { useDebounce } from '@/hooks/use-debounce';
import { formatCurrency } from '@/lib/utils';

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

export default function AdminResidentStatusListPage() {
    useBreadcrumb([{ title: 'Status Warga' }]);

    const navigate = useNavigate();
    const [statuses, setStatuses] = useState<ResidentStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState<number | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    const fetchStatuses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await residentStatusService.getAll();
            if (response && Array.isArray(response)) {
                // Frontend filering since backend returns all
                setStatuses(response);
            } else if ((response as any).success && (response as any).data) { // Handle potential wrapper
                setStatuses((response as any).data);
            }

        } catch (error) {
            console.error(error);
            setError('Gagal memuat data status warga.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatuses();
    }, [fetchStatuses]);

    const filteredStatuses = statuses.filter(s =>
        s.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const handleDelete = (id: number) => {
        setStatusToDelete(id);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!statusToDelete) return;

        try {
            const response = await residentStatusService.delete(statusToDelete);
            if (response.success) {
                fetchStatuses();
            } else {
                setError(response.message || 'Gagal menghapus status.');
            }
        } catch (err: any) {
            setError(
                err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat menghapus data.',
            );
        } finally {
            setDeleteDialogOpen(false);
            setStatusToDelete(null);
        }
    };

    return (
        <LayoutContent>
            <PageHead title="Daftar Status Warga" />
            <LayoutContentHeader
                header={
                    <div>
                        <LayoutContentHead>Kelola Status Warga</LayoutContentHead>
                        <LayoutContentSubHead>Daftar status kependudukan dan iuran.</LayoutContentSubHead>
                    </div>
                }
                info={
                    <Button onClick={() => navigate('/admin/resident-status/create')}>
                        <Plus className="mr-2 h-4 w-4" /> Tambah Status
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
                        placeholder="Cari Status..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nama Status</TableHead>
                                <TableHead>Jumlah Iuran</TableHead>
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
                            ) : filteredStatuses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        Tidak ada data status.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStatuses.map((status) => (
                                    <TableRow key={status.id}>
                                        <TableCell className="font-medium">{status.name}</TableCell>
                                        <TableCell>{formatCurrency(status.contribution_amount)}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => navigate(`/admin/resident-status/${status.id}`)}>
                                                        <Eye className="mr-2 h-4 w-4" /> Detail
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => navigate(`/admin/resident-status/${status.id}/edit`)}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(status.id)}
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
            </LayoutContentBody>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data status yang dihapus tidak dapat
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
