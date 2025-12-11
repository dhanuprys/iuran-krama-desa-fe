import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    CircleDollarSignIcon,
    Edit,
    EyeIcon,
    Loader2,
    MoreHorizontal,
    PlusIcon,
    Search,
} from 'lucide-react';

import type { Invoice } from '@/types/entity';

import operatorInvoiceService from '@/services/operator-invoice.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';
import { useDebounce } from '@/hooks/use-debounce';

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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { formatCurrency } from '@/lib/utils';

export default function OperatorInvoiceListPage() {
    useBreadcrumb([{ title: 'Kelola Tagihan' }]);

    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState<string | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    const fetchInvoices = useCallback(
        async (params?: any) => {
            setLoading(true);
            try {
                const apiParams = { ...params };
                const response = await operatorInvoiceService.getInvoices(apiParams);
                if (response.success) {
                    setInvoices(response.data);
                    setPagination(response.meta);
                }
            } catch (error) {
                console.error(error);
                setError('Gagal memuat data tagihan.');
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        fetchInvoices({ search: debouncedSearch, page: 1 });
    }, [debouncedSearch, fetchInvoices]);

    const handlePageChange = (page: number) => {
        fetchInvoices({ search: debouncedSearch, page });
    };

    const getStatusBadge = (invoice: Invoice) => {
        const totalPaid =
            invoice.payments?.reduce(
                (sum, p) => sum + (typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount),
                0,
            ) || 0;
        const isPaid = totalPaid >= invoice.total_amount;

        return isPaid ? (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                Lunas
            </Badge>
        ) : totalPaid > 0 ? (
            <Badge variant="secondary">Sebagian</Badge>
        ) : (
            <Badge variant="destructive">Belum Bayar</Badge>
        );
    };

    return (
        <LayoutContent>
            <PageHead title="Daftar Tagihan (Operator)" />
            <LayoutContentHeader
                header={
                    <div>
                        <LayoutContentHead>Kelola Tagihan</LayoutContentHead>
                        <LayoutContentSubHead>Daftar tagihan iuran penduduk.</LayoutContentSubHead>
                    </div>
                }
                info={
                    <Button onClick={() => navigate('/operator/invoice/create')}>
                        <PlusIcon className="mr-2 h-4 w-4" /> Buat Tagihan
                    </Button>
                }
            />
            <LayoutContentBody>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="relative w-full max-w-sm">
                        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                        <Input
                            placeholder="Cari Penduduk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Penduduk</TableHead>
                                <TableHead>Total Tagihan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <div className="flex justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        Tidak ada data tagihan.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                invoices.map((invoice) => {
                                    const totalPaid =
                                        invoice.payments?.reduce(
                                            (sum, p) =>
                                                sum + (typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount),
                                            0,
                                        ) || 0;
                                    const isPaid = totalPaid >= invoice.total_amount;
                                    return (
                                        <TableRow key={invoice.id}>
                                            <TableCell>
                                                {new Date(invoice.invoice_date).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{invoice.resident?.name}</div>
                                                <div className="text-muted-foreground text-xs">{invoice.resident?.nik}</div>
                                            </TableCell>
                                            <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                                            <TableCell>{getStatusBadge(invoice)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {!isPaid && (
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link to={`/operator/payment/create?invoice_id=${invoice.id}`}>
                                                                <CircleDollarSignIcon className="mr-1 h-4 w-4" /> Bayar
                                                            </Link>
                                                        </Button>
                                                    )}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() => navigate(`/operator/invoice/${invoice.id}`)}
                                                            >
                                                                <EyeIcon className="mr-2 h-4 w-4" /> Detail
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => navigate(`/operator/invoice/${invoice.id}/edit`)}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {pagination && (
                    <div className="mt-4">
                        <AppPagination meta={pagination} onPageChange={handlePageChange} />
                    </div>
                )}
            </LayoutContentBody>
        </LayoutContent>
    );
}
