'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Eye, Plus, Search, Box, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProductPage() {
  const [products, setProducts] = useState([
    { id: 1, name: "MacBook Pro 16\"", sku: "LP123", price: "₹1,50,000", stock: 10, category: "Electronics", image: "/macbook-pro.jpg" },
    { id: 2, name: "Wireless Mouse", sku: "MS234", price: "₹1,200", stock: 50, category: "Accessories", image: "/mouse.jpg" },
    { id: 3, name: "Mechanical Keyboard", sku: "KB345", price: "₹5,500", stock: 25, category: "Accessories", image: "/keyboard.jpg" },
    { id: 4, name: "4K Monitor", sku: "MN456", price: "₹35,000", stock: 8, category: "Electronics", image: "/monitor.jpg" }
  ])

  const [form, setForm] = useState({ id: null, name: '', sku: '', price: '', stock: '', category: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProduct = () => {
    if (form.id) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === form.id ? { 
          ...p, 
          name: form.name,
          sku: form.sku,
          price: form.price,
          stock: parseInt(form.stock),
          category: form.category
        } : p
      ))
    } else {
      // Add new product
      const newProduct = {
        ...form,
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        stock: parseInt(form.stock),
        image: "/placeholder-product.jpg"
      }
      setProducts([...products, newProduct])
    }
    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (product:any) => {
    setForm({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock.toString(),
      category: product.category
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id:any) => {
    setProducts(products.filter(p => p.id !== id))
    setIsDeleteDialogOpen(false)
  }

  const resetForm = () => {
    setForm({ id: null, name: '', sku: '', price: '', stock: '', category: '' })
  }

  // Calculate inventory summary
  const totalProducts = products.length
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
  const outOfStock = products.filter(p => p.stock === 0).length

  return (
    <div className="p-6 space-y-6 bg-gray-900 text-white min-h-screen">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Product Inventory</h2>
          <p className="text-muted-foreground">Manage your products and stock levels</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9 w-full md:w-[300px] bg-gray-800 border-gray-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            if (!open) resetForm()
            setIsDialogOpen(open)
          }}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus size={18} /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {form.id ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <Input 
                    placeholder="MacBook Pro 16\"
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU</label>
                  <Input 
                    placeholder="LP123" 
                    value={form.sku} 
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input 
                    placeholder="₹1,50,000" 
                    value={form.price} 
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock Quantity</label>
                  <Input 
                    type="number" 
                    placeholder="10" 
                    value={form.stock} 
                    onChange={e => setForm({ ...form, stock: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input 
                    placeholder="Electronics" 
                    value={form.category} 
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(false)
                  }}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddProduct}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {form.id ? 'Update Product' : 'Add Product'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">+120 from last month</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStock}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="border-none shadow-sm bg-gray-800 border-gray-700">
        <Table>
          <TableHeader className="bg-gray-700">
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-700/50 border-gray-700">
                <TableCell>
                  <Avatar className="h-10 w-10 rounded-md">
                    <AvatarImage src={product.image} alt={product.name} />
                    <AvatarFallback className="bg-gray-600">
                      {product.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-gray-700 border-gray-600">
                    {product.sku}
                  </Badge>
                </TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <Badge 
                    variant={product.stock < 5 ? "destructive" : "default"}
                    className="px-2 py-1 text-xs"
                  >
                    {product.stock} in stock
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gray-600">
                    {product.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-gray-700"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4 text-blue-400" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-gray-700"
                      onClick={() => {
                        setProductToDelete(product.id)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Search className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground">Try changing your search query</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDelete(productToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}