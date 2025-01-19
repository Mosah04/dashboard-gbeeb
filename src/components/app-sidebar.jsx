"use client";

import * as React from "react";
import { House, Users, Bed, LayoutDashboard, IdCard } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: LayoutDashboard,
    },
  ],
  navMain: [
    {
      title: "Accueil",
      url: "/",
      icon: House,
    },
    {
      title: "Participants",
      url: "/participants",
      icon: Users,
      isActive: true,
    },
    {
      title: "Liste des dortoirs",
      url: "/dortoirs",
      icon: Bed,
    },
    {
      title: "Badges",
      url: "/badges",
      icon: IdCard,
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex-row justify-center font-bold text-xl">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
