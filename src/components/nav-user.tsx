'use client';

import { useNavigate } from 'react-router-dom';

import { ChevronsUpDown } from 'lucide-react';

import { Constants } from '@/config/constants';

import useAuth from '@/stores/auth.store';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

import { useAppStore } from '@/stores/app.store';

export function NavUser() {
  const user = useAuth((state) => state.user);
  const navigate = useNavigate();
  const { frontendVersion, backendVersion } = useAppStore();

  if (!user) return null;

  const profileUrl = user.role === Constants.ROLES.ADMIN ? '/admin/profile' : '/profile';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          onClick={() => navigate(profileUrl)}
        >
          <Avatar className="h-8 w-8 rounded-lg">
            {/* Fallback to user initials or default image if no avatar in user object */}
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <div className="text-[10px] bg-secondary text-muted-foreground flex justify-center">
            v{frontendVersion} (API: v{backendVersion || '...'})
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
