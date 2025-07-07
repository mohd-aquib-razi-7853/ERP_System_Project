'use client'

import { useTheme } from "next-themes"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import dynamic from "next/dynamic"

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false })

const summaryData = [
  { label: "Total Income", value: "₹4,50,000" },
  { label: "Total Expenses", value: "₹2,90,000" },
  { label: "Net Profit", value: "₹1,60,000" },
  { label: "Pending Invoices", value: "₹35,000" }
]

const profitTrend = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  profits: [20000, 30000, 25000, 40000, 32000, 38000]
}

const transactions = [
  { id: 1, type: "Invoice", description: "Client A Payment", amount: "₹50,000", date: "2025-07-01", status: "Paid" },
  { id: 2, type: "Expense", description: "Server Cost", amount: "₹12,000", date: "2025-06-29", status: "Completed" },
  { id: 3, type: "Invoice", description: "Client B Invoice", amount: "₹35,000", date: "2025-06-25", status: "Pending" },
  { id: 4, type: "Expense", description: "Employee Salary", amount: "₹1,50,000", date: "2025-06-30", status: "Completed" }
]

export default function FinanceReportPage() {
  const { theme } = useTheme()

  const chartOptions = {
    tooltip: { trigger: "axis" },
    xAxis: {
      type: "category",
      data: profitTrend.months,
      axisLabel: { color: theme === 'dark' ? '#ccc' : '#333' }
    },
    yAxis: {
      type: "value",
      axisLabel: { color: theme === 'dark' ? '#ccc' : '#333' }
    },
    series: [
      {
        name: "Profit",
        type: "line",
        data: profitTrend.profits,
        smooth: true,
        areaStyle: {},
        itemStyle: { color: "#22c55e" }
      }
    ],
    darkMode: theme === 'dark'
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Finance Report</h2>
        <p className="text-muted-foreground text-sm">Track income, expenses, profit, and financial trends.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, idx) => (
          <Card key={idx} className="shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profit Trend Chart */}
      <div className="bg-card rounded-xl border dark:border-neutral-700 p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Monthly Profit Trend</h3>
        <ReactECharts option={chartOptions} style={{ height: 300 }} theme={theme === "dark" ? "dark" : "light"} />
      </div>

      <Separator />

      {/* Latest Transactions */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Latest Transactions</h3>
        <div className="rounded-xl border dark:border-neutral-700 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(txn => (
                <TableRow key={txn.id}>
                  <TableCell>{txn.id}</TableCell>
                  <TableCell>{txn.type}</TableCell>
                  <TableCell>{txn.description}</TableCell>
                  <TableCell>{txn.amount}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      txn.status === "Paid" || txn.status === "Completed"
                        ? "bg-green-500/20 text-green-700"
                        : "bg-yellow-500/20 text-yellow-700"
                    }`}>
                      {txn.status}
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
