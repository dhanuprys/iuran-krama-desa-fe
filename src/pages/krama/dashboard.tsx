import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AlertCircle, CheckCircle2, FileText } from 'lucide-react';

import { useResidentStore } from '@/stores/resident.store';

import kramaDashboardService, { type DashboardStats } from '@/services/krama-dashboard.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import {
  LayoutContent,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { Badge } from '@/components/ui/badge';
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

import { formatCurrency, formatDate } from '@/lib/utils';

export default function KramaDashboardPage() {
  useBreadcrumb([{ title: 'Dashboard' }]);

  const navigate = useNavigate();
  const { activeResident } = useResidentStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeResident) {
      fetchStats(activeResident.id);
    } else {
      setStats(null);
    }
  }, [activeResident]);

  const fetchStats = async (residentId: number) => {
    setLoading(true);
    try {
      const responseStats = await kramaDashboardService.getStats(residentId);
      setStats(responseStats);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (!activeResident) {
    return (
      <LayoutContent>
        <LayoutContentHeader
          header={
            <div>
              <LayoutContentHead>Dashboard</LayoutContentHead>
              <LayoutContentSubHead>Ringkasan data sistem Iuran Krama Desa</LayoutContentSubHead>
            </div>
          }
        />
        <LayoutContentBody>
          <div className="flex h-[50vh] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Pilih Penduduk</h3>
            <p className="text-muted-foreground">
              Silakan pilih data penduduk untuk melihat ringkasan.
            </p>
          </div>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Dashboard Krama" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Dashboard</LayoutContentHead>
            <LayoutContentSubHead>Ringkasan untuk {activeResident.name}</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        {loading ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-[120px]" />
              <Skeleton className="h-[120px]" />
            </div>
            <Skeleton className="h-[300px]" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Unpaid Card */}
              <Card
                className={
                  stats?.total_unpaid_amount && stats.total_unpaid_amount > 0
                    ? 'border-red-200 bg-red-50 dark:bg-red-900/10'
                    : ''
                }
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tagihan Belum Dibayar</CardTitle>
                  <AlertCircle
                    className={`h-4 w-4 ${stats?.total_unpaid_amount && stats.total_unpaid_amount > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
                  />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${stats?.total_unpaid_amount && stats.total_unpaid_amount > 0 ? 'text-red-600' : ''}`}
                  >
                    {formatCurrency(stats?.total_unpaid_amount || 0)}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Total tagihan yang harus dibayar
                  </p>
                </CardContent>
              </Card>

              {/* Paid Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Kontribusi</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats?.total_paid_amount || 0)}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Total pembayaran yang telah diterima
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Tagihan Terakhir</h2>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Total Tagihan</TableHead>
                      <TableHead>Status Pembayaran</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats?.recent_invoices && stats.recent_invoices.length > 0 ? (
                      stats.recent_invoices.map((invoice) => {
                        const paidAmount =
                          invoice.payments?.reduce(
                            (sum: number, p: any) => sum + Number(p.amount),
                            0,
                          ) || 0;
                        const isPaid = paidAmount >= invoice.total_amount;
                        const isPartial = paidAmount > 0 && !isPaid;

                        return (
                          <TableRow
                            key={invoice.id}
                            className="hover:bg-muted/50 cursor-pointer"
                            onClick={() => navigate(`/payment/invoice/${invoice.id}`)}
                          >
                            <TableCell className="flex items-center gap-2 font-medium">
                              <FileText className="text-muted-foreground h-4 w-4" />
                              {formatDate(invoice.created_at)}
                            </TableCell>
                            <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  isPaid ? 'default' : isPartial ? 'secondary' : 'destructive'
                                }
                              >
                                {isPaid ? 'Lunas' : isPartial ? 'Sebagian' : 'Belum Lunas'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-muted-foreground h-24 text-center">
                          Belum ada aktivitas tagihan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </LayoutContentBody>
    </LayoutContent>
  );
}
