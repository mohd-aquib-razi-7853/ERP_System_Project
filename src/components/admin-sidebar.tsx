"use client";

import {
  Home,
  User,
  Trophy,
  ShoppingCart,
  Package,
  BarChart2,
  MessageSquare,
  Settings,
  Star,
  History,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: Home, href: "/admin/dashboard" },
  { label: "Profile", icon: User, href: "/admin/profile" },
  { label: "Leaderboard", icon: Trophy, href: "/admin/leaderboard" },
  { label: "Order", icon: ShoppingCart, href: "/admin/order" },
  { label: "Product", icon: Package, href: "/admin/product" },
  { label: "Sales Report", icon: BarChart2, href: "/admin/sales-report" },
  { label: "Message", icon: MessageSquare, href: "/admin/message" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
  { label: "Favourite", icon: Star, href: "/admin/favourite" },
  { label: "History", icon: History, href: "/admin/history" },
  { label: "Login", icon: LogIn, href: "/admin/login" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-[#111827] text-white p-4 flex flex-col gap-6 ">
      <div className="text-2xl font-bold flex items-center gap-2 mb-4">
        <span className="text-orange-500 text-3xl">ERP</span>
        <div>
          <div className="text-orange-500">Admin</div>
          <div className="text-xs text-gray-300 tracking-widest">MANAGEMENT</div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition",
                isActive ? "bg-teal-300 text-black font-semibold hover:bg-teal-500" : "text-gray-400"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
