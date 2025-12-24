import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, Edit, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import type { Payment } from '@/types/entity';

import adminPaymentService from '@/services/admin-payment.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { formatCurrency } from '@/lib/utils';

export default function AdminPaymentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useBreadcrumb([
    { title: 'Kelola Pembayaran', href: '/admin/payment' },
    { title: payment ? `Detail Pembayaran #${payment.id}` : 'Detail Pembayaran' },
  ]);

  useEffect(() => {
    if (id) {
      fetchPayment(parseInt(id));
    }
  }, [id]);

  const fetchPayment = async (paymentId: number) => {
    try {
      const response = await adminPaymentService.getPayment(paymentId);
      if (response.success && response.data) {
        setPayment(response.data);
      } else {
        setError('Data pembayaran tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat data pembayaran.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!payment) return;
    setActionLoading(true);
    try {
      await adminPaymentService.deletePayment(payment.id);
      toast.success('Pembayaran berhasil dihapus.');
      navigate('/admin/payment');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus pembayaran.');
      setActionLoading(false);
    }
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

  if (error || !payment) {
    return (
      <LayoutContent>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'Data tidak ditemukan'}</AlertDescription>
        </Alert>
        <Button variant="link" onClick={() => navigate('/admin/payment')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
        </Button>
      </LayoutContent>
    );
  }

  return (
    <LayoutContent>
      <PageHead title="Detail Pembayaran" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/payment')} />}
        header={
          <div>
            <LayoutContentHead>Detail Pembayaran #{payment.id}</LayoutContentHead>
            <LayoutContentSubHead>Informasi detail transaksi.</LayoutContentSubHead>
          </div>
        }
        info={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/admin/payment/${payment.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </Button>
          </div>
        }
      />
      <LayoutContentBody>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-muted-foreground">ID Pembayaran</span>
                <span className="font-mono">{payment.id}</span>
              </div>
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-muted-foreground">Tanggal</span>
                <span>
                  {new Date(payment.date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-muted-foreground">Jumlah</span>
                <span className="text-lg font-bold">{formatCurrency(payment.amount)}</span>
              </div>
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-muted-foreground">Metode</span>
                <span className="capitalize">{payment.method}</span>
              </div>
              <div className="flex items-center justify-between border-b py-2">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={
                    payment.status === 'paid'
                      ? 'default'
                      : payment.status === 'invalid'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {payment.status === 'paid'
                    ? 'Lunas'
                    : payment.status === 'invalid'
                      ? 'Tidak Valid'
                      : 'Menunggu'}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Dicatat Oleh</span>
                <span>{payment.user?.name || '-'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Krama & Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Invoice #{payment.invoice_id}</h4>
                <div className="bg-muted/30 space-y-2 rounded-lg border p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Tagihan:</span>
                    <span className="font-medium">
                      {formatCurrency(payment.invoice?.total_amount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tanggal Invoice:</span>
                    <span>
                      {payment.invoice
                        ? new Date(payment.invoice.invoice_date).toLocaleDateString('id-ID')
                        : '-'}
                    </span>
                  </div>
                  <div className="mt-2 border-t pt-2 text-right">
                    <Link
                      to={`/admin/invoice/${payment.invoice_id}`}
                      className="text-primary text-xs hover:underline"
                    >
                      Lihat Detail Invoice &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 font-semibold">Data Krama</h4>
                <div className="space-y-1">
                  <p className="text-lg font-medium">{payment.invoice?.resident?.name}</p>
                  <p className="text-muted-foreground text-sm">
                    NIK: {payment.invoice?.resident?.nik}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Banjar: {payment.invoice?.resident?.banjar?.name}
                  </p>
                </div>
                <div className="mt-2">
                  <Link
                    to={`/admin/resident/${payment.invoice?.resident?.id}`}
                    className="text-primary text-sm hover:underline"
                  >
                    Lihat Profil Krama &rarr;
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutContentBody>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pembayaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pembayaran akan dihapus permanen dari
              sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-red-600 focus:ring-red-600"
            >
              {actionLoading ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutContent>
  );
}
