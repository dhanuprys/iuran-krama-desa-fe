import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Loader2, Save } from 'lucide-react';

import adminInvoiceService from '@/services/admin-invoice.service';
import type { InvoiceFormData } from '@/services/admin-invoice.service';

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
import { ResidentCombobox } from '@/components/resident-combobox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';

import { formatCurrency } from '@/lib/utils';

export default function AdminInvoiceCreatePage() {
  useBreadcrumb([{ title: 'Kelola Tagihan', href: '/admin/invoice' }, { title: 'Buat Tagihan' }]);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingKramaStatus, setMissingKramaStatus] = useState(false);

  // Only fetch simple list for selection - ideally this should be a search endpoint
  // For now we fetch all first page or search
  const [formData, setFormData] = useState<InvoiceFormData>({
    resident_id: 0,
    invoice_date: new Date().toISOString().split('T')[0],
    peturunan_amount: 0,
    dedosan_amount: 0,
    iuran_amount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'peturunan_amount' || name === 'dedosan_amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.resident_id) {
      setError('Silakan pilih penduduk terlebih dahulu.');
      setLoading(false);
      return;
    }

    if (missingKramaStatus) {
      setError('Penduduk tidak memiliki status krama yang valid. Silakan perbarui data penduduk.');
      setLoading(false);
      return;
    }

    try {
      const response = await adminInvoiceService.createInvoice(formData);
      if (response.success) {
        navigate('/admin/invoice');
      } else {
        setError(response.error?.message || 'Gagal membuat tagihan.');
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat menyimpan data.',
      );
    } finally {
      setLoading(false);
    }
  };

  const totalAmount =
    (formData.iuran_amount || 0) + formData.peturunan_amount + formData.dedosan_amount;

  return (
    <LayoutContent>
      <PageHead title="Buat Tagihan" />
      <LayoutContentHeader
        backButton={<LayoutContentBackButton onClick={() => navigate('/admin/invoice')} />}
        header={
          <div>
            <LayoutContentHead>Buat Tagihan</LayoutContentHead>
            <LayoutContentSubHead>Buat tagihan iuran baru untuk penduduk.</LayoutContentSubHead>
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
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informasi Tagihan</CardTitle>
              <CardDescription>Isi detail tagihan di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {missingKramaStatus && (
                <Alert
                  variant="destructive"
                  className="border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200"
                >
                  <AlertTitle>Peringatan Status Penduduk</AlertTitle>
                  <AlertDescription className="flex flex-col gap-3">
                    <p>
                      Penduduk ini belum memiliki Status Krama yang valid (Iuran Wajib tidak
                      ditemukan). Silakan update data penduduk di menu Kelola Krama terlebih dahulu.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit border-yellow-300 hover:bg-yellow-100 hover:text-yellow-900 dark:border-yellow-800 dark:hover:bg-yellow-900"
                      onClick={() => navigate(`/admin/resident/${formData.resident_id}/edit`)}
                      type="button"
                    >
                      Perbarui Data Penduduk
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col space-y-2">
                <Label>
                  Pilih Penduduk <span className="text-red-500">*</span>
                </Label>
                <ResidentCombobox
                  value={formData.resident_id}
                  onChange={(val) => {
                    setFormData((prev) => ({ ...prev, resident_id: val }));
                  }}
                  onSelect={(resident) => {
                    setMissingKramaStatus(
                      !resident.resident_status || !resident.resident_status.contribution_amount,
                    );
                    setFormData((prev) => ({
                      ...prev,
                      iuran_amount: resident.resident_status?.contribution_amount || 0,
                    }));
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoice_date">
                  Tanggal Tagihan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="invoice_date"
                  name="invoice_date"
                  type="date"
                  value={formData.invoice_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="iuran_amount">Iuran Wajib (Otomatis)</Label>
                  <CurrencyInput
                    id="iuran_amount"
                    name="iuran_amount"
                    value={(formData.iuran_amount || 0).toString()}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-muted-foreground text-xs">Sesuai status kependudukan.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peturunan_amount">Peturunan</Label>
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dedosan_amount">Dedosan</Label>
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
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total Tagihan</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/invoice')}>
              Batal
            </Button>
            <Button type="submit" disabled={loading || missingKramaStatus}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Simpan
            </Button>
          </div>
        </form>
      </LayoutContentBody>
    </LayoutContent>
  );
}
