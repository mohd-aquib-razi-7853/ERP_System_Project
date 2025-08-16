"use client"

import {
  LayoutDashboard,
  Package,
  BarChart2,
  Users,
  Briefcase,
  FileText,
  CreditCard,
  Home,
  Database,
  PieChart,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Landmark,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";

type MenuItem = {
  title: string;
  url: string;
  isActive: boolean;
  badge?: string;
  subItems?: {
    title: string;
    url: string;
    isActive: boolean;
  }[];
};

type ERPSidebarProps = {
  items: MenuItem[];
  className?: string;
};

export function ERPSidebar({ items, className }: ERPSidebarProps) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isSmallScreen = isMobile || isTablet;
  
  useEffect(() => {
    setIsSidebarOpen(!isSmallScreen);
  }, [isSmallScreen]);
  
  useEffect(() => {
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isSmallScreen]);
  
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Map the ERP items to match the menu sections structure
  const menuSections = useMemo(() => items.map(item => ({
    key: item.title.toLowerCase().replace(/\s+/g, '-'),
    title: item.title,
    icon: getIconForSection(item.title),
    path: item.url,
    subItems: item.subItems?.map(subItem => ({
      title: subItem.title,
      path: subItem.url,
      isActive: subItem.isActive
    })),
    singleItem: !item.subItems,
    badge: item.badge
  })), [items]);

  // Get appropriate icon for each section
  function getIconForSection(title: string) {
    switch (title) {
      case 'Dashboard':
        return <LayoutDashboard size={18} />;
      case 'Inventory':
        return <Package size={18} />;
      case 'Accounting':
        return <CreditCard size={18} />;
      case 'Human Resources':
        return <Users size={18} />;
      case 'CRM':
        return <Briefcase size={18} />;
      case 'Reports':
        return <BarChart2 size={18} />;
      case 'Admin':
        return <Shield size={18} />;
      default:
        return <Landmark size={18} />;
    }
  }

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
  }, [openSections, pathname, menuSections]);

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
    <>
      {/* Mobile Menu Toggle Button */}
      {isSmallScreen && (
        <motion.button
          className="fixed bottom-4 right-4 z-[100] p-1.5 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center"
          onClick={toggleSidebar}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            opacity: 1
          }}
          exit={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu size={16} />
        </motion.button>
      )}
      
      {/* Backdrop for mobile */}
      {isSmallScreen && isSidebarOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSidebar}
        />
      )}
      
      <motion.aside 
        className={cn(
          "h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col border-r border-gray-700 z-50",
          isSmallScreen ? "fixed" : "relative",
          isSmallScreen ? "w-[280px]" : "w-64",
          className
        )}
        initial={{ x: -50, opacity: 0 }}
        animate={{ 
          x: isSmallScreen && !isSidebarOpen ? -280 : 0, 
          opacity: isSmallScreen && !isSidebarOpen ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Logo/Header */}
        <motion.div 
          className="p-6 border-b border-gray-700 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/erp/dashboard" className="flex items-center gap-3 flex-1">
            <motion.div
              className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Landmark className="w-5 h-5 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                EnterpriseERP
              </div>
              <div className="text-xs text-gray-400">Business Suite</div>
            </motion.div>
          </Link>
          
          {/* Close button for mobile */}
          {isSmallScreen && isSidebarOpen && (
            <motion.button
              onClick={toggleSidebar}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700/50"
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <X size={18} />
            </motion.button>
          )}
        </motion.div>

        <ScrollArea className="flex-1 overflow-y-auto overflow-x-hidden">
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
                      {section.badge && (
                        <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
                          {section.badge}
                        </span>
                      )}
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
                          {section.badge && (
                            <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
                              {section.badge}
                            </span>
                          )}
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
                                      <ChevronRight size={14} />
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
                <div className="text-xs text-gray-400">System Administrator</div>
              </div>
            </div>
            <Link
              href="/erp/logout"
              className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
            >
              <motion.div whileHover={{ rotate: 10 }}>
                <LogOut className="w-4 h-4 text-gray-400 hover:text-red-400 transition-colors" />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </motion.aside>
    </>
  );
}