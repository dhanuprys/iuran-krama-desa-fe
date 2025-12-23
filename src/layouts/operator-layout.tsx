import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { CreditCard, FileText, PieChart, User } from 'lucide-react';

import { Constants } from '@/config/constants';

import useAuth from '@/stores/auth.store';

import type { Breadcrumb, BreadcrumbContextType } from '@/hooks/use-breadcrumb';

import { AppSidebar, type SidebarConfig } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import logo from '@/assets/desa-sangket.png';

const sidebarConfig: SidebarConfig = {
  context: {
    name: 'Iuran Krama',
    logo: logo,
    description: 'Desa Sangket',
  },
  sections: [
    {
      title: 'Utama',
      variant: 'flat',
      items: [
        {
          title: 'Dashboard',
          url: '/operator/dashboard',
          icon: PieChart,
        },
      ],
    },
    {
      title: 'Keuangan',
      variant: 'flat',
      items: [
        {
          title: 'Kelola Tagihan',
          url: '/operator/invoice',
          icon: FileText,
        },
        {
          title: 'Kelola Pembayaran',
          url: '/operator/payment',
          icon: CreditCard,
        },
      ],
    },
    {
      title: 'Data Master',
      variant: 'flat',
      items: [
        {
          title: 'Kelola Penduduk',
          url: '/operator/resident',
          icon: User,
        },
      ],
    },
  ],
  footer: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
};

export default function OperatorLayout() {
  const { user } = useAuth();
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  // Protected route check
  if (!user || user.role !== Constants.ROLES.OPERATOR) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader breadcrumbs={[{ title: 'Operator', href: '/operator' }, ...breadcrumbs]} />
        <div className="flex flex-1">
          <AppSidebar config={sidebarConfig} />
          <SidebarInset className="pb-20 md:mx-auto md:max-w-7xl md:min-w-6xl">
            <Outlet context={{ setBreadcrumbs } satisfies BreadcrumbContextType} />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
