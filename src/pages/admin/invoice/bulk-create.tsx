import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CheckCircle, Inbox, Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';

import type { FormValidationErrors } from '@/types/form';

import adminInvoiceService from '@/services/admin-invoice.service';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyInput } from '@/components/ui/currency-input';
import { FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { formatCurrency, getFieldErrors } from '@/lib/utils';

interface PreviewItem {
  resident_id: number;
  resident_name: string;
  resident_nik: string;
  banjar_name: string;
  iuran_amount: number;
  peturunan_amount: number;
  dedosan_amount: number;
  total_amount: number;
}

export default function AdminInvoiceBulkCreatePage() {
  useBreadcrumb([
    { title: 'Kelola Tagihan', href: '/admin/invoice' },
    { title: 'Buat Tagihan Massal' },
  ]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormValidationErrors | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewData, setPreviewData] = useState<{
    items: PreviewItem[];
    total_residents: number;
    total_amount_all: number;
  } | null>(null);

  const [formData, setFormData] = useState({
    invoice_date: new Date().toISOString().split('T')[0],
    peturunan_amount: 0,
    dedosan_amount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    setPreviewData(null);

    try {
      const response = await adminInvoiceService.previewBulk({
        invoice_date: formData.invoice_date,
        peturunan_amount: formData.peturunan_amount,
        dedosan_amount: formData.dedosan_amount,
      });

      if (response.success) {
        setPreviewData(response.data);
        if (response.data.items.length === 0) {
          toast.info(
            'Tidak ada penduduk yang memenuhi syarat untuk dibuatkan tagihan pada periode ini.',
          );
        }
      } else {
        toast.error(response.error?.message || 'Gagal memuat preview.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error?.details) {
        setErrors(err.response.data.error.details);
        toast.error('Gagal memuat preview. Mohon periksa input parameter.');
      } else {
        const message = err.message || 'Terjadi kesalahan saat memuat preview.';
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!previewData || previewData.items.length === 0) return;
    setLoading(true);
    setErrors(null);
    setShowConfirm(false);

    try {
      const response = await adminInvoiceService.createBulk({
        invoice_date: formData.invoice_date,
        items: previewData.items,
      });
      if (response.success) {
        toast.success(`Berhasil membuat ${previewData.items.length} tagihan secara massal.`);
        navigate('/admin/invoice');
      } else {
        toast.error(response.error?.message || 'Gagal membuat tagihan massal.');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutContent>
      <PageHead title="Buat Tagihan Massal" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/invoice')} />}
        header={
          <div>
            <LayoutContentHead>Buat Tagihan Massal</LayoutContentHead>
            <LayoutContentSubHead>
              Buat tagihan untuk semua Kepala Keluarga yang belum memiliki tagihan pada bulan
              tersebut.
            </LayoutContentSubHead>
          </div>
        }
      />
      <LayoutContentBody>
        <div className="relative grid items-start gap-6 md:grid-cols-3">
          {/* Parameter Section - Sticky on Desktop */}
          <Card className="h-fit md:sticky md:top-6 md:col-span-1">
            <CardHeader>
              <CardTitle>Parameter Tagihan</CardTitle>
              <CardDescription>Tentukan tanggal dan biaya tambahan.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePreview} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice_date">Tanggal Tagihan</Label>
                  <Input
                    id="invoice_date"
                    name="invoice_date"
                    type="date"
                    value={formData.invoice_date}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-muted-foreground text-xs">
                    Sistem akan mengecek apakah penduduk sudah memiliki tagihan di bulan/tahun yang
                    sama dengan tanggal ini.
                  </p>
                  <FieldError errors={getFieldErrors(errors, 'invoice_date')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="peturunan_amount">Peturunan (Global)</Label>
                  <CurrencyInput
                    id="peturunan_amount"
                    name="peturunan_amount"
                    placeholder="0"
                    value={formData.peturunan_amount}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        peturunan_amount: value ? Number(value) : 0,
                      }))
                    }
                  />
                  <FieldError errors={getFieldErrors(errors, 'peturunan_amount')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dedosan_amount">Dedosan (Global)</Label>
                  <CurrencyInput
                    id="dedosan_amount"
                    name="dedosan_amount"
                    placeholder="0"
                    value={formData.dedosan_amount}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        dedosan_amount: value ? Number(value) : 0,
                      }))
                    }
                  />
                  <FieldError errors={getFieldErrors(errors, 'dedosan_amount')} />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Search className="mr-2 h-4 w-4" /> Cek Preview
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="flex h-full flex-col md:col-span-2">
            <CardHeader>
              <CardTitle>Preview Penerima Tagihan</CardTitle>
              <CardDescription>
                Daftar Kepala Keluarga yang akan dibuatkan tagihan. Hanya yang belum lunas/dibuat di
                bulan ini.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {!previewData ? (
                <div className="flex h-[300px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground">
                  <Inbox className="h-10 w-10 opacity-50" />
                  <p className="font-medium">Belum ada preview data</p>
                  <p className="text-sm">Silakan isi parameter dan klik "Cek Preview"</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Sticky Header within Preview Card could be nice, but simple top block is fine too */}
                  <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-primary/5 p-4">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                          Total KK
                        </p>
                        <p className="text-2xl font-bold">{previewData.total_residents}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground">
                          Estimasi Total
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(previewData.total_amount_all)}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setShowConfirm(true)}
                      disabled={loading || previewData.total_residents === 0}
                      size="lg"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Proses Tagihan
                    </Button>
                  </div>

                  {/* Scrollable List Container */}
                  <div className="rounded-md border">
                    <div className="max-h-[60vh] overflow-y-auto">
                      {previewData.items.map((item, index) => (
                        <div
                          key={item.resident_id}
                          className={`flex flex-col justify-between gap-4 p-4 hover:bg-muted/50 sm:flex-row sm:items-center ${index !== previewData.items.length - 1 ? 'border-b' : ''
                            }`}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{item.resident_name}</p>
                              <Badge variant="outline" className="text-[10px] font-normal">
                                {item.banjar_name}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.resident_nik}</p>
                          </div>

                          <div className="flex flex-col gap-y-1 gap-x-6 text-sm sm:flex-row sm:items-center">
                            <div className="flex justify-between gap-2 sm:block">
                              <span className="sm:hidden text-muted-foreground">Iuran:</span>
                              <span>{formatCurrency(item.iuran_amount)}</span>
                            </div>
                            {(item.peturunan_amount > 0 || item.dedosan_amount > 0) && (
                              <div className="flex gap-4 text-xs text-muted-foreground sm:text-sm">
                                {item.peturunan_amount > 0 && (
                                  <span>+ {formatCurrency(item.peturunan_amount)} (Peturunan)</span>
                                )}
                                {item.dedosan_amount > 0 && (
                                  <span>+ {formatCurrency(item.dedosan_amount)} (Dedosan)</span>
                                )}
                              </div>
                            )}
                            <div className="min-w-[100px] text-right font-bold">
                              {formatCurrency(item.total_amount)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Pembuatan Tagihan</AlertDialogTitle>
              <AlertDialogDescription>
                Anda akan membuat tagihan untuk{' '}
                <b>{previewData?.total_residents} Kepala Keluarga</b> dengan total nominal{' '}
                <b>{previewData && formatCurrency(previewData.total_amount_all)}</b>.
                <br />
                <br />
                Pastikan data sudah benar. Proses ini tidak dapat dibatalkan secara otomatis (harus
                hapus manual satu per satu jika salah).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ya, Proses Sekarang
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </LayoutContentBody>
    </LayoutContent>
  );
}
