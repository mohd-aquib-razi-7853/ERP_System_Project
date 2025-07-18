"use client";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart2,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Home,
  Briefcase,
  CreditCard,
  FileText,
  Box,
  Database,
  PieChart,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
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
    icon?: React.ReactNode;
  }[];
  singleItem?: boolean;
  key?: string;
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [, setIsHovered] = useState(false);

  const menuSections:MenuSection[] = useMemo(() => [
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
        { title: "Users", path: "/admin/users", icon: <Users size={16} /> },
        { title: "Roles & Permissions", path: "/admin/roles", icon: <Shield size={16} /> }
      ]
    },
    {
      key: "sales",
      title: "Sales & Orders",
      icon: <ShoppingCart size={18} />,
      path: "/admin/orders",
      subItems: [
        { title: "Orders", path: "/admin/orders", icon: <CreditCard size={16} /> },
        { title: "Customers", path: "/admin/customers", icon: <Briefcase size={16} /> },
        { title: "Invoices", path: "/admin/invoices", icon: <FileText size={16} /> }
      ]
    },
    {
      key: "inventory",
      title: "Inventory",
      icon: <Package size={18} />,
      path: "/admin/products",
      subItems: [
        { title: "Products", path: "/admin/products", icon: <Box size={16} /> },
        { title: "Stock Management", path: "/admin/stock-mng", icon: <Database size={16} /> },
        { title: "Suppliers", path: "/admin/suppliers", icon: <Home size={16} /> }
      ]
    },
    {
      key: "reports",
      title: "Reports & Analytics",
      icon: <BarChart2 size={18} />,
      path: "/admin/reports/sales",
      subItems: [
        { title: "Sales Reports", path: "/admin/reports/sales", icon: <PieChart size={16} /> },
        { title: "Inventory Reports", path: "/admin/reports/inventory", icon: <Database size={16} /> },
        { title: "Financial Reports", path: "/admin/reports/financial", icon: <BarChart2 size={16} /> }
      ]
    },
    {
      title: "System Settings",
      icon: <Settings size={18} />,
      path: "/admin/settings",
      singleItem: true
    }
  ], []);

  // Automatically open sections when their sub-items are active
  useEffect(() => {
    const newOpenSections: Record<string, boolean> = {};
    let hasChanges = false;

    menuSections.forEach(section => {
      if (section.key && section.subItems) {
        const isActive = section.subItems.some(item => pathname.startsWith(item.path));
        if (isActive && !openSections[section.key]) {
          newOpenSections[section.key] = true;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setOpenSections(newOpenSections);
    }
  }, [openSections,pathname, menuSections]);

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
    <motion.aside 
      className="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col border-r border-gray-700"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Logo/Header with animation */}
      <motion.div 
        className="p-6 border-b border-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <BarChart2 className="w-5 h-5 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NexusERP
            </div>
            <div className="text-xs text-gray-400">Enterprise Platform</div>
          </motion.div>
        </Link>
      </motion.div>

      <ScrollArea className="flex-1 overflow-y-auto">
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
                      "group flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
                      isActive(section.path) 
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg shadow-blue-500/10 border border-blue-500/30"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    )}
                  >
                    <motion.span 
                      className={cn(
                        "transition-colors",
                        isActive(section.path) ? "text-blue-400" : "text-gray-400 group-hover:text-blue-300"
                      )}
                      whileHover={{ scale: 1.1 }}
                    >
                      {section.icon}
                    </motion.span>
                    <span className="font-medium">{section.title}</span>
                    {isActive(section.path) && (
                      <motion.div 
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      />
                    )}
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
                  open={openSections[section.key!]}
                  onOpenChange={() => toggleSection(section.key!)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "group w-full justify-between px-4 py-3 rounded-lg text-sm transition-all",
                        isActiveSection(section.path, section.subItems) 
                          ? "bg-gray-700/50 text-white"
                          : "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <motion.span 
                          className={cn(
                            "transition-colors",
                            isActiveSection(section.path, section.subItems) 
                              ? "text-blue-400" 
                              : "text-gray-400 group-hover:text-blue-300"
                          )}
                          whileHover={{ scale: 1.1 }}
                        >
                          {section.icon}
                        </motion.span>
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <motion.span
                        animate={{
                          rotate: openSections[section.key!] ? 0 : -90
                        }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-400 group-hover:text-white"
                      >
                        <ChevronDown size={16} />
                      </motion.span>
                    </Button>
                  </CollapsibleTrigger>
                  <AnimatePresence>
                    {openSections[section.key!] && (
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
                          <div className="ml-12 mt-1 space-y-1">
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
                                    "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                                    isActive(item.path) 
                                      ? "bg-blue-500/10 text-blue-400 font-medium"
                                      : "text-gray-400 hover:bg-gray-700/20 hover:text-gray-200"
                                  )}
                                >
                                  <motion.span 
                                    className={cn(
                                      "transition-colors",
                                      isActive(item.path) 
                                        ? "text-blue-400" 
                                        : "text-gray-500 group-hover:text-blue-300"
                                    )}
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    {item.icon || <ChevronRight size={14} />}
                                  </motion.span>
                                  <span>{item.title}</span>
                                  {isActive(item.path) && (
                                    <motion.div 
                                      className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring" }}
                                    />
                                  )}
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
        </div>
      </ScrollArea>

      {/* Footer with user info and logout */}
      <motion.div 
        className="p-4 border-t border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring" }}
            >
              AU
            </motion.div>
            <div>
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-gray-400">Super Admin</div>
            </div>
          </div>
          <Link
            href="/admin/logout"
            className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
          >
            <motion.div whileHover={{ rotate: 10 }}>
              <LogOut className="w-4 h-4 text-gray-400 hover:text-red-400 transition-colors" />
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </motion.aside>
  );
}