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
  X,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

type StockItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
  description?: string;
};

export default function StockManagementPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<String>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [formData, setFormData] = useState<
    Omit<StockItem, "id" | "status" | "lastUpdated">
  >({
    name: "",
    category: "",
    quantity: 0,
    threshold: 5,
    description: "",
  });

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
          },
        ];
        setStockItems(mockData);
      } catch (error) {
        toast("Failed to load stock items");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Calculate status based on quantity and threshold
  const calculateStatus = (quantity: number, threshold: number) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= threshold) return "Low Stock";
    return "In Stock";
  };

  // Filter items based on search and category
  const filteredItems = stockItems.filter(
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
      };

      setStockItems((prev) => [...prev, newItem]);
      setFormData({
        name: "",
        category: "",
        quantity: 0,
        threshold: 5,
        description: "",
      });

      toast("Item added successfully");
    } catch (error) {
      toast("Failed to add item");
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
      const updatedItem = {
        ...selectedItem,
        ...formData,
        status: calculateStatus(formData.quantity, formData.threshold),
        lastUpdated: new Date().toISOString().split("T")[0],
      };

      setStockItems((prev) =>
        prev.map((item) => (item.id === selectedItem.id ? updatedItem : item))
      );

      setOpenEditDialog(false);
      toast(
        
 "Item updated successfully",
      );
    } catch (error) {
      toast(
       
 "Failed to update item",
      );
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
      toast(
       
         "Item deleted successfully",
);
    } catch (error) {
      toast(
         "Failed to delete item",
      );
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

  return (
    <div className="p-6 space-y-6 bg-gray-900 h-screen overflow-scroll no-scrollbar text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold  text-white">
          Stock Management
        </h1>
        <div className="flex items-center space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] rounded-lg bg-gray-900 text-gray-200 ">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Add New Stock Item
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Item Name *
                    </label>
                    <Input
                      name="name"
                      placeholder="Enter item name"
                      className="rounded-lg"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Category *
                    </label>
                    <Select
                      name="category"
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                      required
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Raw Material">
                          Raw Material
                        </SelectItem>
                        <SelectItem value="Tool">Tool</SelectItem>
                        <SelectItem value="Safety">Safety</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Quantity *
                    </label>
                    <Input
                      name="quantity"
                      placeholder="Enter quantity"
                      type="number"
                      className="rounded-lg"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">
                      Low Stock Threshold *
                    </label>
                    <Input
                      name="threshold"
                      placeholder="Set low stock threshold"
                      type="number"
                      className="rounded-lg"
                      value={formData.threshold}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Description
                  </label>
                  <Input
                    name="description"
                    placeholder="Enter description (optional)"
                    className="rounded-lg"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 rounded-lg"
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

      <Card className="border-1 shadow-sm bg-gray-900 text-white">
        <CardHeader className="py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search stock items..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-lg  bg-gray-800"
                />
              </div>
              <Select value={category} onValueChange={setCategory} defaultValue="All Categories">
                <SelectTrigger className="w-[200px] rounded-lg bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="All Categories"   />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Raw Material">Raw Material</SelectItem>
                  <SelectItem value="Tool">Tool</SelectItem>
                  <SelectItem value="Safety">Safety</SelectItem>
                  <SelectItem value="Equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="rounded-lg bg-transparent hover:bg-gray-800 hover:text-white ">
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-800">
              <TableRow className="">
                <TableHead className="font-medium text-gray-300">Item</TableHead>
                <TableHead className="font-medium text-gray-300">Category</TableHead>
                <TableHead className="font-medium text-gray-300">Quantity</TableHead>
                <TableHead className="font-medium text-gray-300">Status</TableHead>
                <TableHead className="font-medium text-gray-300">Last Updated</TableHead>
                <TableHead className="font-medium text-gray-300 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Loading inventory...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="border-t">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "In Stock"
                            ? "default"
                            : item.status === "Low Stock"
                            ? "warning"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {item.lastUpdated}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg"
                              onClick={() => {
                                setSelectedItem(item);
                                setOpenViewDialog(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg"
                              onClick={() => prepareEditForm(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Item</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600"
                              onClick={() => {
                                setSelectedItem(item);
                                setOpenDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Item</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-gray-500"
                  >
                    No items found.{" "}
                    {search && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => {
                          setSearch("");
                          setCategory("");
                        }}
                      >
                        Clear filters
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Item Dialog */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="sm:max-w-[600px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Item Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Item Name
                  </h3>
                  <p className="mt-1 text-sm">{selectedItem.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Category
                  </h3>
                  <p className="mt-1 text-sm">
                    <Badge variant="outline" className="text-xs">
                      {selectedItem.category}
                    </Badge>
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Current Quantity
                  </h3>
                  <p className="mt-1 text-sm">{selectedItem.quantity}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Low Stock Threshold
                  </h3>
                  <p className="mt-1 text-sm">{selectedItem.threshold}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 text-sm">
                    <Badge
                      variant={
                        selectedItem.status === "In Stock"
                          ? "default"
                          : selectedItem.status === "Low Stock"
                          ? "warning"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {selectedItem.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Updated
                  </h3>
                  <p className="mt-1 text-sm">{selectedItem.lastUpdated}</p>
                </div>
              </div>
              {selectedItem.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Description
                  </h3>
                  <p className="mt-1 text-sm  text-gray-300">
                    {selectedItem.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent className="sm:max-w-[600px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Stock Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateItem} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Item Name *
                </label>
                <Input
                  name="name"
                  placeholder="Enter item name"
                  className="rounded-lg"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Category *
                </label>
                <Select
                  name="category"
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                  required
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Raw Material">Raw Material</SelectItem>
                    <SelectItem value="Tool">Tool</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Quantity *
                </label>
                <Input
                  name="quantity"
                  placeholder="Enter quantity"
                  type="number"
                  className="rounded-lg"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Low Stock Threshold *
                </label>
                <Input
                  name="threshold"
                  placeholder="Set low stock threshold"
                  type="number"
                  className="rounded-lg"
                  value={formData.threshold}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Description
              </label>
              <Input
                name="description"
                placeholder="Enter description (optional)"
                className="rounded-lg"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 rounded-lg"
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
        <DialogContent className="sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className=" text-gray-300">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedItem?.name}</span>? This
              action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteItem}
              className="rounded-lg"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
