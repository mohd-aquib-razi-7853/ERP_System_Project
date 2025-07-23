"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Filter,
  Loader2,
  Check,
  Download,
  ChevronDown,
  ChevronUp,
  Box,
  AlertCircle,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type StockItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
  description?: string;
  image?: string;
};

type SortConfig = {
  key: keyof StockItem;
  direction: 'ascending' | 'descending';
};

export default function StockManagementPage() {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [openViewDialog, setOpenViewDialog] = useState<boolean>(false);
  const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [formData, setFormData] = useState<
    Omit<StockItem, "id" | "status" | "lastUpdated" | "image">
  >({
    name: "",
    category: "",
    quantity: 0,
    threshold: 5,
    description: "",
  });
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockData: StockItem[] = [
          {
            id: "1",
            name: "Steel Rod",
            category: "Raw Material",
            quantity: 250,
            threshold: 10,
            status: "In Stock",
            lastUpdated: new Date().toISOString().split("T")[0],
            description: "High-quality steel rods for construction",
            image: "/steel-rod.jpg",
          },
          {
            id: "2",
            name: "Welding Machine",
            category: "Tool",
            quantity: 5,
            threshold: 3,
            status: "Low Stock",
            lastUpdated: new Date(Date.now() - 86400000 * 7)
              .toISOString()
              .split("T")[0],
            image: "/welding-machine.jpg",
          },
          {
            id: "3",
            name: "Safety Helmet",
            category: "Safety",
            quantity: 0,
            threshold: 5,
            status: "Out of Stock",
            lastUpdated: new Date(Date.now() - 86400000 * 3)
              .toISOString()
              .split("T")[0],
            image: "/safety-helmet.jpg",
          },
          {
            id: "4",
            name: "Concrete Mix",
            category: "Raw Material",
            quantity: 42,
            threshold: 20,
            status: "In Stock",
            lastUpdated: new Date(Date.now() - 86400000 * 2)
              .toISOString()
              .split("T")[0],
            image: "/concrete-mix.jpg",
          },
          {
            id: "5",
            name: "Power Drill",
            category: "Tool",
            quantity: 8,
            threshold: 5,
            status: "In Stock",
            lastUpdated: new Date(Date.now() - 86400000 * 1)
              .toISOString()
              .split("T")[0],
            image: "/power-drill.jpg",
          },
        ];
        setStockItems(mockData);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load stock items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sort items
  const requestSort = (key: keyof StockItem) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = [...stockItems].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue !== undefined && bValue !== undefined) {
      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
    }
    return 0;
  });

  // Calculate status based on quantity and threshold
  const calculateStatus = (quantity: number, threshold: number): "In Stock" | "Low Stock" | "Out of Stock" => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= threshold) return "Low Stock";
    return "In Stock";
  };

  // Filter items based on search and category
  const filteredItems = sortedItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || item.category === category)
  );

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "threshold"
          ? parseInt(value) || 0
          : value,
    }));
  };

  // Reset form when dialog closes
  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: 0,
      threshold: 5,
      description: "",
    });
    setSelectedItem(null);
  };

  // Handle form submission for adding new item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newItem: StockItem = {
        id: Math.random().toString(36).substring(2, 9),
        ...formData,
        status: calculateStatus(formData.quantity, formData.threshold),
        lastUpdated: new Date().toISOString().split("T")[0],
        image: "/placeholder-item.jpg",
      };

      setStockItems((prev) => [...prev, newItem]);
      resetForm();
      setOpenAddDialog(false);
      toast.success("Item added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add item");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle item update
  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setIsLoading(true);

    try {
      const updatedItem: StockItem = {
        ...selectedItem,
        ...formData,
        status: calculateStatus(formData.quantity, formData.threshold),
        lastUpdated: new Date().toISOString().split("T")[0],
      };

      setStockItems((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? updatedItem : item))
      );

      setOpenEditDialog(false);
      resetForm();
      toast.success("Item updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update item");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle item deletion
  const handleDeleteItem = () => {
    if (!selectedItem) return;

    setIsDeleting(true);

    try {
      setStockItems((prev) =>
        prev.filter((item) => item.id !== selectedItem.id)
      );
      setOpenDeleteDialog(false);
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  // Prepare form for editing
  const prepareEditForm = (item: StockItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      threshold: item.threshold,
      description: item.description || "",
    });
    setOpenEditDialog(true);
  };

  // Status counts for summary cards
  const statusCounts = {
    inStock: stockItems.filter(item => item.status === "In Stock").length,
    lowStock: stockItems.filter(item => item.status === "Low Stock").length,
    outOfStock: stockItems.filter(item => item.status === "Out of Stock").length,
  };

  const totalQuantity = stockItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="p-8 space-y-8 bg-gray-950 text-white h-screen overflow-scroll no-scrollbar font-['Inter',sans-serif]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 ">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Premium Stock Inventory
          </h2>
          <p className="text-gray-400 mt-1">
            Elite Management for Exclusive Materials
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-200" />
            <Input
              placeholder="Search your premium materials..."
              className="pl-10 w-full md:w-[320px] bg-gray-900 border-gray-700 text-white focus:border-amber-500 transition-all duration-300 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Add Item Dialog */}
          <Dialog open={openAddDialog} onOpenChange={(open) => {
            if (!open) resetForm();
            setOpenAddDialog(open);
          }}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 bg-indigo-600 hover:bg-indigo-500 hover:scale-105 transition-transform duration-200 shadow-md">
                <Plus size={20} /> Add Premium Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 text-white shadow-lg rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl text-white">
                  Add Premium Stock
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Item Name *</label>
                    <Input
                      name="name"
                      placeholder="Steel Rod"
                      className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Category *</label>
                    <Select
                      name="category"
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                      required
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-amber-500">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 text-white">
                        <SelectItem value="Raw Material" className="hover:bg-gray-700">Raw Material</SelectItem>
                        <SelectItem value="Tool" className="hover:bg-gray-700">Tool</SelectItem>
                        <SelectItem value="Safety" className="hover:bg-gray-700">Safety</SelectItem>
                        <SelectItem value="Equipment" className="hover:bg-gray-700">Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Quantity *</label>
                    <Input
                      name="quantity"
                      type="number"
                      placeholder="250"
                      className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Threshold *</label>
                    <Input
                      name="threshold"
                      type="number"
                      placeholder="10"
                      className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                      value={formData.threshold}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Description</label>
                  <Input
                    name="description"
                    placeholder="High-quality materials..."
                    className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setOpenAddDialog(false);
                    }}
                    className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 hover:scale-105 transition-transform duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Add Item
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gray-900 border-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Total Items</CardTitle>
            <Package className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stockItems.length}</div>
            <p className="text-xs text-gray-400">+3 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Total Quantity</CardTitle>
            <Box className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalQuantity}</div>
            <p className="text-xs text-gray-400">+120 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Out of Stock</CardTitle>
            <AlertCircle className="h-5 w-5 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{statusCounts.outOfStock}</div>
            <p className="text-xs text-gray-400">+1 from last month</p>
          </CardContent>
        </Card>
      </div>

      <hr className="my-8 border-gray-800" />

      {/* Stock Table */}
      <Card className="border-none bg-gray-900 text-white shadow-lg rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700 hover:bg-gray-900">
              <TableHead className="w-[100px] text-gray-300 font-semibold">Image</TableHead>
              <TableHead className="text-gray-300 font-semibold">Item</TableHead>
              <TableHead className="text-gray-300 font-semibold">Category</TableHead>
              <TableHead className="text-gray-300 font-semibold">Quantity</TableHead>
              <TableHead className="text-gray-300 font-semibold">Status</TableHead>
              <TableHead className="text-gray-300 font-semibold">Last Updated</TableHead>
              <TableHead className="text-right text-gray-300 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span className="text-gray-400">Loading inventory...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredItems.length > 0 ? (
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-gray-800 transition-colors duration-200 border-b border-gray-800"
                  >
                    <TableCell>
                      <Avatar className="h-12 w-12 rounded-md transition-all duration-200">
                        <AvatarImage src={item.image} alt={item.name} />
                        <AvatarFallback className="bg-gray-700 text-white">
                          {item.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-gray-100">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-800 border-gray-600 text-white">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-100">{item.quantity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "In Stock"
                            ? "default"
                            : item.status === "Low Stock"
                            ? "outline"
                            : "destructive"
                        }
                        className="px-2 py-1 text-xs text-white"
                      >
                        {item.status}
                        {item.status === "Low Stock" && (
                          <AlertCircle className="h-3 w-3 ml-1 text-amber-500" />
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {item.lastUpdated}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-gray-700 hover:text-amber-400 transition-colors duration-200"
                          onClick={() => {
                            setSelectedItem(item);
                            setOpenViewDialog(true);
                          }}
                        >
                          <Eye className="h-5 w-5 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-gray-700 hover:text-blue-400 transition-colors duration-200"
                          onClick={() => prepareEditForm(item)}
                        >
                          <Pencil className="h-5 w-5 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-gray-700 hover:text-red-400 transition-colors duration-200"
                          onClick={() => {
                            setSelectedItem(item);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center py-8 gap-4">
                    <Search className="h-14 w-14 text-gray-500" />
                    <h3 className="text-xl font-medium">No Items Found</h3>
                    <p>Adjust your search to find your materials</p>
                    {search && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearch("");
                          setCategory("All");
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* View Item Dialog */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 text-white shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              {selectedItem?.name} Details
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-center">
                <Avatar className="h-32 w-32 rounded-lg">
                  <AvatarImage src={selectedItem.image} alt={selectedItem.name} />
                  <AvatarFallback className="bg-gray-700 text-white text-4xl">
                    {selectedItem.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Item Name</h3>
                  <p className="mt-1 text-lg font-medium">{selectedItem.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Category</h3>
                  <p className="mt-1">
                    <Badge variant="outline" className="bg-gray-800 border-gray-600 text-white">
                      {selectedItem.category}
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Current Quantity</h3>
                  <p className="mt-1 text-lg font-medium">{selectedItem.quantity}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Threshold</h3>
                  <p className="mt-1 text-lg font-medium">{selectedItem.threshold}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Status</h3>
                  <p className="mt-1">
                    <Badge
                      variant={
                        selectedItem.status === "In Stock"
                          ? "default"
                          : selectedItem.status === "Low Stock"
                          ? "outline"
                          : "destructive"
                      }
                      className="text-xs text-white"
                    >
                      {selectedItem.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Last Updated</h3>
                  <p className="mt-1 text-lg font-medium">{selectedItem.lastUpdated}</p>
                </div>
              </div>
              {selectedItem.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Description</h3>
                  <p className="mt-1 text-gray-300">
                    {selectedItem.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={openEditDialog} onOpenChange={(open) => {
        if (!open) resetForm();
        setOpenEditDialog(open);
      }}>
        <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 text-white shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">
              Edit Item Details
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateItem} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Item Name *</label>
                <Input
                  name="name"
                  placeholder="Steel Rod"
                  className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Category *</label>
                <Select
                  name="category"
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                  required
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-amber-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="Raw Material" className="hover:bg-gray-700">Raw Material</SelectItem>
                    <SelectItem value="Tool" className="hover:bg-gray-700">Tool</SelectItem>
                    <SelectItem value="Safety" className="hover:bg-gray-700">Safety</SelectItem>
                    <SelectItem value="Equipment" className="hover:bg-gray-700">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Quantity *</label>
                <Input
                  name="quantity"
                  type="number"
                  placeholder="250"
                  className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Threshold *</label>
                <Input
                  name="threshold"
                  type="number"
                  placeholder="10"
                  className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                  value={formData.threshold}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200">Description</label>
              <Input
                name="description"
                placeholder="High-quality materials..."
                className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpenEditDialog(false);
                }}
                className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 hover:scale-105 transition-transform duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Update Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white">Confirm Removal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-200">
              Are you certain you wish to remove <span className="font-semibold text-white">{selectedItem?.name}</span> from your inventory? This action is permanent.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
              className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform duration-200"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}