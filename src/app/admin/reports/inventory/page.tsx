'use client'

import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import dynamic from "next/dynamic"

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const summary = [
  { label: "Total Items", value: "325" },
  { label: "Low Stock", value: "15" },
  { label: "Out of Stock", value: "8" },
  { label: "Warehouses", value: "3" }
]

const stockLevels = [
  { category: "Electronics", stock: 120 },
  { category: "Office Supplies", stock: 60 },
  { category: "Furniture", stock: 90 },
  { category: "Packaging", stock: 55 },
]

const inventory = [
  { name: "USB Cable", sku: "USB001", quantity: 200, location: "Warehouse A", status: "In Stock" },
  { name: "Laptop", sku: "LTP123", quantity: 8, location: "Warehouse A", status: "Low Stock" },
  { name: "Chair", sku: "CHR456", quantity: 0, location: "Warehouse B", status: "Out of Stock" },
  { name: "Paper A4", sku: "PPR001", quantity: 75, location: "Warehouse C", status: "In Stock" },
]

export default function InventoryReportPage() {
  const { theme } = useTheme()

  const chartOptions = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: stockLevels.map(s => s.category),
      axisLabel: { color: theme === 'dark' ? '#ccc' : '#333' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: theme === 'dark' ? '#ccc' : '#333' }
    },
    series: [
      {
        name: 'Stock',
        type: 'bar',
        data: stockLevels.map(s => s.stock),
        itemStyle: { color: '#4f46e5' }
      }
    ],
    darkMode: theme === 'dark'
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Inventory Report</h2>
        <p className="text-muted-foreground text-sm">Overview of current inventory status across categories and locations.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {summary.map((item, idx) => (
          <Card key={idx} className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stock Levels Chart */}
      <div className="bg-card rounded-xl border dark:border-neutral-700 p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Stock Levels by Category</h3>
        <ReactECharts option={chartOptions} style={{ height: 300 }} theme={theme === "dark" ? "dark" : "light"} />
      </div>

      <Separator />

      {/* Inventory Table */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Current Inventory</h3>
        <div className="rounded-xl border dark:border-neutral-700 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.status === "In Stock"
                          ? "bg-green-500/20 text-green-600"
                          : item.status === "Low Stock"
                          ? "bg-yellow-500/20 text-yellow-600"
                          : "bg-red-500/20 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
