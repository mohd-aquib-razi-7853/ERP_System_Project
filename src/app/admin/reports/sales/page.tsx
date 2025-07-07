'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const summaryData = [
  { label: "Total Sales", value: "₹1,20,000" },
  { label: "Total Orders", value: "310" },
  { label: "Total Revenue", value: "₹1,85,000" },
  { label: "New Customers", value: "72" },
]

const categoryData = [
  { category: "Electronics", orders: 120, sales: "₹70,000" },
  { category: "Apparel", orders: 85, sales: "₹40,000" },
  { category: "Office Supplies", orders: 65, sales: "₹30,000" },
]

export default function SalesReportPage() {
  const { theme } = useTheme()

  const chartOptions = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Sales',
        type: 'line',
        data: [10000, 12000, 15000, 13000, 17000, 19000, 21000],
        smooth: true,
        areaStyle: {}
      }
    ],
    darkMode: theme === "dark"
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Sales Report</h2>
        <p className="text-muted-foreground text-sm">Track daily, weekly and category-wise sales performance.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, idx) => (
          <Card key={idx} className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-card rounded-xl border dark:border-neutral-700 p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Weekly Sales Trend</h3>
        <ReactECharts option={chartOptions} style={{ height: 300 }} theme={theme === "dark" ? "dark" : "light"} />
      </div>

      <Separator />

      {/* Sales by Category */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Sales by Category</h3>
        <div className="rounded-xl border dark:border-neutral-700 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryData.map((cat, idx) => (
                <TableRow key={idx}>
                  <TableCell>{cat.category}</TableCell>
                  <TableCell>{cat.orders}</TableCell>
                  <TableCell>{cat.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
