"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  
  Landmark,
  ChevronDown,
  ChevronUp,
  LucideProps
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useState } from "react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/type";


export function ERPSidebar({ items }: { items: MenuItem[] }) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  return (
    <Sidebar className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border w-64 transition-all duration-300">
      <SidebarContent className="flex flex-col justify-between h-full">
        {/* Top Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            {/* ERP Logo Section */}
            <div className="p-6 border-b border-sidebar-border">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Landmark className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-sidebar-primary-foreground">
                  EnterpriseERP
                </span>
              </Link>
            </div>

            {/* ERP Menu Items */}
            <SidebarMenu className="p-4 space-y-1">
              {items.map((item) => (
                <div key={item.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => item.subItems && toggleGroup(item.title)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer",
                          item.isActive 
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={cn(
                              "w-5 h-5 transition-colors",
                              item.isActive ? "text-sidebar-primary-foreground" : "text-current"
                            )}
                          />
                          <span className="font-medium">
                            {item.title}
                          </span>
                        </div>
                        {item.subItems ? (
                          expandedGroups[item.title] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : null}
                        {item.badge && (
                          <Badge className="ml-2 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 rounded-full px-2 py-1">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {item.subItems && expandedGroups[item.title] && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.url}
                          className={cn(
                            "block px-3 py-2 text-sm rounded-lg transition-colors",
                            subItem.isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                              : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ERP Footer */}
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-medium text-sidebar-accent-foreground">AD</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">System Administrator</p>
            </div>
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

