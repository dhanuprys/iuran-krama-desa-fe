import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function AdminResidentStatusCreatePage() {
    useBreadcrumb([
        { title: 'Status Warga', href: '/admin/resident-status' },
        { title: 'Tambah Status' },
    ]);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        contribution_amount: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await residentStatusService.create({
                name: formData.name,
                contribution_amount: Number(formData.contribution_amount),
            });

            if (response.success) {
                navigate('/admin/resident-status');
            } else {
                setError(response.message || 'Gagal membuat status warga.');
            }
        } catch (err: any) {
            setError(
                err?.response?.data?.message || err?.message || 'Terjadi kesalahan saat menyimpan data.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <LayoutContent>
            <PageHead title="Tambah Status Warga" />
            <LayoutContentHeader
                header={
                    <div>
                        <LayoutContentHead>Tambah Status Warga</LayoutContentHead>
                        <LayoutContentSubHead>Buat status kependudukan baru.</LayoutContentSubHead>
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
                                    Simpan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </LayoutContentBody>
        </LayoutContent>
    );
}
