import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertCircle, FileText, Printer } from 'lucide-react';

import type { Invoice } from '@/types/entity';
import type { PaginatedResponse } from '@/types/http';

import { useResidentStore } from '@/stores/resident.store';

import kramaInvoiceService from '@/services/krama-invoice.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';
import { useDownloadInvoice } from '@/hooks/use-download-invoice';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function KramaPaymentInvoicePage() {
  useBreadcrumb([{ title: 'Iuran' }, { title: 'Tagihan' }]);

  const { activeResident, loading: loadingContext } = useResidentStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // ...
  // ...

  // ...
  const [meta, setMeta] = useState<PaginatedResponse<Invoice>['meta'] | null>(null);

  const { download, loading: downloadLoading } = useDownloadInvoice(kramaInvoiceService.downloadInvoice);

  useEffect(() => {
    if (activeResident) {
      fetchInvoices(activeResident.id, 1);
    } else {
      setInvoices([]);
    }
  }, [activeResident]);

  const fetchInvoices = async (residentId: number, page: number) => {
    setLoadingInvoices(true);
    setError(null);
    try {
      const data = await kramaInvoiceService.getInvoices(residentId, page);
      setInvoices(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError('Gagal memuat tagihan.');
      console.error(err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (activeResident) {
      fetchInvoices(activeResident.id, page);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500 hover:bg-green-600';
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Daftar Tagihan" />
      <LayoutContentHeader
        header={
          <div>
            <LayoutContentHead>Tagihan</LayoutContentHead>
            <LayoutContentSubHead>Daftar tagihan iuran untuk penduduk</LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <div className="space-y-4">
          {loadingContext ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : !activeResident ? (
            <div className="text-muted-foreground bg-muted/30 rounded-lg border border-dashed py-10 text-center">
              <p>Silakan pilih penduduk pada menu di atas untuk melihat tagihan.</p>
            </div>
          ) : loadingInvoices ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : invoices.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              Tidak ada tagihan untuk penduduk ini.
            </div>
          ) : (
            <>
              {invoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <FileText className="h-5 w-5" />
                          Tagihan{' '}
                          {format(new Date(invoice.invoice_date), 'MMMM yyyy', { locale: id })}
                        </CardTitle>
                        <CardDescription>
                          Dibuat pada:{' '}
                          {format(new Date(invoice.created_at), 'dd MMM yyyy', { locale: id })}
                        </CardDescription>
                      </div>
                      <Badge
                        className={getStatusColor(
                          invoice.payments?.some((p) => p.status === 'paid') ? 'paid' : 'pending',
                        )}
                      >
                        {invoice.payments?.some((p) => p.status === 'paid')
                          ? 'Lunas'
                          : 'Belum Lunas'}
                        {/* Note: Logic simplistic, ideally status comes from invoice itself if available or aggregated */}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div className="space-y-1">
                        <div className="text-muted-foreground text-sm">Total Tagihan</div>
                        <div className="text-2xl font-bold">
                          {formatCurrency(invoice.total_amount)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          title="Download PDF"
                          onClick={() => download(invoice.id)}
                          disabled={downloadLoading}
                        >
                          {downloadLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            </div>
                          ) : (
                            <Printer className="h-4 w-4" />
                          )}
                        </Button>
                        <Button asChild variant="outline">
                          <Link to={`/payment/invoice/${invoice.id}`}>Lihat Detail</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <AppPagination meta={meta} onPageChange={handlePageChange} className="mt-4" />
            </>
          )}
        </div>
      </LayoutContentBody>
    </LayoutContent>
  );
}
