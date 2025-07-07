'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Truck,
  Check,
  X,
  Clock,
  CreditCard,
  DollarSign,
  Box,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'paid' | 'unpaid' | 'refunded';
type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  sku: string;
}

interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  trackingNumber?: string;
  carrier?: string;
}

interface Order {
  id: string;
  date: string;
  customer: string;
  email: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingInfo: ShippingInfo;
  notes?: string;
}

export default function OrderManagement() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    payment: ''
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Mock data - replace with API calls in a real app
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "#2246872",
        date: "May 13, 2025 at 02:00 PM",
        customer: "Amina Al-Faroodi",
        email: "amina@example.com",
        phone: "+966501234567",
        items: [
          { id: "1", name: "Wireless Headphones", quantity: 2, price: 150, sku: "WH-1000" },
          { id: "2", name: "Smart Watch", quantity: 1, price: 300, sku: "SW-2000" }
        ],
        subtotal: 600,
        shipping: 15,
        tax: 61.5,
        total: 676.5,
        status: "delivered",
        payment: "paid",
        paymentMethod: "credit_card",
        shippingInfo: {
          address: "123 King Fahd Road",
          city: "Riyadh",
          postalCode: "11564",
          country: "Saudi Arabia",
          trackingNumber: "SA123456789",
          carrier: "DHL"
        },
        notes: "Customer requested discreet packaging"
      },
      {
        id: "#9519785",
        date: "May 13, 2025 at 02:55 PM",
        customer: "Kenji Nakamura",
        email: "kenji@example.com",
        phone: "+81345678901",
        items: [
          { id: "3", name: "Gaming Laptop", quantity: 1, price: 1200, sku: "GL-3000" }
        ],
        subtotal: 1200,
        shipping: 25,
        tax: 122.5,
        total: 1347.5,
        status: "shipped",
        payment: "paid",
        paymentMethod: "paypal",
        shippingInfo: {
          address: "456 Sakura Street",
          city: "Tokyo",
          postalCode: "100-0001",
          country: "Japan",
          trackingNumber: "JP987654321",
          carrier: "FedEx"
        }
      },
      {
        id: "#6656427",
        date: "May 13, 2025 at 02:54 PM",
        customer: "Sofia Muller",
        email: "sofia@example.com",
        phone: "+49123456789",
        items: [
          { id: "4", name: "Bluetooth Speaker", quantity: 3, price: 89.99, sku: "BS-4000" }
        ],
        subtotal: 269.97,
        shipping: 12,
        tax: 28.2,
        total: 310.17,
        status: "processing",
        payment: "unpaid",
        paymentMethod: "bank_transfer",
        shippingInfo: {
          address: "789 Berliner Strasse",
          city: "Berlin",
          postalCode: "10115",
          country: "Germany"
        }
      },
      {
        id: "#9854988",
        date: "May 13, 2025 at 02:46 PM",
        customer: "Amirut Hassan",
        email: "amirut@example.com",
        phone: "+60123456789",
        items: [
          { id: "5", name: "Wireless Earbuds", quantity: 2, price: 79.99, sku: "WE-5000" },
          { id: "6", name: "Phone Case", quantity: 1, price: 25, sku: "PC-6000" }
        ],
        subtotal: 184.98,
        shipping: 8,
        tax: 19.3,
        total: 212.28,
        status: "delivered",
        payment: "paid",
        paymentMethod: "credit_card",
        shippingInfo: {
          address: "321 Jalan Tun Razak",
          city: "Kuala Lumpur",
          postalCode: "50400",
          country: "Malaysia",
          trackingNumber: "MY456123789",
          carrier: "Pos Malaysia"
        }
      },
      {
        id: "#9969952",
        date: "May 13, 2025 at 02:40 PM",
        customer: "Elena Petrov",
        email: "elena@example.com",
        phone: "+79123456789",
        items: [
          { id: "7", name: "Fitness Tracker", quantity: 1, price: 99.99, sku: "FT-7000" },
          { id: "8", name: "Yoga Mat", quantity: 1, price: 29.99, sku: "YM-8000" }
        ],
        subtotal: 129.98,
        shipping: 10,
        tax: 14,
        total: 153.98,
        status: "shipped",
        payment: "paid",
        paymentMethod: "credit_card",
        shippingInfo: {
          address: "654 Tverskaya Street",
          city: "Moscow",
          postalCode: "125009",
          country: "Russia",
          trackingNumber: "RU789123456",
          carrier: "DHL"
        }
      },
      {
        id: "#3365479",
        date: "May 13, 2025 at 02:30 PM",
        customer: "Farah Nabila",
        email: "farah@example.com",
        phone: "+628123456789",
        items: [
          { id: "9", name: "Perfume", quantity: 1, price: 120, sku: "PF-9000" },
          { id: "10", name: "Makeup Set", quantity: 1, price: 85, sku: "MS-10000" }
        ],
        subtotal: 205,
        shipping: 15,
        tax: 22,
        total: 242,
        status: "processing",
        payment: "unpaid",
        paymentMethod: "paypal",
        shippingInfo: {
          address: "987 Jalan Sudirman",
          city: "Jakarta",
          postalCode: "10220",
          country: "Indonesia"
        }
      },
      {
        id: "#6552589",
        date: "May 13, 2025 at 01:00 PM",
        customer: "David Moretti",
        email: "david@example.com",
        phone: "+393331234567",
        items: [
          { id: "11", name: "Espresso Machine", quantity: 1, price: 450, sku: "EM-11000" },
          { id: "12", name: "Coffee Beans", quantity: 3, price: 15, sku: "CB-12000" }
        ],
        subtotal: 495,
        shipping: 30,
        tax: 52.5,
        total: 577.5,
        status: "shipped",
        payment: "paid",
        paymentMethod: "credit_card",
        shippingInfo: {
          address: "123 Via Roma",
          city: "Milan",
          postalCode: "20121",
          country: "Italy",
          trackingNumber: "IT123456789",
          carrier: "UPS"
        }
      },
      {
        id: "#9745845",
        date: "May 13, 2025 at 01:30 PM",
        customer: "Riko Tanaka",
        email: "riko@example.com",
        phone: "+819012345678",
        items: [
          { id: "13", name: "Camera Lens", quantity: 1, price: 599, sku: "CL-13000" },
          { id: "14", name: "Camera Bag", quantity: 1, price: 89, sku: "CB-14000" }
        ],
        subtotal: 688,
        shipping: 20,
        tax: 70.8,
        total: 778.8,
        status: "pending",
        payment: "unpaid",
        paymentMethod: "bank_transfer",
        shippingInfo: {
          address: "456 Shibuya Crossing",
          city: "Tokyo",
          postalCode: "150-0043",
          country: "Japan"
        }
      },
      {
        id: "#7891899",
        date: "May 13, 2025 at 11:28 AM",
        customer: "Leyla Zahra",
        email: "leyla@example.com",
        phone: "+902123456789",
        items: [
          { id: "15", name: "Silk Scarf", quantity: 2, price: 45, sku: "SS-15000" }
        ],
        subtotal: 90,
        shipping: 8,
        tax: 9.8,
        total: 107.8,
        status: "delivered",
        payment: "paid",
        paymentMethod: "credit_card",
        shippingInfo: {
          address: "789 Istiklal Street",
          city: "Istanbul",
          postalCode: "34430",
          country: "Turkey",
          trackingNumber: "TR987654321",
          carrier: "PTT"
        }
      },
      {
        id: "#3669852",
        date: "May 13, 2025 at 11:25 AM",
        customer: "Luca Fernandez",
        email: "luca@example.com",
        phone: "+34911234567",
        items: [
          { id: "16", name: "Leather Wallet", quantity: 1, price: 59.99, sku: "LW-16000" },
          { id: "17", name: "Keychain", quantity: 2, price: 9.99, sku: "KC-17000" }
        ],
        subtotal: 79.97,
        shipping: 7,
        tax: 8.7,
        total: 95.67,
        status: "pending",
        payment: "unpaid",
        paymentMethod: "paypal",
        shippingInfo: {
          address: "123 Gran Via",
          city: "Madrid",
          postalCode: "28013",
          country: "Spain"
        }
      },
      {
        id: "#9452667",
        date: "May 13, 2025 at 11:00 AM",
        customer: "Nurul Azizah",
        email: "nurul@example.com",
        phone: "+60198765432",
        items: [
          { id: "18", name: "Hijab", quantity: 3, price: 25, sku: "HJ-18000" },
          { id: "19", name: "Prayer Dress", quantity: 1, price: 35, sku: "PD-19000" }
        ],
        subtotal: 110,
        shipping: 10,
        tax: 12,
        total: 132,
        status: "shipped",
        payment: "paid",
        paymentMethod: "credit_card",
        shippingInfo: {
          address: "456 Jalan Ampang",
          city: "Kuala Lumpur",
          postalCode: "50450",
          country: "Malaysia",
          trackingNumber: "MY789456123",
          carrier: "J&T Express"
        }
      },
      {
        id: "#4457996",
        date: "May 13, 2025 at 10:50 AM",
        customer: "Alexei Kasimov",
        email: "alexei@example.com",
        phone: "+74951234567",
        items: [
          { id: "20", name: "Vodka Set", quantity: 1, price: 120, sku: "VS-20000" },
          { id: "21", name: "Caviar", quantity: 2, price: 60, sku: "CV-21000" }
        ],
        subtotal: 240,
        shipping: 25,
        tax: 26.5,
        total: 291.5,
        status: "cancelled",
        payment: "refunded",
        paymentMethod: "credit_card",
        shippingInfo: {
          address: "789 Red Square",
          city: "Moscow",
          postalCode: "109012",
          country: "Russia"
        },
        notes: "Customer requested cancellation"
      },
      {
        id: "#9556274",
        date: "May 13, 2025 at 10:40 AM",
        customer: "Hana Qureshi",
        email: "hana@example.com",
        phone: "+923001234567",
        items: [
          { id: "22", name: "Handmade Jewelry Set", quantity: 1, price: 160, sku: "HJ-22000" }
        ],
        subtotal: 160,
        shipping: 15,
        tax: 17.5,
        total: 192.5,
        status: "delivered",
        payment: "paid",
        paymentMethod: "cash_on_delivery",
        shippingInfo: {
          address: "123 Mall Road",
          city: "Lahore",
          postalCode: "54000",
          country: "Pakistan",
          trackingNumber: "PK456789123",
          carrier: "TCS"
        }
      },
      {
        id: "#1234567",
        date: "May 13, 2025 at 10:30 AM",
        customer: "Carlos Mendez",
        email: "carlos@example.com",
        phone: "+525512345678",
        items: [
          { id: "23", name: "Sombrero", quantity: 2, price: 35, sku: "SM-23000" },
          { id: "24", name: "Poncho", quantity: 1, price: 45, sku: "PN-24000" }
        ],
        subtotal: 115,
        shipping: 20,
        tax: 13.5,
        total: 148.5,
        status: "shipped",
        payment: "paid",
        paymentMethod: "paypal",
        shippingInfo: {
          address: "456 Avenida Reforma",
          city: "Mexico City",
          postalCode: "06500",
          country: "Mexico",
          trackingNumber: "MX123789456",
          carrier: "Estafeta"
        }
      },
      {
        id: "#7654321",
        date: "May 13, 2025 at 10:15 AM",
        customer: "Olivia Dubois",
        email: "olivia@example.com",
        phone: "+33123456789",
        items: [
          { id: "25", name: "Perfume", quantity: 1, price: 95, sku: "PF-25000" },
          { id: "26", name: "Lipstick Set", quantity: 1, price: 45, sku: "LS-26000" }
        ],
        subtotal: 140,
        shipping: 12,
        tax: 15.2,
        total: 167.2,
        status: "delivered",
        payment: "paid",
        paymentMethod: "credit_card",
        shippingInfo: {
          address: "789 Champs-Élysées",
          city: "Paris",
          postalCode: "75008",
          country: "France",
          trackingNumber: "FR456123789",
          carrier: "Chronopost"
        }
      }
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter and search orders
  useEffect(() => {
    let result = orders;

    // Apply search
    if (searchTerm) {
      result = result.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(order => order.status === filters.status);
    }
    if (filters.payment) {
      result = result.filter(order => order.payment === filters.payment);
    }

    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, searchTerm, filters]);

  // Sort orders
  const requestSort = (key: keyof Order) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = [...filteredOrders];
  if (sortConfig !== null) {
    sortedOrders.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  // Select all orders on current page
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = currentOrders.map(order => order.id);
      setSelectedOrders([...new Set([...selectedOrders, ...newSelected])]);
    } else {
      const newSelected = selectedOrders.filter(
        id => !currentOrders.some(order => order.id === id)
      );
      setSelectedOrders(newSelected);
    }
  };

  // Handle individual order selection
  const handleSelectOrder = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, id]);
    } else {
      setSelectedOrders(selectedOrders.filter(orderId => orderId !== id));
    }
  };

  // Delete order
  const handleDeleteOrder = (id: string) => {
    setOrderToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, you would call an API here
    setOrders(orders.filter(order => order.id !== orderToDelete));
    setSelectedOrders(selectedOrders.filter(id => id !== orderToDelete));
    setDeleteDialogOpen(false);
    toast.success('Order deleted successfully');
  };

  // Edit order
  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setEditDialogOpen(true);
  };

  const saveOrderChanges = () => {
    // In a real app, you would call an API here
    setOrders(orders.map(order => 
      order.id === currentOrder?.id ? currentOrder : order
    ));
    setEditDialogOpen(false);
    toast.success('Order updated successfully');
  };

  // Toggle order details
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-500';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-500';
      case 'processing':
        return 'bg-amber-500/20 text-amber-500';
      case 'pending':
        return 'bg-gray-500/20 text-gray-500';
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Payment badge colors
  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-500';
      case 'unpaid':
        return 'bg-rose-500/20 text-rose-500';
      case 'refunded':
        return 'bg-purple-500/20 text-purple-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Payment method icons
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'paypal':
        return <DollarSign className="h-4 w-4" />;
      case 'bank_transfer':
        return <Box className="h-4 w-4" />;
      case 'cash_on_delivery':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 h-screen overflow-scroll no-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <p className="text-gray-400">Manage all orders in your system</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/orders/create')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Order
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            className="pl-10 bg-gray-800 border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white">
                <Filter className="h-4 w-4 mr-2" />
                Status: {filters.status || 'All'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-300">
              <DropdownMenuItem onClick={() => setFilters({...filters, status: ''})}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, status: 'pending'})}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, status: 'processing'})}>
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, status: 'shipped'})}>
                Shipped
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, status: 'delivered'})}>
                Delivered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, status: 'cancelled'})}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white">
                <Filter className="h-4 w-4 mr-2" />
                Payment: {filters.payment || 'All'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-300">
              <DropdownMenuItem onClick={() => setFilters({...filters, payment: ''})}>
                All Payments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, payment: 'paid'})}>
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, payment: 'unpaid'})}>
                Unpaid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, payment: 'refunded'})}>
                Refunded
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm text-gray-400">
              {selectedOrders.length} selected
            </span>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                setOrderToDelete(selectedOrders[0]);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-600">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    currentOrders.length > 0 &&
                    currentOrders.every(order => selectedOrders.includes(order.id))
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-white"
                onClick={() => requestSort('id')}
              >
                <div className="flex items-center gap-1">
                  Order ID
                  {sortConfig?.key === 'id' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-white"
                onClick={() => requestSort('date')}
              >
                <div className="flex items-center gap-1">
                  Date
                  {sortConfig?.key === 'date' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-white"
                onClick={() => requestSort('customer')}
              >
                <div className="flex items-center gap-1">
                  Customer
                  {sortConfig?.key === 'customer' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-white"
                onClick={() => requestSort('total')}
              >
                <div className="flex items-center gap-1">
                  Total
                  {sortConfig?.key === 'total' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-white"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortConfig?.key === 'status' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-white"
                onClick={() => requestSort('payment')}
              >
                <div className="flex items-center gap-1">
                  Payment
                  {sortConfig?.key === 'payment' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <>
                  <TableRow 
                    key={order.id} 
                    className="hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => 
                          handleSelectOrder(order.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="text-gray-400">
                      {new Date(order.date).toLocaleString()}
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentBadge(order.payment)}>
                        {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-300">
                          <DropdownMenuItem 
                            onClick={() => handleEditOrder(order)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="cursor-pointer text-rose-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Order Details */}
                  {expandedOrder === order.id && (
                    <TableRow className="bg-gray-800/30">
                      <TableCell colSpan={8} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Order Items */}
                          <div className="md:col-span-2">
                            <h3 className="font-medium mb-3 flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              Order Items
                            </h3>
                            <div className="border border-gray-700 rounded-lg overflow-hidden">
                              <Table>
                                <TableHeader className="bg-gray-700">
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Total</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items.map((item) => (
                                    <TableRow key={item.id} className="border-gray-700">
                                      <TableCell className="font-medium">{item.name}</TableCell>
                                      <TableCell className="text-gray-400">{item.sku}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>${item.price.toFixed(2)}</TableCell>
                                      <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium mb-3 flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Payment Information
                              </h3>
                              <Card className="bg-gray-800 border-gray-700">
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Method:</span>
                                    <div className="flex items-center gap-2">
                                      {getPaymentMethodIcon(order.paymentMethod)}
                                      <span>
                                        {order.paymentMethod.split('_').map(word => 
                                          word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Status:</span>
                                    <Badge className={getPaymentBadge(order.payment)}>
                                      {order.payment.charAt(0).toUpperCase() + order.payment.slice(1)}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <div>
                              <h3 className="font-medium mb-3 flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Shipping Information
                              </h3>
                              <Card className="bg-gray-800 border-gray-700">
                                <CardContent className="p-4 space-y-3">
                                  <div>
                                    <p className="text-gray-400 text-sm">Address</p>
                                    <p>{order.shippingInfo.address}</p>
                                    <p>{order.shippingInfo.city}, {order.shippingInfo.postalCode}</p>
                                    <p>{order.shippingInfo.country}</p>
                                  </div>
                                  {order.shippingInfo.trackingNumber && (
                                    <div>
                                      <p className="text-gray-400 text-sm">Tracking</p>
                                      <p>{order.shippingInfo.carrier}: {order.shippingInfo.trackingNumber}</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>

                            <div>
                              <h3 className="font-medium mb-3 flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Order Summary
                              </h3>
                              <Card className="bg-gray-800 border-gray-700">
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal:</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Shipping:</span>
                                    <span>${order.shipping.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Tax:</span>
                                    <span>${order.tax.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between font-bold border-t border-gray-700 pt-2">
                                    <span>Total:</span>
                                    <span>${order.total.toFixed(2)}</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </div>

                        {order.notes && (
                          <div className="mt-6">
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <AlertCircle className="h-5 w-5" />
                              Notes
                            </h3>
                            <Card className="bg-gray-800 border-gray-700">
                              <CardContent className="p-4">
                                <p>{order.notes}</p>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-400">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-800 border-gray-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  currentPage === page ? 'bg-indigo-600' : 'bg-gray-800 border-gray-700'
                )}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-800 border-gray-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 border-gray-600 hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-rose-600 hover:bg-rose-700"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Order Dialog */}
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Edit Order</AlertDialogTitle>
          </AlertDialogHeader>
          {currentOrder && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Order ID</label>
                  <Input
                    value={currentOrder.id}
                    readOnly
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Customer</label>
                  <Input
                    value={currentOrder.customer}
                    onChange={(e) => setCurrentOrder({...currentOrder, customer: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <Input
                    value={currentOrder.email}
                    onChange={(e) => setCurrentOrder({...currentOrder, email: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                  <Input
                    value={currentOrder.phone}
                    onChange={(e) => setCurrentOrder({...currentOrder, phone: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between bg-gray-700 border-gray-600">
                        {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-700 border-gray-600 w-full">
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, status: 'pending'})}
                        className="cursor-pointer"
                      >
                        <Clock className="h-4 w-4 mr-2 text-amber-500" />
                        Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, status: 'processing'})}
                        className="cursor-pointer"
                      >
                        <Package className="h-4 w-4 mr-2 text-blue-500" />
                        Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, status: 'shipped'})}
                        className="cursor-pointer"
                      >
                        <Truck className="h-4 w-4 mr-2 text-blue-500" />
                        Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, status: 'delivered'})}
                        className="cursor-pointer"
                      >
                        <Check className="h-4 w-4 mr-2 text-emerald-500" />
                        Delivered
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, status: 'cancelled'})}
                        className="cursor-pointer text-rose-500"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelled
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Payment Status</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between bg-gray-700 border-gray-600">
                        {currentOrder.payment.charAt(0).toUpperCase() + currentOrder.payment.slice(1)}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-700 border-gray-600 w-full">
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, payment: 'paid'})}
                        className="cursor-pointer"
                      >
                        <Check className="h-4 w-4 mr-2 text-emerald-500" />
                        Paid
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, payment: 'unpaid'})}
                        className="cursor-pointer"
                      >
                        <X className="h-4 w-4 mr-2 text-rose-500" />
                        Unpaid
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, payment: 'refunded'})}
                        className="cursor-pointer"
                      >
                        <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
                        Refunded
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Payment Method</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between bg-gray-700 border-gray-600">
                        {currentOrder.paymentMethod.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-700 border-gray-600 w-full">
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, paymentMethod: 'credit_card'})}
                        className="cursor-pointer"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit Card
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, paymentMethod: 'paypal'})}
                        className="cursor-pointer"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        PayPal
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, paymentMethod: 'bank_transfer'})}
                        className="cursor-pointer"
                      >
                        <Box className="h-4 w-4 mr-2" />
                        Bank Transfer
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentOrder({...currentOrder, paymentMethod: 'cash_on_delivery'})}
                        className="cursor-pointer"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Cash on Delivery
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                  <Input
                    value={currentOrder.notes || ''}
                    onChange={(e) => setCurrentOrder({...currentOrder, notes: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                    placeholder="Add order notes..."
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 pt-4">
                <Button 
                  onClick={saveOrderChanges}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}