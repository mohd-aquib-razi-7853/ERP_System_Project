import AdminSidebar from "@/components/admin-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

const AdminLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex  h-full">
     
        <AdminSidebar />
        <main className="flex-1  bg-[#111827] dark:bg-gray-900 text-white">
          {children}
        </main>
    </div>
  );
};

export default AdminLayoutPage;
