import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, CircleDollarSignIcon, Edit, Loader2, Printer } from 'lucide-react';

import type { Invoice } from '@/types/entity';

import operatorInvoiceService from '@/services/operator-invoice.service';

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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { formatCurrency } from '@/lib/utils';

export default function OperatorInvoiceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { download, loading: downloadLoading } = useDownloadInvoice(operatorInvoiceService.downloadInvoice);

    useBreadcrumb([{ title: 'Kelola Tagihan', href: '/operator/invoice' }, { title: 'Detail Tagihan' }]);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!id) return;
            try {
                const response = await operatorInvoiceService.getInvoice(parseInt(id));
                if (response.success && response.data) {
                    setInvoice(response.data);
                } else {
                    setError('Data tagihan tidak ditemukan.');
                }
            } catch (err) {
                setError('Gagal memuat data tagihan.');
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-96 w-full items-center justify-center">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <LayoutContent>
                <LayoutContentBody>
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error || 'Tagihan tidak ditemukan'}</AlertDescription>
                    </Alert>
                    <Button className="mt-4" onClick={() => navigate('/operator/invoice')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
                    </Button>
                </LayoutContentBody>
            </LayoutContent>
        );
    }

    const totalPaid =
        invoice.payments?.reduce(
            (sum, p) => sum + (typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount),
            0,
        ) || 0;
    const isPaid = totalPaid >= invoice.total_amount;

    return (
        <LayoutContent>
            <PageHead title="Detail Tagihan" />
            <LayoutContentHeader
                backButton={<LayoutContentBackButton onClick={() => navigate('/operator/invoice')} />}
                header={
                    <div>
                        <LayoutContentHead>Detail Tagihan</LayoutContentHead>
                        <LayoutContentSubHead>Informasi detail tagihan #{invoice.id}.</LayoutContentSubHead>
                    </div>
                }
                info={
                    <div className="flex gap-2">
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
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Printer className="mr-2 h-4 w-4" />
                            )}
                            Cetak PDF
                        </Button>
                        {!isPaid && (
                            <Button onClick={() => navigate(`/operator/payment/create?invoice_id=${invoice.id}`)}>
                                <CircleDollarSignIcon className="mr-2 h-4 w-4" /> Catat Pembayaran
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => navigate(`/operator/invoice/${invoice.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                        </Button>
                    </div>
                }
            />
            <LayoutContentBody>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold tracking-tight">Tagihan #{invoice.id}</h2>
                            <p className="text-muted-foreground">
                                Diterbitkan pada{' '}
                                {new Date(invoice.invoice_date).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Penduduk</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="font-medium">Nama:</span>
                                    <span>{invoice.resident?.name}</span>

                                    <span className="font-medium">NIK:</span>
                                    <span>{invoice.resident?.nik}</span>

                                    <span className="font-medium">Banjar:</span>
                                    <span>{invoice.resident?.banjar?.name || '-'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Status Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Status:</span>
                                    {isPaid ? (
                                        <Badge className="bg-green-600 hover:bg-green-700">Lunas</Badge>
                                    ) : totalPaid > 0 ? (
                                        <Badge variant="secondary">Sebagian</Badge>
                                    ) : (
                                        <Badge variant="destructive">Belum Bayar</Badge>
                                    )}
                                </div>
                                <Separator />
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <span className="font-medium">Total Tagihan:</span>
                                    <span>{formatCurrency(invoice.total_amount)}</span>

                                    <span className="font-medium">Total Terbayar:</span>
                                    <span className="text-green-600">{formatCurrency(totalPaid)}</span>

                                    <span className="font-medium">Sisa Tagihan:</span>
                                    <span className="font-bold text-red-600">
                                        {formatCurrency(Math.max(0, invoice.total_amount - totalPaid))}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rincian Tagihan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Iuran Wajib</TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(invoice.iuran_amount)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Peturunan</TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(invoice.peturunan_amount)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Dedosan</TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(invoice.dedosan_amount)}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow className="bg-muted/50 font-bold">
                                        <TableCell>Total</TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(invoice.total_amount)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {invoice.payments && invoice.payments.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Riwayat Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tanggal</TableHead>
                                            <TableHead>Metode</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Jumlah</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoice.payments.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell>
                                                    {new Date(payment.created_at).toLocaleString('id-ID', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    })}
                                                </TableCell>
                                                <TableCell>{payment.method}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{payment.status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(payment.amount)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </LayoutContentBody>
        </LayoutContent>
    );
}
