"use client";

import AdminSidebar from "@/components/admin-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const AdminLayoutPage = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isSmallScreen = isMobile || isTablet;
  const [sidebarOpen, setSidebarOpen] = useState(!isSmallScreen);
  
  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isSmallScreen);
  }, [isSmallScreen]);
  
  return (
    <div className="flex h-full">
      <AdminSidebar />
      <main className={cn(
        "flex-1 bg-[#111827] dark:bg-gray-900 text-white transition-all duration-300",
        isSmallScreen ? "w-full" : "w-[calc(100%-16rem)]"
      )}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayoutPage;
