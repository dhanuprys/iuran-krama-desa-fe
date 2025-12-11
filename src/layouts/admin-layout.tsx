import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import {
  Activity,
  CircleDollarSignIcon,
  HeartIcon,
  HomeIcon,
  KeyIcon,
  MegaphoneIcon,
  PieChart,
  Receipt,
  TagIcon,
  Users2Icon,
} from 'lucide-react';

import type { Breadcrumb, BreadcrumbContextType } from '@/hooks/use-breadcrumb';

import { AppSidebar, type SidebarConfig } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import logo from '@/assets/desa-sangket.png';

export const iframeHeight = '800px';

export const description = 'A sidebar with a header and a search form.';

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
          url: '/admin',
          icon: PieChart,
        },
      ],
    },
    {
      title: 'Data Master',
      variant: 'flat',
      items: [
        {
          title: 'Kelola Penduduk',
          url: '/admin/resident',
          icon: Users2Icon,
        },
        {
          title: 'Keluarga',
          url: '/admin/family',
          icon: HeartIcon,
        },
        {
          title: 'Kelola Banjar',
          url: '/admin/banjar',
          icon: HomeIcon,
        },
        {
          title: 'Status Warga',
          url: '/admin/resident-status',
          icon: TagIcon,
        },
      ],
    },
    {
      title: 'Keuangan',
      variant: 'flat',
      items: [
        {
          title: 'Kelola Tagihan',
          url: '/admin/invoice',
          icon: Receipt,
        },
        {
          title: 'Kelola Pembayaran',
          url: '/admin/payment',
          icon: CircleDollarSignIcon,
        },
      ],
    },
    {
      title: 'Sistem',
      variant: 'flat',
      items: [
        {
          title: 'Kelola Pengumuman',
          url: '/admin/announcement',
          icon: MegaphoneIcon,
        },
        {
          title: 'Kelola Pengguna',
          url: '/admin/user',
          icon: KeyIcon,
        },
        {
          title: 'Audit Log',
          url: '/admin/audit-log',
          icon: Activity,
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

export default function AdminLayout() {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader breadcrumbs={[{ title: 'Admin', href: '/admin' }, ...breadcrumbs]} />
        <div className="flex flex-1">
          <AppSidebar config={sidebarConfig} />
          <SidebarInset className="pb-20 md:mx-auto md:max-w-6xl md:min-w-6xl">
            <Outlet context={{ setBreadcrumbs } satisfies BreadcrumbContextType} />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
