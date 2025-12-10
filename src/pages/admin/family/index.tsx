import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Eye, Loader2, Search } from 'lucide-react';

import type { Family } from '@/types/entity';

import adminFamilyService from '@/services/admin-family.service';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminFamilyListPage() {
  useBreadcrumb([{ title: 'Keluarga', href: '/admin/family' }, { title: 'Daftar Keluarga' }]);

  const navigate = useNavigate();
  const [families, setFamilies] = useState<Family[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const fetchFamilies = useCallback(async (params?: any) => {
    setLoading(true);
    try {
      const response = await adminFamilyService.getFamilies(params);
      if (response.success) {
        setFamilies(response.data || []);
        setPagination(response.meta);
      }
    } catch (error) {
      console.error(error);
      setError('Gagal memuat data keluarga.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFamilies({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, fetchFamilies]);

  const handlePageChange = (page: number) => {
    fetchFamilies({ search: debouncedSearch, page });
  };

  return (
    <LayoutContent>
      <PageHead title="Daftar Keluarga" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Daftar Keluarga</LayoutContentHead>
            <LayoutContentSubHead>Daftar Kartu Keluarga (read-only)</LayoutContentSubHead>
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

        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
            <Input
              placeholder="Cari No. KK atau Nama Kepala Keluarga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor KK</TableHead>
                <TableHead>Kepala Keluarga</TableHead>
                <TableHead className="text-center">Jumlah Anggota</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : families.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Tidak ada data keluarga ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                families.map((family) => (
                  <TableRow key={family.family_card_number}>
                    <TableCell className="font-medium">{family.family_card_number}</TableCell>
                    <TableCell>
                      {family.head_of_family ? (
                        <div className="flex flex-col">
                          <span className="font-medium">{family.head_of_family.name}</span>
                          <span className="text-muted-foreground text-xs">
                            {family.head_of_family.nik}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Belum ditentukan</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{family.members_count || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/family/${family.family_card_number}`)}
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
    </LayoutContent>
  );
}
