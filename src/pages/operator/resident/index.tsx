import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Edit, Eye, MoreHorizontal, Plus } from 'lucide-react';

import type { Resident } from '@/types/entity';

import operatorResidentService from '@/services/operator-resident.service';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function OperatorResidentListPage() {
  useBreadcrumb([{ title: 'Kelola Penduduk' }]);

  const navigate = useNavigate();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchParams, setSearchParams] = useState({
    page: 1,
    per_page: 15,
    search: '',
    validation_status: '',
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchParams((prev) => ({
        ...prev,
        search,
        page: 1,
        validation_status: statusFilter === 'ALL' ? '' : statusFilter,
      }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchResidents();
  }, [searchParams]);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const response = await operatorResidentService.getAll(searchParams);
      if (response.success) {
        setResidents(response.data);
        setPagination(response.meta);
      }
    } catch (error) {
      console.error('Failed to fetch residents', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Daftar Penduduk (Operator)" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Daftar Penduduk</LayoutContentHead>
            <LayoutContentSubHead>Kelola data penduduk desa</LayoutContentSubHead>
          </div>
        }
        info={
          <Button onClick={() => navigate('/operator/resident/create')}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Penduduk
          </Button>
        }
      />
      <LayoutContentBody>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row">
          <Input
            placeholder="Cari NIK, Nama, atau No Telepon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status Validasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="PENDING">Menunggu Validasi</SelectItem>
              <SelectItem value="APPROVED">Disetujui</SelectItem>
              <SelectItem value="REJECTED">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIK</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Status Validasi</TableHead>
                <TableHead>Banjar</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : residents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Tidak ada data penduduk.
                  </TableCell>
                </TableRow>
              ) : (
                residents.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.nik}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.validation_status === 'APPROVED'
                            ? 'default'
                            : item.validation_status === 'PENDING'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {item.validation_status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.banjar?.name || '-'}</TableCell>
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
                            onClick={() => navigate(`/operator/resident/${item.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/operator/resident/${item.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
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
    </LayoutContent>
  );
}
