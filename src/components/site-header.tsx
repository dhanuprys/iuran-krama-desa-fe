import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { SidebarIcon } from 'lucide-react';

import { Constants } from '@/config/constants';

import useAuth from '@/stores/auth.store';

import type { Breadcrumb as BreadcrumbType } from '@/hooks/use-breadcrumb';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';

import { ModeToggle } from './mode-toggle';
import { ResidentSelector } from './resident-selector';

interface Props {
  breadcrumbs?: BreadcrumbType[];
}

export function SiteHeader({ breadcrumbs }: Props) {
  const { toggleSidebar } = useSidebar();
  const user = useAuth((state) => state.user);

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button className="h-8 w-8" variant="ghost" size="icon" onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {breadcrumbs?.map((breadcrumb, index) => (
              <Fragment key={index}>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={breadcrumb.href || '#'}>{breadcrumb.title}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
        <div className="ml-auto flex items-center gap-2">
          {/* <div className="hidden md:block"> */}
          {user?.role !== Constants.ROLES.ADMIN && <ResidentSelector />}
          {/* </div> */}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
