'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  User,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  CreditCard,
  Calendar,
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

type CustomerStatus = 'active' | 'inactive' | 'lead';
type CustomerTier = 'regular' | 'premium' | 'vip';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  tier: CustomerTier;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
  address: string;
  city: string;
  country: string;
  notes?: string;
}

export default function CustomerManagement() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    tier: ''
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer;
    direction: 'ascending' | 'descending';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

  // Mock data - replace with API calls in a real app
  useEffect(() => {
    const mockCustomers: Customer[] = [
      {
        id: "CUST-1001",
        name: "Amina Al-Faroodi",
        email: "amina@example.com",
        phone: "+966501234567",
        status: "active",
        tier: "vip",
        totalOrders: 24,
        totalSpent: 12500,
        lastOrderDate: "2023-07-15T10:30:00Z",
        createdAt: "2022-01-15T00:00:00Z",
        address: "123 King Fahd Road",
        city: "Riyadh",
        country: "Saudi Arabia",
        notes: "Prefers express shipping"
      },
      {
        id: "CUST-1002",
        name: "Kenji Nakamura",
        email: "kenji@example.com",
        phone: "+81345678901",
        status: "active",
        tier: "premium",
        totalOrders: 12,
        totalSpent: 6800,
        lastOrderDate: "2023-07-10T14:45:00Z",
        createdAt: "2022-03-20T00:00:00Z",
        address: "456 Sakura Street",
        city: "Tokyo",
        country: "Japan"
      },
      {
        id: "CUST-1003",
        name: "Sofia Muller",
        email: "sofia@example.com",
        phone: "+49123456789",
        status: "active",
        tier: "regular",
        totalOrders: 5,
        totalSpent: 1200,
        lastOrderDate: "2023-06-28T09:20:00Z",
        createdAt: "2023-01-10T00:00:00Z",
        address: "789 Berliner Strasse",
        city: "Berlin",
        country: "Germany"
      },
      {
        id: "CUST-1004",
        name: "Amirut Hassan",
        email: "amirut@example.com",
        phone: "+60123456789",
        status: "inactive",
        tier: "regular",
        totalOrders: 3,
        totalSpent: 450,
        lastOrderDate: "2023-05-15T11:30:00Z",
        createdAt: "2023-02-05T00:00:00Z",
        address: "321 Jalan Tun Razak",
        city: "Kuala Lumpur",
        country: "Malaysia"
      },
      {
        id: "CUST-1005",
        name: "Elena Petrov",
        email: "elena@example.com",
        phone: "+79123456789",
        status: "active",
        tier: "premium",
        totalOrders: 18,
        totalSpent: 9200,
        lastOrderDate: "2023-07-12T16:20:00Z",
        createdAt: "2021-11-30T00:00:00Z",
        address: "654 Tverskaya Street",
        city: "Moscow",
        country: "Russia",
        notes: "Bulk orders every quarter"
      },
      {
        id: "CUST-1006",
        name: "Farah Nabila",
        email: "farah@example.com",
        phone: "+628123456789",
        status: "lead",
        tier: "regular",
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: "",
        createdAt: "2023-07-01T00:00:00Z",
        address: "987 Jalan Sudirman",
        city: "Jakarta",
        country: "Indonesia"
      },
      {
        id: "CUST-1007",
        name: "David Moretti",
        email: "david@example.com",
        phone: "+393331234567",
        status: "active",
        tier: "vip",
        totalOrders: 32,
        totalSpent: 21500,
        lastOrderDate: "2023-07-14T10:15:00Z",
        createdAt: "2020-08-22T00:00:00Z",
        address: "123 Via Roma",
        city: "Milan",
        country: "Italy"
      },
      {
        id: "CUST-1008",
        name: "Riko Tanaka",
        email: "riko@example.com",
        phone: "+819012345678",
        status: "active",
        tier: "regular",
        totalOrders: 7,
        totalSpent: 1850,
        lastOrderDate: "2023-06-30T13:40:00Z",
        createdAt: "2023-03-15T00:00:00Z",
        address: "456 Shibuya Crossing",
        city: "Tokyo",
        country: "Japan"
      },
      {
        id: "CUST-1009",
        name: "Leyla Zahra",
        email: "leyla@example.com",
        phone: "+902123456789",
        status: "inactive",
        tier: "regular",
        totalOrders: 2,
        totalSpent: 320,
        lastOrderDate: "2023-04-18T12:10:00Z",
        createdAt: "2023-02-28T00:00:00Z",
        address: "789 Istiklal Street",
        city: "Istanbul",
        country: "Turkey"
      },
      {
        id: "CUST-1010",
        name: "Luca Fernandez",
        email: "luca@example.com",
        phone: "+34911234567",
        status: "active",
        tier: "premium",
        totalOrders: 15,
        totalSpent: 7500,
        lastOrderDate: "2023-07-08T11:25:00Z",
        createdAt: "2022-05-10T00:00:00Z",
        address: "123 Gran Via",
        city: "Madrid",
        country: "Spain"
      },
      {
        id: "CUST-1011",
        name: "Nurul Azizah",
        email: "nurul@example.com",
        phone: "+60198765432",
        status: "active",
        tier: "regular",
        totalOrders: 9,
        totalSpent: 2300,
        lastOrderDate: "2023-07-05T14:30:00Z",
        createdAt: "2022-09-15T00:00:00Z",
        address: "456 Jalan Ampang",
        city: "Kuala Lumpur",
        country: "Malaysia"
      },
      {
        id: "CUST-1012",
        name: "Alexei Kasimov",
        email: "alexei@example.com",
        phone: "+74951234567",
        status: "inactive",
        tier: "regular",
        totalOrders: 4,
        totalSpent: 980,
        lastOrderDate: "2023-03-22T10:45:00Z",
        createdAt: "2022-12-05T00:00:00Z",
        address: "789 Red Square",
        city: "Moscow",
        country: "Russia"
      },
      {
        id: "CUST-1013",
        name: "Hana Qureshi",
        email: "hana@example.com",
        phone: "+923001234567",
        status: "active",
        tier: "vip",
        totalOrders: 28,
        totalSpent: 18700,
        lastOrderDate: "2023-07-13T09:15:00Z",
        createdAt: "2021-07-30T00:00:00Z",
        address: "123 Mall Road",
        city: "Lahore",
        country: "Pakistan"
      },
      {
        id: "CUST-1014",
        name: "Carlos Mendez",
        email: "carlos@example.com",
        phone: "+525512345678",
        status: "active",
        tier: "premium",
        totalOrders: 11,
        totalSpent: 5400,
        lastOrderDate: "2023-07-07T16:50:00Z",
        createdAt: "2022-08-20T00:00:00Z",
        address: "456 Avenida Reforma",
        city: "Mexico City",
        country: "Mexico"
      },
      {
        id: "CUST-1015",
        name: "Olivia Dubois",
        email: "olivia@example.com",
        phone: "+33123456789",
        status: "lead",
        tier: "regular",
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: "",
        createdAt: "2023-06-15T00:00:00Z",
        address: "789 Champs-Élysées",
        city: "Paris",
        country: "France"
      }
    ];

    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
  }, []);

  // Filter and search customers
  useEffect(() => {
    let result = customers;

    // Apply search
    if (searchTerm) {
      result = result.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(customer => customer.status === filters.status);
    }
    if (filters.tier) {
      result = result.filter(customer => customer.tier === filters.tier);
    }

    setFilteredCustomers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [customers, searchTerm, filters]);

  // Sort customers
  const requestSort = (key: keyof Customer) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomers = [...filteredCustomers];
  if (sortConfig !== null) {
    sortedCustomers.sort((a, b) => {
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
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(sortedCustomers.length / customersPerPage);

  // Select all customers on current page
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = currentCustomers.map(customer => customer.id);
      setSelectedCustomers([...new Set([...selectedCustomers, ...newSelected])]);
    } else {
      const newSelected = selectedCustomers.filter(
        id => !currentCustomers.some(customer => customer.id === id)
      );
      setSelectedCustomers(newSelected);
    }
  };

  // Handle individual customer selection
  const handleSelectCustomer = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, id]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    }
  };

  // Delete customer
  const handleDeleteCustomer = (id: string) => {
    setCustomerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, you would call an API here
    setCustomers(customers.filter(customer => customer.id !== customerToDelete));
    setSelectedCustomers(selectedCustomers.filter(id => id !== customerToDelete));
    setDeleteDialogOpen(false);
    toast.success('Customer deleted successfully');
  };

  // Edit customer
  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setEditDialogOpen(true);
  };

  const saveCustomerChanges = () => {
    // In a real app, you would call an API here
    setCustomers(customers.map(customer => 
      customer.id === currentCustomer?.id ? currentCustomer : customer
    ));
    setEditDialogOpen(false);
    toast.success('Customer updated successfully');
  };

  // Toggle customer details
  const toggleCustomerDetails = (customerId: string) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  // Status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-500';
      case 'inactive':
        return 'bg-rose-500/20 text-rose-500';
      case 'lead':
        return 'bg-amber-500/20 text-amber-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  // Tier badge colors
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'vip':
        return 'bg-purple-500/20 text-purple-500';
      case 'premium':
        return 'bg-blue-500/20 text-blue-500';
      case 'regular':
        return 'bg-gray-500/20 text-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6 h-screen overflow-scroll no-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customer Management</h1>
          <p className="text-gray-400">Manage all customers in your system</p>
        </div>
        <Button 
          onClick={() => router.push('/admin/customers/create')}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Customer
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
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
              <DropdownMenuItem onClick={() => setFilters({...filters, status: 'active'})}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, status: 'inactive'})}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, status: 'lead'})}>
                Lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-800 border-gray-700 text-gray-300 hover:text-white">
                <Filter className="h-4 w-4 mr-2" />
                Tier: {filters.tier || 'All'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 text-gray-300">
              <DropdownMenuItem onClick={() => setFilters({...filters, tier: ''})}>
                All Tiers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, tier: 'vip'})}>
                VIP
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, tier: 'premium'})}>
                Premium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilters({...filters, tier: 'regular'})}>
                Regular
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {selectedCustomers.length > 0 && (
          <div className="flex items-center gap-2 justify-end">
            <span className="text-sm text-gray-400">
              {selectedCustomers.length} selected
            </span>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                setCustomerToDelete(selectedCustomers[0]);
                setDeleteDialogOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Customers Table */}
      <div className="rounded-lg border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-600">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    currentCustomers.length > 0 &&
                    currentCustomers.every(customer => selectedCustomers.includes(customer.id))
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-white"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center gap-1">
                  Customer
                  {sortConfig?.key === 'name' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-white"
                onClick={() => requestSort('email')}
              >
                <div className="flex items-center gap-1">
                  Email
                  {sortConfig?.key === 'email' && (
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
                onClick={() => requestSort('tier')}
              >
                <div className="flex items-center gap-1">
                  Tier
                  {sortConfig?.key === 'tier' && (
                    sortConfig.direction === 'ascending' ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-white text-right"
                onClick={() => requestSort('totalSpent')}
              >
                <div className="flex items-center gap-1 justify-end">
                  Total Spent
                  {sortConfig?.key === 'totalSpent' && (
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
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer) => (
                <>
                  <TableRow 
                    key={customer.id} 
                    className="hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => toggleCustomerDetails(customer.id)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={(checked) => 
                          handleSelectCustomer(customer.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400">{customer.email}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(customer.status)}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTierBadge(customer.tier)}>
                        {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      ${customer.totalSpent.toLocaleString()}
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
                            onClick={() => handleEditCustomer(customer)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="cursor-pointer text-rose-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Customer Details */}
                  {expandedCustomer === customer.id && (
                    <TableRow className="bg-gray-800/30">
                      <TableCell colSpan={7} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Customer Info */}
                          <div>
                            <h3 className="font-medium mb-3 flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Customer Details
                            </h3>
                            <Card className="bg-gray-800 border-gray-700">
                              <CardContent className="p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span>{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{customer.phone}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                  <div>
                                    <p>{customer.address}</p>
                                    <p>{customer.city}, {customer.country}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Order Stats */}
                          <div>
                            <h3 className="font-medium mb-3 flex items-center gap-2">
                              <ShoppingBag className="h-5 w-5" />
                              Order Statistics
                            </h3>
                            <Card className="bg-gray-800 border-gray-700">
                              <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Total Orders:</span>
                                  <span>{customer.totalOrders}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Total Spent:</span>
                                  <span>${customer.totalSpent.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Last Order:</span>
                                  <span>
                                    {customer.lastOrderDate ? 
                                      new Date(customer.lastOrderDate).toLocaleDateString() : 
                                      'Never'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Member Since:</span>
                                  <span>{new Date(customer.createdAt).toLocaleDateString()}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Payment & Notes */}
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-medium mb-3 flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Customer Tier
                              </h3>
                              <Card className="bg-gray-800 border-gray-700">
                                <CardContent className="p-4">
                                  <Badge className={getTierBadge(customer.tier)}>
                                    {customer.tier.toUpperCase()}
                                  </Badge>
                                  <div className="mt-2 text-sm text-gray-400">
                                    {customer.tier === 'vip' && 'Top 5% of customers'}
                                    {customer.tier === 'premium' && 'Top 20% of customers'}
                                    {customer.tier === 'regular' && 'Standard customer'}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            {customer.notes && (
                              <div>
                                <h3 className="font-medium mb-3 flex items-center gap-2">
                                  <AlertCircle className="h-5 w-5" />
                                  Notes
                                </h3>
                                <Card className="bg-gray-800 border-gray-700">
                                  <CardContent className="p-4">
                                    <p>{customer.notes}</p>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-400">
                  No customers found
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
            Showing {indexOfFirstCustomer + 1}-{Math.min(indexOfLastCustomer, filteredCustomers.length)} of {filteredCustomers.length} customers
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
              Are you sure you want to delete this customer? This action cannot be undone.
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

      {/* Edit Customer Dialog */}
      <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Edit Customer</AlertDialogTitle>
          </AlertDialogHeader>
          {currentCustomer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Customer ID</label>
                  <Input
                    value={currentCustomer.id}
                    readOnly
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <Input
                    value={currentCustomer.name}
                    onChange={(e) => setCurrentCustomer({...currentCustomer, name: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <Input
                    value={currentCustomer.email}
                    onChange={(e) => setCurrentCustomer({...currentCustomer, email: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                  <Input
                    value={currentCustomer.phone}
                    onChange={(e) => setCurrentCustomer({...currentCustomer, phone: e.target.value})}
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
                        {currentCustomer.status.charAt(0).toUpperCase() + currentCustomer.status.slice(1)}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-700 border-gray-600 w-full">
                      <DropdownMenuItem 
                        onClick={() => setCurrentCustomer({...currentCustomer, status: 'active'})}
                        className="cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentCustomer({...currentCustomer, status: 'inactive'})}
                        className="cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
                        Inactive
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentCustomer({...currentCustomer, status: 'lead'})}
                        className="cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        Lead
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tier</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between bg-gray-700 border-gray-600">
                        {currentCustomer.tier.charAt(0).toUpperCase() + currentCustomer.tier.slice(1)}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-700 border-gray-600 w-full">
                      <DropdownMenuItem 
                        onClick={() => setCurrentCustomer({...currentCustomer, tier: 'vip'})}
                        className="cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                        VIP
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentCustomer({...currentCustomer, tier: 'premium'})}
                        className="cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                        Premium
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setCurrentCustomer({...currentCustomer, tier: 'regular'})}
                        className="cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                        Regular
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                  <Input
                    value={currentCustomer.address}
                    onChange={(e) => setCurrentCustomer({...currentCustomer, address: e.target.value})}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                    <Input
                      value={currentCustomer.city}
                      onChange={(e) => setCurrentCustomer({...currentCustomer, city: e.target.value})}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                    <Input
                      value={currentCustomer.country}
                      onChange={(e) => setCurrentCustomer({...currentCustomer, country: e.target.value})}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                <Input
                  value={currentCustomer.notes || ''}
                  onChange={(e) => setCurrentCustomer({...currentCustomer, notes: e.target.value})}
                  className="bg-gray-700 border-gray-600"
                  placeholder="Add customer notes..."
                />
              </div>
              
              <div className="md:col-span-2 pt-4">
                <Button 
                  onClick={saveCustomerChanges}
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