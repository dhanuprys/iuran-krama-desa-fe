import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import { SidebarSkeleton } from './sidebar-skeleton';
import { LayoutContent, LayoutContentBody, LayoutContentHead, LayoutContentHeader, LayoutContentSubHead } from './layout-content';
import { PageHead } from './page-head';
import { Skeleton } from '@/components/ui/skeleton';

export const iframeHeight = '800px';

export default function LayoutSkeleton() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <SidebarSkeleton />
          <SidebarInset className="pb-20 md:mx-auto md:max-w-6xl md:min-w-6xl">
            <LayoutContent>
              <PageHead title="Loading..." />
              <LayoutContentHeader
                header={
                  <div>
                    <LayoutContentHead>
                      <Skeleton className="h-8 max-w-full w-64" />
                    </LayoutContentHead>
                    <LayoutContentSubHead>
                      <Skeleton className="h-4 w-full md:w-96" />
                    </LayoutContentSubHead>
                  </div>
                }
                info={<Skeleton className="h-10 w-32" />}
              />
              <LayoutContentBody>
                <div className="flex flex-1 flex-col gap-4">
                  <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                  </div>
                  <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
                </div>
              </LayoutContentBody>
            </LayoutContent>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
