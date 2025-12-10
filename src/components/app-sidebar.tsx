import * as React from 'react';

import { type LucideIcon } from 'lucide-react';

import { NavCollapsible } from '@/components/nav-collapsible';
import { NavFlat } from '@/components/nav-flat';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: SidebarItem[];
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
  variant: 'collapsible' | 'flat';
}

export interface SidebarContext {
  name: string;
  logo: LucideIcon | string;
  description: string;
}

export interface SidebarFooterData {
  name: string;
  email: string;
  avatar: string;
}

export interface SidebarConfig {
  context?: SidebarContext;
  sections: SidebarSection[];
  footer?: SidebarFooterData;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  config: SidebarConfig;
}

export function AppSidebar({ config, ...props }: AppSidebarProps) {
  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                {config.context?.logo &&
                  (typeof config.context.logo === 'string' ? (
                    <div className="flex aspect-square size-8 items-center justify-center overflow-hidden">
                      <img
                        src={config.context.logo}
                        alt={config.context.name}
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <config.context.logo className="size-4" />
                    </div>
                  ))}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{config.context?.name}</span>
                  <span className="truncate text-xs">{config.context?.description}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {config.sections.map((section, index) => {
          if (section.variant === 'collapsible') {
            return <NavCollapsible key={index} items={section.items} title={section.title} />;
          } else {
            return (
              <NavFlat
                key={index}
                items={section.items.map((item) => ({
                  name: item.title,
                  url: item.url,
                  icon: item.icon!,
                }))}
                title={section.title}
              />
            );
          }
        })}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
