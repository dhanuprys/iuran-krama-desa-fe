import { useEffect, useState } from 'react';

import { AlertCircle, Banknote, FileText, Home, Loader2, UserCheck, Users } from 'lucide-react';

import adminDashboardService, { type DashboardStats } from '@/services/admin-dashboard.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import {
  LayoutContent,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AdminDashboardPage() {
  useBreadcrumb([{ title: 'Dashboard' }]);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminDashboardService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('Gagal memuat data statistik.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat memuat dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | string) => {
    // Ensure amount is treated as number
    const val = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <LayoutContent>
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      </LayoutContent>
    );
  }

  if (error) {
    return (
      <LayoutContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Dashboard Admin" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Dashboard</LayoutContentHead>
            <LayoutContentSubHead>Ringkasan data sistem Iuran Krama Desa</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        {/* Primary Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Penduduk</CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_residents}</div>
              <p className="text-muted-foreground text-xs">Terdaftar dalam sistem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keluarga</CardTitle>
              <Home className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_families}</div>
              <p className="text-muted-foreground text-xs">Kepala Keluarga (KK)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu Validasi</CardTitle>
              <UserCheck className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.pending_residents}</div>
              <p className="text-muted-foreground text-xs">Penduduk baru perlu diverifikasi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tagihan</CardTitle>
              <FileText className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_invoices}</div>
              <p className="text-muted-foreground text-xs">Semua tagihan tercatat</p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Financial Summary */}
        <h3 className="mb-4 text-lg font-medium">Ringkasan Keuangan</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tagihan (Nominal)</CardTitle>
              <Banknote className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats?.invoice_summary.total_amount || 0)}
              </div>
              <p className="text-muted-foreground text-xs">Nilai total semua tagihan</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sudah Dibayar</CardTitle>
              <Banknote className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.invoice_summary.total_paid || 0)}
              </div>
              <p className="text-muted-foreground text-xs">Tagihan lunas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Dibayar</CardTitle>
              <Banknote className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(stats?.invoice_summary.total_unpaid || 0)}
              </div>
              <p className="text-muted-foreground text-xs">Tagihan tertunggak</p>
            </CardContent>
          </Card>
        </div>
      </LayoutContentBody>
    </LayoutContent>
  );
}
