import React from "react";
import { ERPSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MenuItem } from "@/type";
const erpSidebarItems:MenuItem[] = [
  {
    title: "Dashboard",
    url: "/erp/dashboard",
    isActive: false, // Added missing property
    badge: undefined, // Explicitly undefined (optional)
  },
  {
    title: "Inventory",
    url: "/erp/inventory",
    isActive: false,
    badge: "3", // Example badge
    subItems: [
      { 
        title: "Stock Levels", 
        url: "/erp/inventory/levels",
        isActive: false 
      },
      { 
        title: "Suppliers", 
        url: "/erp/inventory/suppliers",
        isActive: false 
      },
      { 
        title: "Purchase Orders", 
        url: "/erp/inventory/orders",
        isActive: true 
      }
    ]
  },
  {
    title: "Accounting",
    url: "/erp/accounting",
    isActive: false,
    subItems: [
      { 
        title: "Invoices", 
        url: "/erp/accounting/invoices",
        isActive: false 
      },
      { 
        title: "Payments", 
        url: "/erp/accounting/payments",
        isActive: false 
      },
      { 
        title: "Expenses", 
        url: "/erp/accounting/expenses",
        isActive: false 
      }
    ]
  },
  {
    title: "Human Resources",
    url: "/erp/hr",
    isActive: false,
    subItems: [
      { 
        title: "Employees", 
        url: "/erp/hr/employees",
        isActive: false 
      },
      { 
        title: "Payroll", 
        url: "/erp/hr/payroll",
        isActive: false 
      },
      { 
        title: "Leave Management", 
        url: "/erp/hr/leave",
        isActive: false 
      }
    ]
  },
  {
    title: "CRM",
    url: "/erp/crm",
    isActive: false,
    subItems: [
      { 
        title: "Clients", 
        url: "/erp/crm/clients",
        isActive: false 
      },
      { 
        title: "Leads", 
        url: "/erp/crm/leads",
        isActive: false 
      },
      { 
        title: "Contracts", 
        url: "/erp/crm/contracts",
        isActive: false 
      }
    ]
  },
  {
    title: "Reports",
    url: "/erp/reports",
    isActive: false,
    badge: "New"
  },
  {
    title: "Admin",
    url: "/erp/admin",
    isActive: false,
    subItems: [
      { 
        title: "Users", 
        url: "/erp/admin/users",
        isActive: false 
      },
      { 
        title: "Roles", 
        url: "/erp/admin/roles",
        isActive: false 
      },
      { 
        title: "System Settings", 
        url: "/erp/admin/settings",
        isActive: false 
      }
    ]
  }
];
const MainRootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <ERPSidebar items={erpSidebarItems}/>
      <main className="w-full h-screen overflow-scroll no-scrollbar">
        {children}
      </main>
    </SidebarProvider>
  );
};

export default MainRootLayout;
