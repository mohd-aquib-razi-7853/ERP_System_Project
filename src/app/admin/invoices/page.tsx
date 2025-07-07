"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ChevronDown,
  ArrowLeft,
  Calendar as CalendarIcon,
  Printer,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function InvoicePage() {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<{ from?: Date; to?: Date }>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample invoice data
  const invoices = [
    {
      id: 'INV-001',
      customer: 'Acme Corporation',
      date: new Date('2023-06-15'),
      dueDate: new Date('2023-07-15'),
      amount: 1250.75,
      status: 'paid',
      items: 3
    },
    {
      id: 'INV-002',
      customer: 'Globex Inc.',
      date: new Date('2023-06-18'),
      dueDate: new Date('2023-07-18'),
      amount: 895.50,
      status: 'pending',
      items: 5
    },
    {
      id: 'INV-003',
      customer: 'Soylent Corp',
      date: new Date('2023-06-20'),
      dueDate: new Date('2023-07-20'),
      amount: 2240.00,
      status: 'overdue',
      items: 2
    },
    {
      id: 'INV-004',
      customer: 'Initech LLC',
      date: new Date('2023-06-22'),
      dueDate: new Date('2023-07-22'),
      amount: 1565.25,
      status: 'paid',
      items: 4
    },
    {
      id: 'INV-005',
      customer: 'Umbrella Corp',
      date: new Date('2023-06-25'),
      dueDate: new Date('2023-07-25'),
      amount: 3200.00,
      status: 'pending',
      items: 7
    },
  ];

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesDate = (!dateFilter.from || invoice.date >= dateFilter.from) && 
                       (!dateFilter.to || invoice.date <= dateFilter.to);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-amber-500/15 text-amber-400 hover:bg-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-rose-500/15 text-rose-400 hover:bg-rose-500/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-scroll no-scrollbar bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Invoice Management</h1>
            <p className="text-gray-400">Track and manage all invoices in your system</p>
          </div>
          <Button 
            onClick={() => router.push('/admin/invoices/create')}
            className="bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{invoices.length}</div>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Paid Invoices
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {invoices.filter(i => i.status === 'paid').length}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {Math.round((invoices.filter(i => i.status === 'paid').length / invoices.length)) * 100}% of total
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Pending Invoices
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {invoices.filter(i => i.status === 'pending').length}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {Math.round((invoices.filter(i => i.status === 'pending').length / invoices.length)) * 100}% of total
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Outstanding Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-rose-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${invoices
                  .filter(i => i.status !== 'paid')
                  .reduce((sum, invoice) => sum + invoice.amount, 0)
                  .toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-400 mt-1">Unpaid invoices</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 mb-6 hover:border-gray-600/50 transition-colors">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-8 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white focus:ring-1 focus:ring-indigo-500/30">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all" className="hover:bg-gray-700 focus:bg-gray-700">All Statuses</SelectItem>
                  <SelectItem value="paid" className="hover:bg-gray-700 focus:bg-gray-700">Paid</SelectItem>
                  <SelectItem value="pending" className="hover:bg-gray-700 focus:bg-gray-700">Pending</SelectItem>
                  <SelectItem value="overdue" className="hover:bg-gray-700 focus:bg-gray-700">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal bg-gray-800 border-gray-700 hover:bg-gray-700 text-white",
                      (!dateFilter.from && !dateFilter.to) && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    {dateFilter.from ? (
                      dateFilter.to ? (
                        <>
                          {format(dateFilter.from, "MMM dd, yyyy")} -{" "}
                          {format(dateFilter.to, "MMM dd, yyyy")}
                        </>
                      ) : (
                        format(dateFilter.from, "MMM dd, yyyy")
                      )
                    ) : (
                      <span>Date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateFilter.from}
                    selected={{ from: dateFilter.from, to: dateFilter.to }}
                    onSelect={(range) => setDateFilter({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>

              <Button 
                variant="outline" 
                className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
              >
                <Download className="mr-2 h-4 w-4 text-gray-400" />
                <span>Export</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-gray-600/50 transition-colors">
          <CardHeader className="border-b border-gray-700/50">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Recent Invoices</CardTitle>
                <CardDescription className="text-gray-400">
                  {filteredInvoices.length} invoices found
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-700">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-800/50">
                <TableRow className="hover:bg-transparent border-gray-700/50">
                  <TableHead className="text-gray-400 font-medium">Invoice</TableHead>
                  <TableHead className="text-gray-400 font-medium">Customer</TableHead>
                  <TableHead className="text-gray-400 font-medium">Date</TableHead>
                  <TableHead className="text-gray-400 font-medium">Due Date</TableHead>
                  <TableHead className="text-gray-400 font-medium text-right">Amount</TableHead>
                  <TableHead className="text-gray-400 font-medium">Status</TableHead>
                  <TableHead className="text-right text-gray-400 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <motion.tr 
                    key={invoice.id} 
                    className="border-gray-700/50 hover:bg-gray-800/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TableCell className="font-medium text-white">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-indigo-400" />
                        {invoice.id}
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{invoice.customer}</TableCell>
                    <TableCell className="text-gray-400">
                      {format(invoice.date, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {format(invoice.dueDate, "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right text-white font-medium">
                      ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-gray-700/50"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-white" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          className="bg-gray-800 border-gray-700 text-white w-48"
                          align="end"
                        >
                          <DropdownMenuItem 
                            className="hover:bg-gray-700 focus:bg-gray-700"
                            onClick={() => router.push(`/admin/invoices/${invoice.id}`)}
                          >
                            <FileText className="mr-2 h-4 w-4 text-gray-400" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
                            <Printer className="mr-2 h-4 w-4 text-gray-400" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-gray-700 focus:bg-gray-700">
                            <Download className="mr-2 h-4 w-4 text-gray-400" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-400 hover:bg-gray-700 focus:bg-gray-700">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredInvoices.length === 0 && (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 mt-6 hover:border-gray-600/50 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <FileText className="h-10 w-10 text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-white mb-1">No invoices found</h3>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  className="border-gray-700 text-white hover:bg-gray-700"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setDateFilter({});
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}