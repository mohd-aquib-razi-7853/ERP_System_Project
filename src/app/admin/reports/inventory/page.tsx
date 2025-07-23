'use client'

import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash, Edit, Download, ChevronUp, ChevronDown, BarChart2, PieChart } from "lucide-react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { useState } from "react"
import * as echarts from "echarts"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Initial data
const initialSummary = [
  { label: "Total Items", value: "325" },
  { label: "Low Stock", value: "15" },
  { label: "Out of Stock", value: "8" },
  { label: "Warehouses", value: "3" }
]

const initialStockLevels = [
  { category: "Electronics", stock: 120 },
  { category: "Office Supplies", stock: 60 },
  { category: "Furniture", stock: 90 },
  { category: "Packaging", stock: 55 },
]

const initialInventory = [
  { id: 1, name: "USB Cable", sku: "USB001", quantity: 200, location: "Warehouse A", status: "In Stock" },
  { id: 2, name: "Laptop", sku: "LTP123", quantity: 8, location: "Warehouse A", status: "Low Stock" },
  { id: 3, name: "Chair", sku: "CHR456", quantity: 0, location: "Warehouse B", status: "Out of Stock" },
  { id: 4, name: "Paper A4", sku: "PPR001", quantity: 75, location: "Warehouse C", status: "In Stock" },
]

export default function InventoryReportPage() {
  const { theme } = useTheme()
  const [summary, setSummary] = useState(initialSummary)
  const [stockLevels, setStockLevels] = useState(initialStockLevels)
  const [inventory, setInventory] = useState(initialInventory)
  const [isExpanded, setIsExpanded] = useState({
    chart: true,
    table: true
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: 0,
    location: 'Warehouse A',
    status: 'In Stock'
  })

  // Chart options
  const chartOptions = {
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderWidth: 0,
      textStyle: {
        color: '#f3f4f6',
      }
    },
    xAxis: {
      type: 'category',
      data: stockLevels.map(s => s.category),
      axisLabel: { 
        color: theme === 'dark' ? '#9ca3af' : '#333',
        fontFamily: 'Inter, sans-serif'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: { 
        color: theme === 'dark' ? '#9ca3af' : '#333',
        fontFamily: 'Inter, sans-serif'
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: theme === 'dark' ? 'rgba(31, 41, 55, 0.5)' : 'rgba(0, 0, 0, 0.1)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'Stock',
        type: 'bar',
        barWidth: 24,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#8b5cf6' },
            { offset: 1, color: '#6d28d9' }
          ]),
          shadowColor: 'rgba(139, 92, 246, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(139, 92, 246, 0.5)',
            shadowBlur: 12
          }
        },
        data: stockLevels.map(s => s.stock),
        animationDelay: (idx: number) => idx * 120
      }
    ],
    animationEasing: 'cubicOut',
    animationDuration: 1200
  }

  // CRUD operations
  const handleAddItem = () => {
    const newItem = {
      id: inventory.length + 1,
      ...formData,
      status: formData.quantity === 0 ? 'Out of Stock' : 
             formData.quantity < 10 ? 'Low Stock' : 'In Stock'
    }
    setInventory([...inventory, newItem])
    updateSummary([...inventory, newItem])
    setIsDialogOpen(false)
    resetForm()
  }

  const handleEditItem = () => {
    const updatedInventory = inventory.map(item => 
      item.id === editingItem.id ? { 
        ...formData, 
        id: editingItem.id,
        status: formData.quantity === 0 ? 'Out of Stock' : 
               formData.quantity < 10 ? 'Low Stock' : 'In Stock'
      } : item
    )
    setInventory(updatedInventory)
    updateSummary(updatedInventory)
    setIsDialogOpen(false)
    setEditingItem(null)
    resetForm()
  }

  const handleDeleteItem = (id) => {
    const updatedInventory = inventory.filter(item => item.id !== id)
    setInventory(updatedInventory)
    updateSummary(updatedInventory)
  }

  const updateSummary = (inventoryData) => {
    const totalItems = inventoryData.length
    const lowStock = inventoryData.filter(item => item.status === 'Low Stock').length
    const outOfStock = inventoryData.filter(item => item.status === 'Out of Stock').length
    const warehouses = [...new Set(inventoryData.map(item => item.location))].length
    
    setSummary([
      { label: "Total Items", value: totalItems.toString() },
      { label: "Low Stock", value: lowStock.toString() },
      { label: "Out of Stock", value: outOfStock.toString() },
      { label: "Warehouses", value: warehouses.toString() }
    ])
  }

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      quantity: 0,
      location: 'Warehouse A',
      status: 'In Stock'
    })
  }

  const openEditDialog = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      location: item.location,
      status: item.status
    })
    setIsDialogOpen(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    })
  }

  return (
    <motion.div 
      className="h-screen overflow-scroll no-scrollbar bg-gray-950 text-gray-200 p-4 md:p-6 space-y-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        variants={itemVariants}
      >
        <div>
          <motion.h1
            className="text-2xl md:text-3xl font-bold tracking-tight text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Inventory Report
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Overview of current inventory status across categories and locations
          </motion.p>
        </div>
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  setEditingItem(null)
                  resetForm()
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Item Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <Input
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <Input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Select 
                    value={formData.location}
                    onValueChange={(value) => setFormData({...formData, location: value})}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800 text-white">
                      <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                      <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                      <SelectItem value="Warehouse C">Warehouse C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  className="border-gray-700 hover:bg-gray-800"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={editingItem ? handleEditItem : handleAddItem}
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </motion.div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        {summary.map((item, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="text-2xl font-bold text-white">{item.value}</p>
                <p className={`text-xs mt-1 ${
                  idx === 1 ? 'text-amber-400' : 
                  idx === 2 ? 'text-rose-400' : 
                  'text-emerald-400'
                }`}>
                  {idx === 1 ? `${Math.round(parseInt(item.value) / parseInt(summary[0].value) * 100)}% of total` : 
                   idx === 2 ? `${Math.round(parseInt(item.value) / parseInt(summary[0].value) * 100)}% of total` : 
                   'All inventory items'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Stock Levels Chart */}
      <motion.div variants={cardVariants}>
        <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-all text-white">
          <CardHeader 
            className="flex flex-row items-center justify-between cursor-pointer" 
            onClick={() => setIsExpanded(prev => ({ ...prev, chart: !prev.chart }))}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <BarChart2 className="h-5 w-5 text-indigo-400" />
              </motion.div>
              <CardTitle className="text-white">
                Stock Levels by Category
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-900/30 text-indigo-400 border-indigo-800">
                {stockLevels.reduce((sum, item) => sum + item.stock, 0)} total items
              </Badge>
              {isExpanded.chart ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </CardHeader>
          {isExpanded.chart && (
            <CardContent>
              <ReactECharts 
                option={chartOptions} 
                style={{ height: 300 }} 
                theme={theme === "dark" ? "dark" : "light"} 
              />
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Inventory Table */}
      <motion.div variants={cardVariants}>
        <Card className="bg-gray-900 text-white border-gray-800 hover:shadow-lg transition-all">
          <CardHeader 
            className="flex flex-row items-center justify-between cursor-pointer" 
            onClick={() => setIsExpanded(prev => ({ ...prev, table: !prev.table }))}
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ x: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <PieChart className="h-5 w-5 text-cyan-400" />
              </motion.div>
              <CardTitle className="text-white">
                Current Inventory
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gray-800 text-gray-300">
                {inventory.length} items
              </Badge>
              {isExpanded.table ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </CardHeader>
          {isExpanded.table && (
            <>
              <CardContent>
                <div className="rounded-lg border border-gray-800 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-800/50">
                      <TableRow className="hover:bg-gray-800/50">
                        <TableHead className="text-gray-300">Item</TableHead>
                        <TableHead className="text-gray-300">SKU</TableHead>
                        <TableHead className="text-gray-300">Quantity</TableHead>
                        <TableHead className="text-gray-300">Location</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((item) => (
                        <TableRow key={item.id} className="border-gray-800 hover:bg-gray-800/30">
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.sku}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            <Badge 
                              className={`text-xs ${
                                item.status === "In Stock" ? "bg-emerald-900/30 text-emerald-400 border-emerald-800" :
                                item.status === "Low Stock" ? "bg-amber-900/30 text-amber-400 border-amber-800" :
                                "bg-rose-900/30 text-rose-400 border-rose-800"
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
                                onClick={() => openEditDialog(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-gray-400 hover:text-rose-400 hover:bg-gray-800"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-gray-400">
                Showing {inventory.length} items. Low stock threshold is 10 units.
              </CardFooter>
            </>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}