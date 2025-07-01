"use client";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart2,
  MessageSquare,
  Settings,
  LogIn,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";

type MenuSection = {
  title: string;
  icon: React.ReactNode;
  path: string;
  subItems?: {
    title: string;
    path: string;
  }[];
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState({
    userManagement: false,
    sales: false,
    inventory: false,
    reports: false
  });

  const menuSections = useMemo(() => [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      path: "/admin/dashboard",
      singleItem: true
    },
    {
      key: "userManagement",
      title: "User Management",
      icon: <Users size={18} />,
      path: "/admin/users",
      subItems: [
        { title: "Users", path: "/admin/users" },
        { title: "Roles & Permissions", path: "/admin/roles" }
      ]
    },
    {
      key: "sales",
      title: "Sales & Orders",
      icon: <ShoppingCart size={18} />,
      path: "/admin/orders",
      subItems: [
        { title: "Orders", path: "/admin/orders" },
        { title: "Customers", path: "/admin/customers" },
        { title: "Invoices", path: "/admin/invoices" }
      ]
    },
    {
      key: "inventory",
      title: "Inventory",
      icon: <Package size={18} />,
      path: "/admin/products",
      subItems: [
        { title: "Products", path: "/admin/products" },
        { title: "Stock Management", path: "/admin/inventory" },
        { title: "Suppliers", path: "/admin/suppliers" }
      ]
    },
    {
      key: "reports",
      title: "Reports",
      icon: <BarChart2 size={18} />,
      path: "/admin/reports/sales",
      subItems: [
        { title: "Sales Reports", path: "/admin/reports/sales" },
        { title: "Inventory Reports", path: "/admin/reports/inventory" },
        { title: "Financial Reports", path: "/admin/reports/financial" }
      ]
    },
    {
      title: "Messages",
      icon: <MessageSquare size={18} />,
      path: "/admin/messages",
      singleItem: true
    },
    {
      title: "Settings",
      icon: <Settings size={18} />,
      path: "/admin/settings",
      singleItem: true
    }
  ], []);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (href: string) => pathname === href;
  const isActiveSection = (path: string, subItems?: { path: string }[]) => {
    return isActive(path) || (subItems?.some(item => pathname.startsWith(item.path)) || false)
  };

  return (
    <aside className="h-screen w-64 bg-[#111827] text-white flex flex-col border-r border-gray-800">
      {/* Logo/Header with animation */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-4 border-b border-gray-800"
      >
        <div className="text-2xl font-bold flex items-center gap-2">
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-orange-500 text-3xl"
          >
            ERP
          </motion.span>
          <div>
            <div className="text-orange-500">Admin</div>
            <div className="text-xs text-gray-300 tracking-widest">MANAGEMENT</div>
          </div>
        </div>
      </motion.div>

      <ScrollArea className="flex-1 overflow-scroll no-scrollbar">
        <div className="p-4 flex flex-col gap-1">
          {menuSections.map((section, index) => {
            if (section.singleItem) {
              return (
                <motion.div
                  key={section.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={section.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition",
                      isActive(section.path) ? "bg-teal-500 text-white font-semibold" : "text-gray-400"
                    )}
                  >
                    <motion.span whileHover={{ scale: 1.05 }}>
                      {section.icon}
                    </motion.span>
                    {section.title}
                  </Link>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={section.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Collapsible
                  open={openSections[section.key as keyof typeof openSections]}
                  onOpenChange={() => toggleSection(section.key!)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between px-4 py-2 rounded-md text-sm hover:bg-gray-800 hover:text-white transition-all",
                        isActiveSection(section.path, section.subItems) ? "bg-gray-800" : "opacity-50 hover:opacity-100"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <motion.span whileHover={{ scale: 1.05 }}>
                          {section.icon}
                        </motion.span>
                        <span>{section.title}</span>
                      </div>
                      <motion.span
                        animate={{
                          rotate: openSections[section.key as keyof typeof openSections] ? 0 : -90
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} />
                      </motion.span>
                    </Button>
                  </CollapsibleTrigger>
                  <AnimatePresence>
                    {openSections[section.key as keyof typeof openSections] && (
                      <CollapsibleContent asChild>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ 
                            height: 'auto', 
                            opacity: 1,
                            transition: {
                              height: { duration: 0.2 },
                              opacity: { duration: 0.1, delay: 0.1 }
                            }
                          }}
                          exit={{ 
                            height: 0, 
                            opacity: 0,
                            transition: {
                              height: { duration: 0.2 },
                              opacity: { duration: 0.1 }
                            }
                          }}
                          className="overflow-hidden"
                        >
                          <div className="ml-8 mt-1 space-y-1">
                            {section.subItems?.map((item, subIndex) => (
                              <motion.div
                                key={item.path}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ 
                                  opacity: 1, 
                                  x: 0,
                                  transition: { delay: 0.1 + subIndex * 0.05 }
                                }}
                              >
                                <Link
                                  href={item.path}
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-1.5 rounded text-sm hover:bg-gray-800 transition",
                                    isActive(item.path) ? "text-teal-400 font-medium" : "text-gray-400"
                                  )}
                                >
                                  {item.title}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </CollapsibleContent>
                    )}
                  </AnimatePresence>
                </Collapsible>
              </motion.div>
            );
          })}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-auto pt-4 border-t border-gray-800"
          >
            <Link
              href="/admin/logout"
              className="flex items-center gap-3 px-4 py-2 rounded-md text-sm hover:bg-gray-800 text-gray-400 transition"
            >
              <motion.span whileHover={{ rotate: 10 }}>
                <LogIn size={18} />
              </motion.span>
              Logout
            </Link>
          </motion.div>
        </div>
      </ScrollArea>
    </aside>
  );
}