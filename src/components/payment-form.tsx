import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Loader2, SaveIcon, Search } from 'lucide-react';
import { z } from 'zod';

import type { Invoice, Payment } from '@/types/entity';
import type { HttpResponse, PaginatedResponse } from '@/types/http';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyInput } from '@/components/ui/currency-input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
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

import { apiClient } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const paymentSchema = z.object({
  invoice_id: z.string().min(1, 'Invoice wajib dipilih'),
  amount: z.string().min(1, 'Jumlah pembayaran wajib diisi'),
  date: z.string().min(1, 'Tanggal pembayaran wajib diisi'),
  method: z.string().min(1, 'Metode pembayaran wajib dipilih'),
  status: z.enum(['paid', 'pending', 'invalid']),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  initialData?: Payment;
  invoiceId?: string;
  onSubmit: (data: PaymentFormValues) => Promise<void>;
  isEditing?: boolean;
  baseApiUrl: string;
}

export function PaymentForm({
  initialData,
  invoiceId,
  onSubmit,
  isEditing = false,
  baseApiUrl,
}: PaymentFormProps) {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(initialData?.invoice || null);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Invoice[]>([]);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoice_id: initialData?.invoice_id?.toString() || invoiceId || '',
      amount: initialData?.amount?.toString() || '',
      date: initialData?.date
        ? new Date(initialData.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      method: initialData?.method || 'cash',
      status: initialData?.status || 'paid',
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  // Fetch invoice details if ID provided or changed
  useEffect(() => {
    if (invoiceId && !invoice) {
      fetchInvoiceById(invoiceId);
    }
  }, [invoiceId]);

  const fetchInvoiceById = async (id: string) => {
    if (!id) return;
    try {
      const res = await apiClient.get<HttpResponse<Invoice>>(`${baseApiUrl}/invoices/${id}`);
      if (res.data.success && res.data.data) {
        selectInvoice(res.data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const calculateRemaining = (inv: Invoice) => {
    const totalPaid =
      inv.payments?.reduce(
        (sum, p) => sum + (typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount),
        0,
      ) || 0;
    return Math.max(0, inv.total_amount - totalPaid);
  };

  const handleSearchInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;

    setSearchLoading(true);
    setSearchError(null);

    try {
      const res = await apiClient.get<PaginatedResponse<Invoice>>(`${baseApiUrl}/invoices`, {
        params: {
          search: searchTerm,
          per_page: 10,
        },
      });

      const invoices = res.data.data;

      if (invoices.length === 0) {
        setSearchError('Invoice tidak ditemukan.');
      } else if (invoices.length === 1) {
        selectInvoice(invoices[0]);
        setSearchTerm('');
      } else {
        setSearchResults(invoices);
        setShowSearchDialog(true);
      }
    } catch (e) {
      console.error(e);
      setSearchError('Gagal mencari invoice.');
    } finally {
      setSearchLoading(false);
    }
  };

  const selectInvoice = (selectedInvoice: Invoice) => {
    setInvoice(selectedInvoice);
    setValue('invoice_id', selectedInvoice.id.toString());
    const remaining = calculateRemaining(selectedInvoice);
    if (!isEditing) {
      setValue('amount', remaining.toString());
    }
    setShowSearchDialog(false);
    setSearchError(null);
  };

  const onFormSubmit = async (data: PaymentFormValues) => {
    try {
      await onSubmit(data);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.data?.error?.details) {
        const details = err.response.data.error.details;
        Object.entries(details).forEach(([key, messages]: [string, any]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(key as any, { type: 'server', message: messages[0] });
          }
        });
      } else {
        setError('root', {
          type: 'server',
          message: err?.response?.data?.message || err?.message || 'Terjadi kesalahan.',
        });
      }
    }
  };

  const { totalPaid, remaining } = invoice
    ? {
        totalPaid:
          invoice.payments?.reduce(
            (sum, p) => sum + (typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount),
            0,
          ) || 0,
        remaining: calculateRemaining(invoice),
      }
    : { totalPaid: 0, remaining: 0 };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6 md:col-span-1">
          {/* Invoice Context Card */}
          <Card className="h-full border-l-4 border-l-blue-600 shadow-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="flex items-center text-base font-semibold text-blue-700">
                <AlertCircle className="mr-2 h-4 w-4" />
                Rincian Tagihan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {!invoice && !invoiceId && !isEditing && (
                <div className="space-y-4 rounded-lg border bg-slate-50 p-4">
                  <label className="text-sm font-medium">Cari Invoice</label>
                  <form onSubmit={handleSearchInvoice} className="flex gap-2">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari ID Invoice / NIK / Nama..."
                      className="flex-1 bg-white"
                      disabled={searchLoading}
                    />
                    <Button type="submit" disabled={!searchTerm || searchLoading}>
                      {searchLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </form>
                  <p className="text-muted-foreground text-xs">
                    Masukkan ID Invoice atau NIK/Nama Penduduk untuk mencari tagihan.
                  </p>
                  {searchError && <p className="text-destructive text-xs">{searchError}</p>}
                </div>
              )}

              <div className="space-y-1 border-b pb-4">
                <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Penduduk
                </label>
                {invoice ? (
                  <div>
                    <div className="text-lg font-semibold">{invoice.resident?.name}</div>
                    <div className="text-muted-foreground text-sm">
                      NIK: {invoice.resident?.nik}
                    </div>
                    <div className="mt-1 font-mono text-xs text-slate-500">
                      Inv ID: {invoice.id}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm italic">
                    {invoiceId ? 'Memuat data...' : 'Belum ada invoice dipilih...'}
                  </div>
                )}
              </div>

              {invoice && (
                <>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Tanggal Tagihan</div>
                      <div className="font-medium">
                        {new Date(invoice.invoice_date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Status Pembayaran</div>
                      <div
                        className={`font-medium ${
                          remaining <= 0 ? 'text-green-600' : 'text-orange-600'
                        }`}
                      >
                        {remaining <= 0 ? 'Lunas' : 'Belum Lunas'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Tagihan</span>
                      <span className="font-medium">{formatCurrency(invoice.total_amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sudah Dibayar</span>
                      <span className="font-medium text-green-600">
                        ({formatCurrency(totalPaid)})
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-base font-bold">
                      <span>Sisa Tagihan</span>
                      <span className="text-red-600">{formatCurrency(remaining)}</span>
                    </div>
                  </div>
                  {remaining <= 0 && (
                    <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
                      <Check className="h-4 w-4" />
                      <AlertTitle>Lunas</AlertTitle>
                      <AlertDescription>Tagihan ini sudah lunas sepenuhnya.</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <form onSubmit={handleSubmit((data) => onFormSubmit(data))} className="space-y-6">
            {errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errors.root.message}</AlertDescription>
              </Alert>
            )}

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Form Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input type="hidden" {...form.register('invoice_id')} />
                {errors.invoice_id && (
                  <p className="text-destructive text-xs">{errors.invoice_id.message}</p>
                )}

                <Controller
                  control={control}
                  name="amount"
                  render={({ field: { onChange, value } }) => (
                    <Field>
                      <FieldLabel>
                        Jumlah Pembayaran (Rp) <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <CurrencyInput
                          name="amount"
                          value={value}
                          onValueChange={(val) => onChange(val || '')}
                          placeholder="0"
                          required
                          className="text-lg font-semibold"
                          disabled={isEditing && initialData?.status === 'paid'}
                        />
                        <p className="text-muted-foreground mt-1 text-xs">
                          Sisa Tagihan: {invoice ? formatCurrency(remaining) : '-'}
                        </p>
                      </FieldContent>
                      <FieldError errors={[{ message: errors.amount?.message }]} />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>
                        Tanggal Pembayaran <span className="text-red-500">*</span>
                      </FieldLabel>
                      <FieldContent>
                        <Input type="date" {...field} required />
                      </FieldContent>
                      <FieldError errors={[{ message: errors.date?.message }]} />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="method"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Metode Pembayaran</FieldLabel>
                      <FieldContent>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Metode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Tunai (Cash)</SelectItem>
                            <SelectItem value="transfer">Transfer Bank</SelectItem>
                            <SelectItem value="qris">QRIS</SelectItem>
                            <SelectItem value="other">Lainnya</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                      <FieldError errors={[{ message: errors.method?.message }]} />
                    </Field>
                  )}
                />

                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Status</FieldLabel>
                      <FieldContent>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Lunas (Paid)</SelectItem>
                            <SelectItem value="pending">Menunggu (Pending)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FieldContent>
                      <FieldError errors={[{ message: errors.status?.message }]} />
                    </Field>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => navigate(baseApiUrl + '/payment')}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Simpan Pembayaran
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      {/* Search Result Dialog */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Pilih Invoice</DialogTitle>
            <DialogDescription>
              Ditemukan beberapa invoice. Silakan pilih salah satu untuk melanjutkan pembayaran.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Penduduk</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{inv.resident?.name}</div>
                      <div className="text-muted-foreground text-xs">{inv.resident?.nik}</div>
                    </TableCell>
                    <TableCell>{inv.invoice_date}</TableCell>
                    <TableCell className="text-right">{formatCurrency(inv.total_amount)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => selectInvoice(inv)}>
                        Pilih
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
