import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertCircle, ArrowLeft, Calendar, FileText, User, Printer } from 'lucide-react';

import type { Invoice } from '@/types/entity';

import kramaInvoiceService from '@/services/krama-invoice.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';
import { useDownloadInvoice } from '@/hooks/use-download-invoice';

import {
  LayoutContent,
  LayoutContentBackButton,
  LayoutContentBody,
  LayoutContentHead,
  LayoutContentHeader,
  LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function KramaPaymentInvoiceDetailPage() {
  useBreadcrumb([
    { title: 'Iuran' },
    { title: 'Tagihan', href: '/payment/invoice' },
    { title: 'Detail' },
  ]);

  const { id: invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { download, loading: downloadLoading } = useDownloadInvoice(kramaInvoiceService.downloadInvoice);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice(invoiceId);
    }
  }, [invoiceId]);

  const fetchInvoice = async (id: string) => {
    setLoading(true);
    try {
      const response = await kramaInvoiceService.getInvoiceById(id);
      if (response.data.success && response.data.data) {
        setInvoice(response.data.data);
      } else {
        setError('Tagihan tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat detail tagihan.');
      console.error(err);
    } finally {
      setLoading(false);
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
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Helper to calculate paid status from payments
  const isPaid = (inv: Invoice) => {
    return inv.payments.some((p) => p.status === 'paid');
  };

  if (loading) {
    return (
      <LayoutContent>
        <LayoutContentBody>
          <div className="space-y-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  if (error || !invoice) {
    return (
      <LayoutContent>
        <LayoutContentBody>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Tagihan tidak ditemukan'}</AlertDescription>
          </Alert>
          <Button asChild className="mt-4" variant="outline">
            <Link to="/payment/invoice">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Link>
          </Button>
        </LayoutContentBody>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Detail Tagihan" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/payment/invoice')} />}
        header={
          <div>
            <LayoutContentHead>Detail Tagihan</LayoutContentHead>
            <LayoutContentSubHead>Informasi lengkap tagihan</LayoutContentSubHead>
          </div>
        }
        info={
          <Button
            variant="outline"
            onClick={() => {
              if (invoice) {
                download(invoice.id);
              }
            }}
            disabled={downloadLoading}
          >
            {downloadLoading ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Printer className="mr-2 h-4 w-4" />
            )}
            Download PDF
          </Button>
        }
      />
      <LayoutContentBody>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Invoice Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice Information
                </span>
                <Badge className={getStatusColor(isPaid(invoice) ? 'paid' : 'pending')}>
                  {isPaid(invoice) ? 'Lunas' : 'Belum Lunas'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nomor Invoice</span>
                <span className="font-medium">INV-{invoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal Tagihan</span>
                <span className="font-medium">
                  {format(new Date(invoice.invoice_date), 'dd MMMM yyyy', { locale: id })}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Iuran Wajib</span>
                <span>{formatCurrency(invoice.iuran_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peturunan</span>
                <span>{formatCurrency(invoice.peturunan_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dedosan</span>
                <span>{formatCurrency(invoice.dedosan_amount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Tagihan</span>
                <span>{formatCurrency(invoice.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Resident & Payment Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informasi Penduduk
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Nama</div>
                  <div className="font-medium">{invoice.resident.name}</div>

                  <div className="text-muted-foreground">NIK</div>
                  <div className="font-medium">{invoice.resident.nik}</div>

                  <div className="text-muted-foreground">Alamat</div>
                  <div className="font-medium">{invoice.resident.residential_address || '-'}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Riwayat Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoice.payments.length > 0 ? (
                  <div className="space-y-4">
                    {invoice.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                      >
                        <div>
                          <div className="font-medium">{formatCurrency(payment.amount)}</div>
                          <div className="text-muted-foreground text-xs">
                            {format(new Date(payment.date), 'dd MMM yyyy', { locale: id })} •{' '}
                            {payment.method}
                          </div>
                        </div>
                        <Badge variant="outline">{payment.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground py-4 text-center">
                    Belum ada riwayat pembayaran
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutContentBody>
    </LayoutContent>
  );
}
