import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Save } from 'lucide-react';

import residentStatusService from '@/services/resident-status.service';

import { useBreadcrumb } from '@/hooks/use-breadcrumb';

import {
    LayoutContent,
    LayoutContentBody,
    LayoutContentHead,
    LayoutContentHeader,
    LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminResidentStatusEditPage() {
    useBreadcrumb([
        { title: 'Status Warga', href: '/admin/resident-status' },
        { title: 'Edit Status' },
    ]);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        contribution_amount: '',
    });

    useEffect(() => {
        if (id) {
            fetchStatus(Number(id));
        }
    }, [id]);

    const fetchStatus = async (statusId: number) => {
        try {
            const response = await residentStatusService.getById(statusId);
            if (response.success && response.data) {
                setFormData({
                    name: response.data.name,
                    contribution_amount: response.data.contribution_amount.toString(),
                });
            } else {
                setError(response.message || 'Gagal mengambil data status.');
            }
        } catch (err) {
            setError('Gagal mengambil data status.');
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await residentStatusService.update(Number(id), {
                name: formData.name,
                contribution_amount: Number(formData.contribution_amount),
            });

            if (response.success) {
                navigate('/admin/resident-status');
            } else {
                setError(response.message || 'Gagal memperbarui status warga.');
            }
        } catch (err: any) {
            setError(
                err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat menyimpan data.',
            );
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <LayoutContent>
                <PageHead title="Edit Status Warga" />
                <LayoutContentHeader
                    header={
                        <div>
                            <LayoutContentHead>Edit Status Warga</LayoutContentHead>
                            <LayoutContentSubHead>
                                Perbarui informasi status kependudukan.
                            </LayoutContentSubHead>
                        </div>
                    }
                />
                <LayoutContentBody>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Skeleton className="h-10 w-20" />
                                    <Skeleton className="h-10 w-32" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </LayoutContentBody>
            </LayoutContent>
        );
    }

    return (
        <LayoutContent>
            <PageHead title="Edit Status Warga" />
            <LayoutContentHeader
                header={
                    <div>
                        <LayoutContentHead>Edit Status Warga</LayoutContentHead>
                        <LayoutContentSubHead>Perbarui informasi status kependudukan.</LayoutContentSubHead>
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

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Status</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Contoh: Krama Miu"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contribution_amount">Jumlah Iuran (Rp)</Label>
                                <Input
                                    id="contribution_amount"
                                    name="contribution_amount"
                                    type="number"
                                    placeholder="0"
                                    value={formData.contribution_amount}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/admin/resident-status')}
                                >
                                    Batal
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading && <Save className="mr-2 h-4 w-4 animate-spin" />}
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </LayoutContentBody>
        </LayoutContent>
    );
}
