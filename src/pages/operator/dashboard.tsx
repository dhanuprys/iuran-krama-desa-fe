import {
    LayoutContent,
    LayoutContentBody,
    LayoutContentHead,
    LayoutContentHeader,
    LayoutContentSubHead,
} from '@/components/layout-content';
import { PageHead } from '@/components/page-head';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useAuth from '@/stores/auth.store';

export default function OperatorDashboardPage() {
    const { user } = useAuth();
    return (
        <LayoutContent>
            <PageHead title="Dashboard Operator" />
            <LayoutContentHeader
                header={
                    <div>
                        <LayoutContentHead>Dashboard</LayoutContentHead>
                        <LayoutContentSubHead>Selamat datang kembali, {user?.name}.</LayoutContentSubHead>
                    </div>
                }
            />
            <LayoutContentBody>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Tagihan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">---</div>
                            <p className="text-xs text-muted-foreground">
                                Data statistik belum tersedia
                            </p>
                        </CardContent>
                    </Card>
                    {/* Add more stats cards as needed */}
                </div>
            </LayoutContentBody>
        </LayoutContent>
    );
}
