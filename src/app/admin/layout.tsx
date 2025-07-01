import AdminSidebar from "@/components/admin-sidebar";
import { AnimatePresence } from "framer-motion";
import React from "react";

const AdminLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
      <div className="flex max-h-screen h-full">
        <AdminSidebar />
        <main className="flex-1  bg-[#111827] dark:bg-gray-900 text-white">
          {children}
        </main>
      </div>
  );
};

export default AdminLayoutPage;
