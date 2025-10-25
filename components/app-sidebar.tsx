"use client";

import { useAuth } from "@/providers/auth-provider";
import { useTranslation } from "@/lib/translations";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  ChevronUp,
} from "lucide-react";

interface AppSidebarProps {
  roleRoute: string;
}

export function AppSidebar({ roleRoute }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation('common');

  const navigation = [
    {
      title: t('nav.dashboard'),
      url: `/${roleRoute}`,
      icon: LayoutDashboard,
      roles: ["dashboard", "admin"],
    },
    {
      title: t('nav.categories'),
      url: `/${roleRoute}/categories`,
      icon: Package,
      roles: ["admin"],
    },
    {
      title: t('nav.services'),
      url: `/${roleRoute}/services`,
      icon: Package,
      roles: ["dashboard", "admin"],
    },
    {
      title: t('nav.orders'),
      url: `/${roleRoute}/orders`,
      icon: ShoppingCart,
      roles: ["dashboard", "admin"],
    },
    {
      title: t('nav.newOrder'),
      url: `/${roleRoute}/new-order`,
      icon: Users,
      roles: ["admin", "dashboard"],
    },
    {
      title: t('nav.users'),
      url: `/${roleRoute}/users`,
      icon: Users,
      roles: ["admin"],
    },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(roleRoute)
  );

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 py-2">
          <p className="font-semibold text-lg ">
            <span className="text-slate-800 mr-2">
              <span className="text-[#2150C2]">Follower</span>
              <span className="text-[#CD41B4]">Gratis</span>
            </span>
            <span>Panel</span>
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('nav.navigation')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user?.name}</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
