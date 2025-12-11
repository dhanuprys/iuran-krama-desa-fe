import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AlertCircle, SaveIcon } from 'lucide-react';

import type { Invoice, Payment } from '@/types/entity';
import type { HttpResponse } from '@/types/http';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { apiClient } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface PaymentFormProps {
  initialData?: Payment;
  invoiceId?: string; // If creating for a specific invoice
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
}

export function PaymentForm({
  initialData,
  invoiceId,
  onSubmit,
  isEditing = false,
}: PaymentFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(initialData?.invoice || null);

  // Form State
  const [formData, setFormData] = useState({
    invoice_id: initialData?.invoice_id?.toString() || invoiceId || '',
    amount: initialData?.amount?.toString() || '',
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    method: initialData?.method || 'cash',
    status: initialData?.status || 'paid',
  });

  // Fetch invoice details if ID provided (e.g. from URL)
  useEffect(() => {
    if (invoiceId && !invoice) {
      fetchInvoice(invoiceId);
    }
  }, [invoiceId]);

  const fetchInvoice = async (id: string) => {
    if (!id) return;

    try {
      const res = await apiClient.get<HttpResponse<Invoice>>(`/admin/invoices/${id}`);
      if (res.data.success && res.data.data) {
        const invoiceData = res.data.data;
        setInvoice(invoiceData);

        // Calculate remaining balance
        const totalPaid =
          invoiceData.payments?.reduce(
            (sum, p) => sum + (typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount),
            0,
          ) || 0;
        const remaining = Math.max(0, invoiceData.total_amount - totalPaid);

        // If not editing, auto-fill amount with remaining balance
        if (!isEditing && !formData.amount) {
          setFormData((prev) => ({ ...prev, amount: remaining.toString() }));
        }
        setError(null);
      } else {
        setInvoice(null);
        setError('Invoice tidak ditemukan');
      }
    } catch (e) {
      console.error(e);
      setInvoice(null);
      setError('Invoice tidak ditemukan');
    }
  };

  const handleCheckInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    fetchInvoice(formData.invoice_id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.invoice_id) {
      setError('ID Invoice wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.data?.error?.details) {
        const details = err.response.data.error.details;
        const messages = Object.values(details).flat().join(', ');
        setError(messages || 'Validasi gagal.');
      } else {
        setError(err?.response?.data?.message || err?.message || 'Terjadi kesalahan.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateFinancials = () => {
    if (!invoice) return { totalPaid: 0, remaining: 0 };
    const totalPaid =
      invoice.payments?.reduce(
        (sum, p) => sum + (typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount),
        0,
      ) || 0;
    const remaining = Math.max(0, invoice.total_amount - totalPaid);
    return { totalPaid, remaining };
  };

  const { totalPaid, remaining } = calculateFinancials();

  return (
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
            <div className="space-y-1 border-b pb-4">
              <label className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Penduduk
              </label>
              {invoice ? (
                <div>
                  <div className="text-lg font-semibold">{invoice.resident?.name}</div>
                  <div className="text-muted-foreground text-sm">NIK: {invoice.resident?.nik}</div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm italic">Menunggu data invoice...</div>
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
                      className={`font-medium ${remaining <= 0 ? 'text-green-600' : 'text-orange-600'}`}
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
              </>
            )}
            {!invoice && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Masukkan ID Invoice untuk melihat detail
                </label>
                <div className="flex max-w-sm gap-2">
                  <Input
                    name="invoice_id"
                    value={formData.invoice_id}
                    onChange={handleChange}
                    placeholder="ID Invoice"
                    disabled={!!invoiceId || isEditing}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleCheckInvoice}
                    disabled={!formData.invoice_id || !!invoiceId || isEditing}
                  >
                    Cek
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Form Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hidden field for invoice_id if we have it visually handled or locked */}
              <input type="hidden" name="invoice_id" value={formData.invoice_id} />

              <Field>
                <FieldLabel>
                  Jumlah Pembayaran (Rp) <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <CurrencyInput
                    name="amount"
                    value={formData.amount}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, amount: value || '' }))}
                    placeholder="0"
                    required
                    className="text-lg font-semibold"
                  />
                  <p className="text-muted-foreground mt-1 text-xs">
                    Sarankan: {invoice ? formatCurrency(remaining) : '-'}
                  </p>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  Tanggal Pembayaran <span className="text-red-500">*</span>
                </FieldLabel>
                <FieldContent>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Metode Pembayaran</FieldLabel>
                <FieldContent>
                  <Select
                    value={formData.method}
                    onValueChange={(val) => handleSelectChange('method', val)}
                  >
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
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <FieldContent>
                  <Select
                    value={formData.status}
                    onValueChange={(val) => handleSelectChange('status', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Lunas (Paid)</SelectItem>
                      <SelectItem value="pending">Menunggu (Pending)</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
              </Field>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => navigate('/admin/payment')}>
                  Batal
                </Button>
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading && (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  )}
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Simpan Pembayaran
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
