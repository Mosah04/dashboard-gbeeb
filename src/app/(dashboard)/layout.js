import React from "react";
import auth from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { cookies } from "next/headers";

const DashboardLayout = async ({ children }) => {
  const user = await auth.getUser();
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar user={user} />
        <SidebarInset className="max-w-full overflow-hidden">
          <header className="flex h-16 shrink-0 items-center bg-sidebar gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-dashboardContent">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </>
  );
};

export default DashboardLayout;
