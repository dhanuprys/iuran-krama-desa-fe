import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import {
    Calendar as CalendarIcon,
    CreditCard as CreditCardIcon,
    EyeIcon,
    FileText as FileTextIcon,
    MapPin as MapPinIcon,
    PlusIcon,
    User as UserIcon
} from 'lucide-react';

import type { Payment } from '@/types/entity';
import type { PaginatedResponse } from '@/types/http';

import operatorPaymentService from '@/services/operator-payment.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

import { formatCurrency } from '@/lib/utils';

export default function OperatorPaymentPage() {
    useBreadcrumb([{ title: 'Kelola Pembayaran' }]);

    const [searchParams, setSearchParams] = useSearchParams();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [meta, setMeta] = useState<PaginatedResponse<Payment>['meta'] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const page = parseInt(searchParams.get('page') || '1');
    const status = searchParams.get('status') || 'all';

    useEffect(() => {
        fetchPayments();
    }, [page, status]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const params: any = { page };
            if (status !== 'all') params.status = status;

            const data = await operatorPaymentService.getPayments(params);
            setPayments(data.data);
            setMeta(data.meta);
        } catch (err: any) {
            console.error(err);
            setError('Gagal memuat data pembayaran.');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value && value !== 'all') {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set('page', '1'); // Reset to page 1
        setSearchParams(newParams);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-600 hover:bg-green-700">Lunas</Badge>;
            case 'pending':
                return <Badge variant="secondary">Menunggu</Badge>;
            case 'invalid':
                return <Badge variant="destructive">Tidak Valid</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <LayoutContent>
            <PageHead title="Daftar Pembayaran (Operator)" />
            <LayoutContentHeader
                header={
                    <div>
                        <LayoutContentHead>Kelola Pembayaran</LayoutContentHead>
                        <LayoutContentSubHead>Daftar riwayat pembayaran iuran krama.</LayoutContentSubHead>
                    </div>
                }
                info={
                    <Button asChild>
                        <Link to="/operator/payment/create">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Catat Pembayaran
                        </Link>
                    </Button>
                }
            />
            <LayoutContentBody>
                <div className="mb-6 flex gap-4">
                    <div className="w-[200px]">
                        <Select value={status} onValueChange={(val) => handleFilterChange('status', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status Pembayaran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Status</SelectItem>
                                <SelectItem value="paid">Lunas</SelectItem>
                                <SelectItem value="pending">Menunggu</SelectItem>
                                <SelectItem value="invalid">Tidak Valid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-12 w-full" />
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : payments.length === 0 ? (
                    <div className="text-muted-foreground bg-muted/30 rounded-lg border border-dashed py-10 text-center">
                        <p>Belum ada data pembayaran.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {payments.map((payment) => (
                            <Card
                                key={payment.id}
                                className="hover:bg-muted/5 transition-all"
                            >
                                <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg">
                                                    {payment.invoice?.resident?.name || 'Tanpa Nama'}
                                                </h3>
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {payment.invoice?.resident?.resident_status?.name}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                                                <MapPinIcon className="h-3 w-3" />
                                                <span>
                                                    {payment.invoice?.resident?.banjar?.name || 'Banjar Tidak Diketahui'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1 w-full md:w-auto text-right">
                                            <div className="text-2xl font-bold text-primary">
                                                {formatCurrency(payment.amount)}
                                            </div>
                                            {getStatusBadge(payment.status)}
                                        </div>
                                    </div>

                                    <Separator className="my-3" />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-4">
                                        <div className="flex items-center gap-2">
                                            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">No. Invoice</p>
                                                <p className="font-medium">#{payment.invoice_id}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Tanggal Bayar</p>
                                                <p className="font-medium">
                                                    {new Date(payment.date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Metode</p>
                                                <p className="font-medium capitalize">{payment.method}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                                            <div className="flex-1">
                                                <p className="text-xs text-muted-foreground">Diterima Oleh</p>
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium truncate max-w-[120px]" title={payment.user?.name}>
                                                        {payment.user?.name || '-'}
                                                    </p>
                                                    <Button asChild size="icon" variant="ghost" className="h-6 w-6 ml-2">
                                                        <Link to={`/operator/payment/${payment.id}`}>
                                                            <EyeIcon className="h-3 w-3" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <AppPagination
                            meta={meta}
                            onPageChange={(p) => handleFilterChange('page', p.toString())}
                            className="mt-6"
                        />
                    </div>
                )}
            </LayoutContentBody>
        </LayoutContent>
    );
}
