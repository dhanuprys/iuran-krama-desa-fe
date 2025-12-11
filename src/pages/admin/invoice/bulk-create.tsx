import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CheckCircle, Loader2, Search, TriangleAlert } from 'lucide-react';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Label } from '@/components/ui/label';

import { formatCurrency } from '@/lib/utils';

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
    const [error, setError] = useState<string | null>(null);
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
        setError(null);
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
                    setError(
                        'Tidak ada penduduk yang memenuhi syarat untuk dibuatkan tagihan pada periode ini (Mungkin semua sudah memiliki tagihan).',
                    );
                }
            } else {
                setError(response.error?.message || 'Gagal memuat preview.');
            }
        } catch (err: any) {
            setError(err?.message || 'Terjadi kesalahan saat memuat preview.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!previewData || previewData.items.length === 0) return;
        setLoading(true);
        setError(null);

        try {
            const response = await adminInvoiceService.createBulk({
                invoice_date: formData.invoice_date,
                items: previewData.items,
            });
            if (response.success) {
                navigate('/admin/invoice');
            } else {
                setError(response.error?.message || 'Gagal membuat tagihan massal.');
            }
        } catch (err: any) {
            setError(err?.message || 'Terjadi kesalahan saat menyimpan data.');
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
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertTitle>Info</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-1 h-fit">
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
                                    <p className="text-xs text-muted-foreground">
                                        Sistem akan mengecek apakah penduduk sudah memiliki tagihan di bulan/tahun yang
                                        sama dengan tanggal ini.
                                    </p>
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
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    <Search className="mr-2 h-4 w-4" /> Cek Preview
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Preview Penerima Tagihan</CardTitle>
                            <CardDescription>
                                Daftar Kepala Keluarga yang akan dibuatkan tagihan. Hanya yang belum lunas/dibuat di
                                bulan ini.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!previewData ? (
                                <div className="flex h-[300px] items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                                    Silakan isi parameter dan klik "Cek Preview"
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-primary/10 p-4">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Penduduk</p>
                                            <p className="text-2xl font-bold">{previewData.total_residents}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Total Estimasi Tagihan
                                            </p>
                                            <p className="text-2xl font-bold">
                                                {formatCurrency(previewData.total_amount_all)}
                                            </p>
                                        </div>
                                        <Button onClick={handleSubmit} disabled={loading || previewData.total_residents === 0}>
                                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            <CheckCircle className="mr-2 h-4 w-4" /> Proses Buat Tagihan
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {previewData.items.map((item) => (
                                            <div
                                                key={item.resident_id}
                                                className="flex flex-col justify-between rounded-lg border p-4 shadow-sm hover:bg-muted/50"
                                            >
                                                <div className="mb-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-semibold">{item.resident_name}</p>
                                                            <p className="text-sm text-muted-foreground">{item.resident_nik}</p>
                                                        </div>
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.banjar_name}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Iuran</span>
                                                        <span>{formatCurrency(item.iuran_amount)}</span>
                                                    </div>
                                                    {(item.peturunan_amount > 0) && (
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Peturunan</span>
                                                            <span>{formatCurrency(item.peturunan_amount)}</span>
                                                        </div>
                                                    )}
                                                    {(item.dedosan_amount > 0) && (
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Dedosan</span>
                                                            <span>{formatCurrency(item.dedosan_amount)}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between border-t pt-2 font-bold">
                                                        <span>Total</span>
                                                        <span>{formatCurrency(item.total_amount)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </LayoutContentBody>
        </LayoutContent>
    );
}
