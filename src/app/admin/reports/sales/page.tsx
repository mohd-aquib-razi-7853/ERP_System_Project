'use client'
import * as echarts from "echarts"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Download, LineChart, PieChart, BarChart2, ShoppingCart, TrendingUp, Users, DollarSign, Calendar as CalendarIcon, ArrowUp, ArrowDown } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, subDays } from "date-fns"

// Dynamic import with no SSR
const ReactECharts = dynamic(
  () => import('echarts-for-react').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full flex items-center justify-center">Loading chart...</div>
  }
)

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
}

type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  className?: string;
};

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive,
  icon,
  className
}) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className={`bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <motion.span
            className="text-sm font-medium text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.span>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            {icon}
          </motion.div>
        </CardHeader>
        <CardContent>
          <motion.div
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {value}
          </motion.div>
          <motion.p
            className={`text-xs flex items-center mt-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {change}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const summaryData = [
  { label: "Total Sales", value: "₹1,20,000", change: "+12%", isPositive: true, icon: <TrendingUp className="h-5 w-5 text-violet-400" /> },
  { label: "Total Orders", value: "310", change: "+8%", isPositive: true, icon: <ShoppingCart className="h-5 w-5 text-emerald-400" /> },
  { label: "Total Revenue", value: "₹1,85,000", change: "+18%", isPositive: true, icon: <DollarSign className="h-5 w-5 text-amber-400" /> },
  { label: "New Customers", value: "72", change: "+5%", isPositive: true, icon: <Users className="h-5 w-5 text-cyan-400" /> },
]

const categoryData = [
  { category: "Electronics", orders: 120, sales: "₹70,000", change: "+22%", isPositive: true },
  { category: "Apparel", orders: 85, sales: "₹40,000", change: "+7%", isPositive: true },
  { category: "Office Supplies", orders: 65, sales: "₹30,000", change: "+3%", isPositive: true },
]

const dailySalesData = [
  { day: 'Mon', sales: 10000, target: 8000 },
  { day: 'Tue', sales: 12000, target: 9000 },
  { day: 'Wed', sales: 15000, target: 10000 },
  { day: 'Thu', sales: 13000, target: 11000 },
  { day: 'Fri', sales: 17000, target: 12000 },
  { day: 'Sat', sales: 19000, target: 13000 },
  { day: 'Sun', sales: 21000, target: 14000 },
]

export default function SalesReportPage() {
  const { theme, resolvedTheme } = useTheme()
  const [timeRange, setTimeRange] = useState('7d')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [isExpanded, setIsExpanded] = useState({
    trend: true,
    categories: true,
    distribution: true
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Helper function to get chart options with current theme
  const getChartOptions = (type: 'trend' | 'pie' | 'radar') => {
    const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light'
    const textColor = currentTheme === 'dark' ? '#94a3b8' : '#64748b'
    const gridLineColor = currentTheme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.7)'
    
    if (type === 'trend') {
      return {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderWidth: 0,
          padding: [10, 14],
          textStyle: {
            color: '#f8fafc',
            fontSize: 12,
            fontFamily: 'Inter, sans-serif'
          },
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(148, 163, 184, 0.15)'
            }
          },
          formatter: function(params: any) {
            let result = `<div style="font-weight: 500; margin-bottom: 4px">${params[0].axisValue}</div>`;
            params.forEach((param: any) => {
              const color = param.color;
              const marker = `<span style="display:inline-block;margin-right:4px;border-radius:50%;width:10px;height:10px;background-color:${color};"></span>`;
              result += `<div style="margin: 3px 0">${marker} ${param.seriesName}: ₹${param.value.toLocaleString()}</div>`;
            });
            return result;
          }
        },
        legend: {
          data: ['Sales', 'Target'],
          textStyle: {
            color: textColor,
            fontFamily: 'Inter, sans-serif',
          },
          right: 24,
          top: 12,
          itemGap: 20,
          itemWidth: 12,
          itemHeight: 4,
          icon: 'rect'
        },
        grid: {
          left: '2%',
          right: '3%',
          bottom: '3%',
          top: '20%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dailySalesData.map(item => item.day),
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: textColor,
            fontFamily: 'Inter, sans-serif',
            margin: 12
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: gridLineColor,
              type: 'dashed'
            }
          },
          axisLabel: {
            color: textColor,
            fontFamily: 'Inter, sans-serif',
            formatter: (value: number) => `₹${value / 1000}k`
          }
        },
        series: [
          {
            name: 'Sales',
            type: 'bar',
            barWidth: 20,
            data: dailySalesData.map(item => item.sales),
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#a78bfa' },
                  { offset: 1, color: '#7c3aed' }
                ])
              }
            },
            animationDelay: (idx: number) => idx * 120
          },
          {
            name: 'Target',
            type: 'line',
            data: dailySalesData.map(item => item.target),
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: '#f59e0b',
              shadowColor: 'rgba(245, 158, 11, 0.3)',
              shadowBlur: 8
            },
            itemStyle: {
              color: '#f59e0b',
              borderColor: currentTheme === 'dark' ? '#1e293b' : '#f8fafc',
              borderWidth: 2
            },
            emphasis: {
              scale: 1.2
            },
            animationDelay: (idx: number) => idx * 120 + 60
          }
        ],
        animationEasing: 'cubicOut',
        animationDuration: 1200,
        animationDelayUpdate: (idx: number) => idx * 10
      }
    }

    if (type === 'pie') {
      return {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderWidth: 0,
          padding: [10, 14],
          textStyle: {
            color: '#f8fafc',
            fontSize: 12,
            fontFamily: 'Inter, sans-serif'
          },
          formatter: '{b}: ₹{c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 20,
          top: 'center',
          textStyle: {
            color: textColor,
            fontFamily: 'Inter, sans-serif'
          },
          itemGap: 12,
          itemWidth: 8,
          itemHeight: 8,
          icon: 'circle'
        },
        series: [
          {
            name: 'Sales by Category',
            type: 'pie',
            radius: ['45%', '75%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 6,
              borderColor: currentTheme === 'dark' ? '#1e293b' : '#f8fafc',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.2)'
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: 'bold',
                color: currentTheme === 'dark' ? '#f8fafc' : '#020617',
              },
              itemStyle: {
                shadowBlur: 15,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
              }
            },
            labelLine: {
              show: false
            },
            data: categoryData.map((item, index) => ({
              value: parseInt(item.sales.replace(/[^0-9]/g, '')),
              name: item.category,
              itemStyle: { 
                color: [
                  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#c084fc' },
                    { offset: 1, color: '#8b5cf6' }
                  ]),
                  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#34d399' },
                    { offset: 1, color: '#10b981' }
                  ]),
                  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#fbbf24' },
                    { offset: 1, color: '#f59e0b' }
                  ])
                ][index % 3]
              }
            }))
          }
        ],
        animationEasing: 'cubicOut',
        animationDuration: 1200
      }
    }

    if (type === 'radar') {
      return {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          borderWidth: 0,
          padding: [10, 14],
          textStyle: {
            color: '#f8fafc',
            fontSize: 12,
            fontFamily: 'Inter, sans-serif'
          }
        },
        radar: {
          indicator: [
            { name: 'Online', max: 100 },
            { name: 'Retail', max: 100 },
            { name: 'Wholesale', max: 100 },
            { name: 'Direct', max: 100 },
            { name: 'Partners', max: 100 }
          ],
          radius: '65%',
          splitNumber: 4,
          axisName: {
            color: textColor,
            fontFamily: 'Inter, sans-serif',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: currentTheme === 'dark' ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.8)'
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: currentTheme === 'dark' 
                ? ['rgba(30, 41, 59, 0.2)', 'rgba(30, 41, 59, 0.4)', 'rgba(30, 41, 59, 0.6)', 'rgba(30, 41, 59, 0.8)'] 
                : ['rgba(248, 250, 252, 0.5)', 'rgba(241, 245, 249, 0.5)', 'rgba(226, 232, 240, 0.5)', 'rgba(203, 213, 225, 0.5)']
            }
          },
          axisLine: {
            lineStyle: {
              color: currentTheme === 'dark' ? 'rgba(51, 65, 85, 0.6)' : 'rgba(203, 213, 225, 0.8)'
            }
          }
        },
        series: [
          {
            name: 'Sales Distribution',
            type: 'radar',
            data: [
              {
                value: [80, 65, 45, 30, 60],
                name: 'Current Period',
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                  width: 3,
                  color: '#8b5cf6',
                  shadowColor: 'rgba(139, 92, 246, 0.3)',
                  shadowBlur: 8
                },
                itemStyle: {
                  color: '#8b5cf6'
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(139, 92, 246, 0.5)' },
                    { offset: 1, color: 'rgba(139, 92, 246, 0.1)' }
                  ])
                }
              },
              {
                value: [70, 55, 40, 25, 50],
                name: 'Previous Period',
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                  width: 2,
                  type: 'dashed',
                  color: '#94a3b8',
                },
                itemStyle: {
                  color: '#94a3b8'
                },
                areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(148, 163, 184, 0.3)' },
                    { offset: 1, color: 'rgba(148, 163, 184, 0.1)' }
                  ])
                }
              }
            ]
          }
        ],
        animationEasing: 'cubicOut',
        animationDuration: 1200
      }
    }

    return {}
  }

  const formatDateRange = () => {
    if (!dateRange?.from) return "";
    if (!dateRange.to) {
      return format(dateRange.from, "PPP");
    }
    return `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`;
  };

  if (!isMounted) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen overflow-y-auto">
      {/* Header with Glassmorphism */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-xl bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-500">Sales Dashboard</h2>
          <p className="text-muted-foreground">Track and analyze your sales performance</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  formatDateRange()
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 border-0 shadow-lg shadow-violet-900/20">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {summaryData.map((item, idx) => (
          <MetricCard
            key={idx}
            title={item.label}
            value={item.value}
            change={item.change}
            isPositive={item.isPositive}
            icon={item.icon}
            className={[
              "from-violet-900/40 to-indigo-900/40",
              "from-emerald-900/40 to-green-900/40",
              "from-amber-900/40 to-yellow-900/40",
              "from-cyan-900/40 to-blue-900/40"
            ][idx % 4]}
          />
        ))}
      </motion.div>

      {/* Sales Trend Chart */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.4 }}
      >
        <Card className="hover:shadow-xl transition-all bg-gray-900/50 border-gray-800 backdrop-blur-sm text-white overflow-hidden">
          <CardHeader 
            className="flex flex-row items-center justify-between cursor-pointer" 
            onClick={() => setIsExpanded(prev => ({ ...prev, trend: !prev.trend }))}
          >
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-violet-500" />
              <CardTitle>Sales Performance</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-violet-300 border-violet-500/30">
                +12% from last period
              </Badge>
              {isExpanded.trend ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {isExpanded.trend && (
            <CardContent className="p-0 pt-4">
              <div className="h-[450px] w-full">
                <ReactECharts 
                  option={getChartOptions('trend')} 
                  style={{ height: '100%', width: '100%' }} 
                  theme={resolvedTheme === "dark" ? "dark" : "light"} 
                />
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Sales Breakdown */}
      <motion.div
        className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.5, staggerChildren: 0.2 }}
      >
        {/* Pie Chart */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-xl transition-all bg-gray-900/50 border-gray-800 backdrop-blur-sm text-white overflow-hidden">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer" 
              onClick={() => setIsExpanded(prev => ({ ...prev, categories: !prev.categories }))}
            >
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-emerald-500" />
                <CardTitle>Sales by Category</CardTitle>
              </div>
              {isExpanded.categories ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardHeader>
            {isExpanded.categories && (
              <CardContent className="p-0 pt-4">
                <div className="h-[400px] w-full">
                  <ReactECharts 
                    option={getChartOptions('pie')} 
                    style={{ height: '100%', width: '100%' }} 
                    theme={resolvedTheme === "dark" ? "dark" : "light"} 
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Radar Chart */}
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-xl transition-all bg-gray-900/50 border-gray-800 backdrop-blur-sm text-white overflow-hidden">
            <CardHeader 
              className="flex flex-row items-center justify-between cursor-pointer" 
              onClick={() => setIsExpanded(prev => ({ ...prev, distribution: !prev.distribution }))}
            >
              <div className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-violet-500" />
                <CardTitle>Sales Distribution</CardTitle>
              </div>
              {isExpanded.distribution ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CardHeader>
            {isExpanded.distribution && (
              <CardContent className="p-0 pt-4">
                <div className="h-[400px] w-full">
                  <ReactECharts 
                    option={getChartOptions('radar')} 
                    style={{ height: '100%', width: '100%' }} 
                    theme={resolvedTheme === "dark" ? "dark" : "light"} 
                  />
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Sales Table */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="hover:shadow-xl transition-all bg-gray-900/50 border-gray-800 backdrop-blur-sm text-white overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-amber-500" />
                <CardTitle>Detailed Sales Data</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-900/70 hover:bg-gray-900/90">
                      <TableHead className="text-gray-300 font-medium">Category</TableHead>
                      <TableHead className="text-gray-300 font-medium">Orders</TableHead>
                      <TableHead className="text-gray-300 font-medium">Sales</TableHead>
                      <TableHead className="text-right text-gray-300 font-medium">Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryData.map((cat, idx) => (
                      <TableRow key={idx} className="border-gray-800 hover:bg-gray-800/50">
                        <TableCell className="font-medium">{cat.category}</TableCell>
                        <TableCell>{cat.orders}</TableCell>
                        <TableCell>{cat.sales}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/30">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            {cat.change}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground border-t border-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Data updated 2 hours ago
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}