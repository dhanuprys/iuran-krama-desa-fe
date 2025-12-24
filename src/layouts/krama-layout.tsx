import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { CircleDollarSignIcon, MegaphoneIcon, PieChart, Users2Icon } from 'lucide-react';

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
    // {
    //     title: "Platform",
    //     variant: 'collapsible',
    //     items: [
    //         {
    //             title: "Playground",
    //             url: "#",
    //             icon: SquareTerminal,
    //             isActive: true,
    //             items: [
    //                 { title: "History", url: "#", icon: SquareTerminal }, // Icon required by type, though not used in sub-items of NavMain?
    //                 { title: "Starred", url: "#", icon: SquareTerminal },
    //                 { title: "Settings", url: "#", icon: SquareTerminal },
    //             ],
    //         },
    //     ],
    // },
    {
      title: '',
      variant: 'flat',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: PieChart,
        },
      ],
    },
    {
      title: 'Iuran',
      variant: 'flat',
      items: [
        {
          title: 'Pengumuman',
          url: '/payment/announcement',
          icon: MegaphoneIcon,
        },
        {
          title: 'Tagihan',
          url: '/payment/invoice',
          icon: CircleDollarSignIcon,
        },
      ],
    },
    {
      title: 'Akun',
      variant: 'flat',
      items: [
        {
          title: 'Penduduk',
          url: '/account/resident',
          icon: Users2Icon,
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

export default function KramaLayout() {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader breadcrumbs={breadcrumbs} />
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
