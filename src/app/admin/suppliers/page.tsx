"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Pencil,
  Eye,
  Search,
  ChevronDown,
  MoreHorizontal,
  X,
  Check,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariants = {
  Active: "bg-emerald-900 text-emerald-200 hover:bg-emerald-800",
  Inactive: "bg-rose-900 text-rose-200 hover:bg-rose-800",
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "Tech Distributors",
      contact: "9876543210",
      email: "tech@suppliers.com",
      address: "Delhi",
      status: "Active",
    },
    {
      id: 2,
      name: "Global Components",
      contact: "9123456789",
      email: "global@suppliers.com",
      address: "Mumbai",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Electro Parts Co.",
      contact: "9556677889",
      email: "electro@parts.com",
      address: "Bangalore",
      status: "Active",
    },
    {
      id: 4,
      name: "Future Tech Ltd.",
      contact: "9334455667",
      email: "future@tech.com",
      address: "Hyderabad",
      status: "Active",
    },
  ]);
  const [filteredSuppliers, setFilteredSuppliers] = useState(suppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationParent] = useAutoAnimate();

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    status: "Active",
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let results = suppliers;

    if (searchTerm) {
      results = results.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.contact.includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      results = results.filter((supplier) => supplier.status === statusFilter);
    }

    setFilteredSuppliers(results);
  }, [searchTerm, statusFilter, suppliers]);

  const handleAddSupplier = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newSupplier = {
        ...form,
        id: suppliers.length + 1,
      };
      setSuppliers([...suppliers, newSupplier]);
      setForm({
        name: "",
        contact: "",
        email: "",
        address: "",
        status: "Active",
      });
      setIsSubmitting(false);
      setDialogOpen(false);
    }, 1000);
  };

  const handleEditSupplier = () => {
    if (!currentId) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setSuppliers(
        suppliers.map((supplier) =>
          supplier.id === currentId ? { ...form, id: currentId } : supplier
        )
      );
      setForm({
        name: "",
        contact: "",
        email: "",
        address: "",
        status: "Active",
      });
      setEditMode(false);
      setCurrentId(null);
      setIsSubmitting(false);
      setDialogOpen(false);
    }, 1000);
  };

  const handleDelete = (id: number) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
  };

  const handleEdit = (supplier: any) => {
    setForm({
      name: supplier.name,
      contact: supplier.contact,
      email: supplier.email,
      address: supplier.address,
      status: supplier.status,
    });
    setCurrentId(supplier.id);
    setEditMode(true);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      contact: "",
      email: "",
      address: "",
      status: "Active",
    });
    setEditMode(false);
    setCurrentId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-950 text-gray-200 p-6 space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-gray-400">
            Manage your suppliers and inventory sources
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex gap-2 bg-primary hover:bg-primary/90">
                <Plus size={18} />
                <span>Add Supplier</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 text-gray-200">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {editMode ? "Edit Supplier" : "Add New Supplier"}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {editMode
                      ? "Update the supplier details below"
                      : "Fill in the details for the new supplier"}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Supplier Name
                    </label>
                    <Input
                      placeholder="Tech Distributors"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 focus:border-primary text-gray-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Contact Number
                      </label>
                      <Input
                        placeholder="9876543210"
                        value={form.contact}
                        onChange={(e) =>
                          setForm({ ...form, contact: e.target.value })
                        }
                        className="bg-gray-800 border-gray-700 focus:border-primary text-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <Input
                        placeholder="tech@suppliers.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="bg-gray-800 border-gray-700 focus:border-primary text-gray-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Address
                    </label>
                    <Input
                      placeholder="123 Business Park, Delhi"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      className="bg-gray-800 border-gray-700 focus:border-primary text-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Status
                    </label>
                    <Select
                      value={form.status}
                      onValueChange={(value) =>
                        setForm({ ...form, status: value })
                      }
                    >
                      <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectItem
                          value="Active"
                          className="hover:bg-gray-700"
                        >
                          Active
                        </SelectItem>
                        <SelectItem
                          value="Inactive"
                          className="hover:bg-gray-700"
                        >
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={editMode ? handleEditSupplier : handleAddSupplier}
                    disabled={isSubmitting}
                    className="relative bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting && (
                      <motion.span
                        className="absolute left-4"
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                      >
                        <Loader2 size={18} />
                      </motion.span>
                    )}
                    <span>{editMode ? "Update Supplier" : "Add Supplier"}</span>
                  </Button>
                </DialogFooter>
              </motion.div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Total Suppliers
            </CardTitle>
            <div className="bg-primary/10 p-2 rounded-lg">
              <Plus className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{suppliers.length}</div>
            <p className="text-xs text-gray-500">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Active
            </CardTitle>
            <div className="bg-emerald-900/20 p-2 rounded-lg">
              <Check className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {suppliers.filter((s) => s.status === "Active").length}
            </div>
            <p className="text-xs text-gray-500">+1 from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Inactive
            </CardTitle>
            <div className="bg-rose-900/20 p-2 rounded-lg">
              <X className="h-4 w-4 text-rose-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {suppliers.filter((s) => s.status === "Inactive").length}
            </div>
            <p className="text-xs text-gray-500">No change</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              New This Month
            </CardTitle>
            <div className="bg-blue-900/20 p-2 rounded-lg">
              <Plus className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1</div>
            <p className="text-xs text-gray-500">+100% from last month</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-3"
      >
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search suppliers..."
            className="pl-9 bg-gray-900 border-gray-800 text-gray-200 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800 text-gray-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-800 text-gray-200">
            <SelectItem value="all" className="hover:bg-gray-800">
              All Status
            </SelectItem>
            <SelectItem value="Active" className="hover:bg-gray-800">
              Active
            </SelectItem>
            <SelectItem value="Inactive" className="hover:bg-gray-800">
              Inactive
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          className="ml-auto text-gray-400 hover:text-gray-200"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border border-gray-800 rounded-lg overflow-hidden shadow-sm bg-gray-900"
      >
        <Table>
          <TableHeader className="bg-gray-800/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Contact</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Address</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-right text-gray-300">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody ref={animationParent} className="border-t border-gray-800">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-gray-800/30">
                  <TableCell>
                    <Skeleton className="h-4 w-[120px] bg-gray-800" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px] bg-gray-800" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[160px] bg-gray-800" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px] bg-gray-800" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[70px] bg-gray-800" />
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md bg-gray-800" />
                    <Skeleton className="h-8 w-8 rounded-md bg-gray-800" />
                    <Skeleton className="h-8 w-8 rounded-md bg-gray-800" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AnimatePresence>
                {filteredSuppliers.map((supplier) => (
                  <motion.tr
                    key={supplier.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-800 hover:bg-gray-800/30"
                  >
                    <TableCell className="font-medium">
                      {supplier.name}
                    </TableCell>
                    <TableCell>{supplier.contact}</TableCell>
                    <TableCell className="text-primary-300 hover:underline cursor-pointer">
                      {supplier.email}
                    </TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          statusVariants[
                            supplier.status as keyof typeof statusVariants
                          ]
                        } transition-colors`}
                      >
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-800 hover:text-primary text-gray-400"
                            onClick={() => handleEdit(supplier)}
                          >
                            <Pencil size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                          Edit
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-800 hover:text-rose-400 text-gray-400"
                            onClick={() => handleDelete(supplier.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200">
                          Delete
                        </TooltipContent>
                      </Tooltip>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                          >
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-gray-800 border-gray-700 text-gray-200"
                        >
                          <DropdownMenuItem
                            className="flex items-center gap-2 hover:bg-gray-700 cursor-pointer"
                            onClick={() => {}}
                          >
                            <Eye size={14} className="text-gray-400" /> View
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-emerald-400 hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleEdit(supplier)}
                          >
                            <Pencil size={14} /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-rose-400 hover:bg-gray-700 cursor-pointer"
                            onClick={() => handleDelete(supplier.id)}
                          >
                            <Trash2 size={14} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>

        {!isLoading && filteredSuppliers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <Search className="h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-300">
              No suppliers found
            </h3>
            <p className="text-sm text-gray-500">
              {searchTerm
                ? "Try a different search term"
                : "Add a new supplier to get started"}
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
