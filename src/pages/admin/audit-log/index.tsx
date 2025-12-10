import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Eye, Loader2, Search } from 'lucide-react';

import type { AuditLog } from '@/types/entity';

import adminAuditLogService from '@/services/admin-audit-log.service';

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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

import { formatRole } from '@/lib/utils';

export default function AdminAuditLogPage() {
  useBreadcrumb([{ title: 'Sistem' }, { title: 'Audit & Log Aktivitas' }]);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const action = searchParams.get('action') || 'all';

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchLogs();
  }, [page, debouncedSearch, action]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params: any = { page, search: debouncedSearch };
      if (action !== 'all') params.action = action;

      const response = await adminAuditLogService.getLogs(params);
      setLogs(response.data);
      setPagination(response.meta);
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data log audit.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('search', val);
    else newParams.delete('search');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleActionFilter = (val: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (val && val !== 'all') newParams.set('action', val);
    else newParams.delete('action');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', p.toString());
    setSearchParams(newParams);
  };

  return (
    <LayoutContent>
      <PageHead title="Audit & Log Aktivitas" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Audit & Log Aktivitas</LayoutContentHead>
            <LayoutContentSubHead>Riwayat aktivitas pengguna dan sistem.</LayoutContentSubHead>
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

        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex max-w-md flex-1 gap-2">
            <div className="relative w-full">
              <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
              <Input
                placeholder="Cari Log (ID, Model, atau IP)..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="w-[200px]">
            <Select value={action} onValueChange={handleActionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Aksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Aksi</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Pengguna</TableHead>
                <TableHead>Target (Model)</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="text-right">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground h-24 text-center">
                    Tidak ada log aktivitas ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          log.action === 'create'
                            ? 'border-green-500 bg-green-50 text-green-600'
                            : log.action === 'delete'
                              ? 'border-red-500 bg-red-50 text-red-600'
                              : log.action === 'update'
                                ? 'border-blue-500 bg-blue-50 text-blue-600'
                                : 'border-gray-500 bg-gray-50 text-gray-600'
                        }
                      >
                        {log.action.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{log.user?.name || '-'}</span>
                        <span className="text-muted-foreground text-xs">
                          {log.user?.role ? formatRole(log.user.role) : 'System'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">
                        {log.model_type.split('\\').pop()} #{log.model_id}
                      </span>
                    </TableCell>
                    <TableCell>{log.ip_address}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/audit-log/${log.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {pagination && (
          <div className="mt-4">
            <AppPagination meta={pagination} onPageChange={handlePageChange} />
          </div>
        )}
      </LayoutContentBody>
    </LayoutContent>
  );
}
