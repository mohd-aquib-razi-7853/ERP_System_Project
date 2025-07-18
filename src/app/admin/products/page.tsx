"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  Pencil,
  Trash2,
  Plus,
  Search,
  Box,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the Zod schema for product form validation
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.string().regex(/^₹\d{1,3}(,\d{3})*(\.\d{1,2})?$/, "Invalid price format"),
  stock: z.string().regex(/^\d+$/, "Stock must be a non-negative integer").transform((val) => parseInt(val, 10)),
  category: z.string().min(1, "Category is required"),
});

type ProductType = {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock: number;
  category: string;
  image: string;
};

export default function ProductPage() {
  const [products, setProducts] = useState<ProductType[]>([
    {
      id: 1,
      name: 'MacBook Pro 16"',
      sku: "LP123",
      price: "₹1,50,000",
      stock: 10,
      category: "Electronics",
      image: "/macbook-pro.jpg",
    },
    {
      id: 2,
      name: "Wireless Mouse",
      sku: "MS234",
      price: "₹1,200",
      stock: 50,
      category: "Accessories",
      image: "/mouse.jpg",
    },
    {
      id: 3,
      name: "Mechanical Keyboard",
      sku: "KB345",
      price: "₹5,500",
      stock: 25,
      category: "Accessories",
      image: "/keyboard.jpg",
    },
    {
      id: 4,
      name: "4K Monitor",
      sku: "MN456",
      price: "₹35,000",
      stock: 8,
      category: "Electronics",
      image: "/monitor.jpg",
    },
  ]);

  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    const formData = {
      name: form.name,
      sku: form.sku,
      price: form.price,
      stock: form.stock,
      category: form.category,
    };
    const result = productSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    if (form.id) {
      setProducts(
        products.map((p) =>
          p.id === form.id
            ? {
                ...p,
                name: result.data.name,
                sku: result.data.sku,
                price: result.data.price,
                stock: result.data.stock,
                category: result.data.category,
              }
            : p
        )
      );
    } else {
      const newProduct = {
        id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        name: result.data.name,
        sku: result.data.sku,
        price: result.data.price,
        stock: result.data.stock,
        category: result.data.category,
        image: "/placeholder-product.jpg",
      };
      setProducts([...products, newProduct]);
    }
    resetForm();
    setIsDialogOpen(false);
    setErrors({});
  };

  const handleEdit = (product: ProductType) => {
    setForm({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock.toString(),
      category: product.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    setIsDeleteDialogOpen(false);
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      sku: "",
      price: "",
      stock: "",
      category: "",
    });
  };

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;

  return (
    <div className="p-8 space-y-8 bg-gray-950 text-white min-h-screen font-['Inter',sans-serif]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-amber-500">
            Product Inventory
          </h2>
          <p className="text-gray-300 mt-1">
            Exquisite Management for Exclusive Assets
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
            <Input
              placeholder="Search your exclusive collection..."
              className="pl-10 w-full md:w-[320px] bg-gray-900 border-gray-700 text-white focus:border-amber-500 transition-all duration-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (open) setErrors({});
              else resetForm();
              setIsDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button className="flex gap-2 bg-amber-600 hover:bg-amber-700 hover:scale-105 transition-transform duration-200 shadow-md">
                <Plus size={20} /> Add Exclusive Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-700 text-white shadow-lg rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl text-amber-500">
                  {form.id ? "Refine Item Details" : "Curate New Luxury Item"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-6 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Item Name</label>
                  <Input
                    placeholder='MacBook Pro 16"'
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">SKU</label>
                  <Input
                    placeholder="LP123"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                  />
                  {errors.sku && <p className="text-red-500 text-sm">{errors.sku[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Price</label>
                  <Input
                    placeholder="₹1,50,000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price[0]}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">Stock Quantity</label>
                  <Input
                    type="number"
                    placeholder="10"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                  />
                  {errors.stock && <p className="text-red-500 text-sm">{errors.stock[0]}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-gray-200">Category</label>
                  <Input
                    placeholder="Electronics"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white focus:border-amber-500 transition-all duration-300"
                  />
                  {errors.category && <p className="text-red-500 text-sm">{errors.category[0]}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsDialogOpen(false);
                  }}
                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProduct}
                  className="bg-amber-600 hover:bg-amber-700 hover:scale-105 transition-transform duration-200"
                >
                  {form.id ? "Update Item" : "Add Item"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gray-900 border-gray-700 text-white shadow-lg hover:shadow-xl transição-all duration-300 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Total Assets</CardTitle>
            <Plus className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{totalProducts}</div>
            <p className="text-xs text-gray-400">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-700 text-white shadow-lg hover:shadow-xl transição-all duration-300 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Inventory Volume</CardTitle>
            <Box className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{totalStock}</div>
            <p className="text-xs text-gray-400">+120 from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-700 text-white shadow-lg hover:shadow-xl transição-all duration-300 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">Out of Stock</CardTitle>
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">{outOfStock}</div>
            <p className="text-xs text-gray-400">+1 from last month</p>
          </CardContent>
        </Card>
      </div>

      <hr className="my-8 border-gray-800" />

      {/* Products Table */}
      <Card className="border-none bg-gray-900 text-white shadow-lg rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700 hover:bg-gray-900">
              <TableHead className="w-[100px] text-gray-300 font-semibold">Image</TableHead>
              <TableHead className="text-gray-300 font-semibold">Item</TableHead>
              <TableHead className="text-gray-300 font-semibold">SKU</TableHead>
              <TableHead className="text-gray-300 font-semibold">Price</TableHead>
              <TableHead className="text-gray-300 font-semibold">Stock</TableHead>
              <TableHead className="text-gray-300 font-semibold">Category</TableHead>
              <TableHead className="text-right text-gray-300 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow
                key={product.id}
                className="hover:bg-gray-800 transition-colors duration-200 border-b border-gray-800"
              >
                <TableCell>
                  <Avatar className="h-12 w-12 rounded-md ring-2 ring-amber-500 hover:ring-amber-400 transition-all duration-200">
                    <AvatarImage src={product.image} alt={product.name} />
                    <AvatarFallback className="bg-gray-700 text-amber-500">
                      {product.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium text-gray-100">{product.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-gray-800 border-gray-600 text-amber-500"
                  >
                    {product.sku}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-100">{product.price}</TableCell>
                <TableCell>
                  <Badge
                    variant={product.stock < 5 ? "destructive" : "default"}
                    className="px-2 py-1 text-xs bg-gray-800 border-gray-600 text-gray-100"
                  >
                    {product.stock} in stock
                    {product.stock < 5 && product.stock > 0 && (
                      <AlertCircle className="h-3 w-3 ml-1 text-red-500" />
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-gray-700 text-amber-500"
                  >
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-gray-700 hover:text-amber-400 transition-colors duration-200"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-5 w-5 text-amber-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-gray-700 hover:text-red-400 transition-colors duration-200"
                      onClick={() => {
                        setProductToDelete(product.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-gray-400">
          <Search className="h-14 w-14 text-amber-500" />
          <h3 className="text-xl font-medium">No Items Found</h3>
          <p>Refine your search to explore your collection</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white shadow-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-amber-500">Confirm Removal</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-200">
              Are you certain you wish to remove this item from your collection? This action is permanent.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(productToDelete!)}
              className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-transform duration-200"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}