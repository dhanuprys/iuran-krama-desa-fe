import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function SidebarSkeleton() {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Skeleton className="aspect-square size-8 rounded-lg" />
              <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Section 1 */}
        <SidebarMenu className="mt-4 px-2">
          <Skeleton className="mb-2 h-4 w-20 px-2" /> {/* Section Title */}
          {Array.from({ length: 4 }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton className="h-10">
                <Skeleton className="size-4" />
                <Skeleton className="ml-2 h-4 w-32" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Section 2 */}
        <SidebarMenu className="mt-6 px-2">
          <Skeleton className="mb-2 h-4 w-20 px-2" />
          {Array.from({ length: 3 }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton className="h-10">
                <Skeleton className="size-4" />
                <Skeleton className="ml-2 h-4 w-28" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Section 3 */}
        <SidebarMenu className="mt-6 px-2">
          <Skeleton className="mb-2 h-4 w-20 px-2" />
          {Array.from({ length: 2 }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuButton className="h-10">
                <Skeleton className="size-4" />
                <Skeleton className="ml-2 h-4 w-24" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Skeleton className="aspect-square size-8 rounded-lg" />
              <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="ml-auto size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
