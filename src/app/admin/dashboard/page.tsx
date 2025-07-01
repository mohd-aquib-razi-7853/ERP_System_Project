"use client"
// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUp, 
  Crown, 
  CheckCircle, 
  Clock, 
  Star, 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart,
  BarChart2,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure you have this utility

// Types
type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  className?: string;
};

type OrderStatus = 'completed' | 'processing' | 'shipped' | 'pending';

type Order = {
  id: string;
  customer: string;
  amount: string;
  status: OrderStatus;
  date: string;
};

type Product = {
  id: number;
  name: string;
  category: string;
  sales: number;
  rating: number;
};

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
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Updated useEChart hook with proper type handling
const useEChart = (options: echarts.EChartsOption, theme: 'dark' | 'light' = 'dark') => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, theme);
    
    // Type-safe initial empty state for animation
    const initialOptions = {
      ...options,
      series: Array.isArray(options.series)
        ? options.series.map(series => ({
            ...series,
            data: Array.isArray(series.data) 
              ? series.data.map(() => 0) 
              : 0
          }))
        : options.series
          ? {
              ...options.series,
              data: Array.isArray(options.series.data) 
                ? options.series.data.map(() => 0) 
                : 0
            }
          : []
    };

    chart.setOption(initialOptions);

    // Animate in after a delay
    const timer = setTimeout(() => {
      chart.setOption(options);
    }, 500);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [options, theme]);

  return chartRef;
};

// Animated Metric Card Component
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
      <Card className={cn("bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors", className)}>
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
            className={`text-xs ${isPositive ? 'text-emerald-400' : 'text-rose-400'} flex items-center`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {change}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RecentOrders: React.FC<{ className?: string }> = ({ className }) => {
  const orders: Order[] = [
    { id: '#ORD-281', customer: 'Alex Johnson', amount: '$142.00', status: 'completed', date: '2023-07-12' },
    { id: '#ORD-282', customer: 'Maria Garcia', amount: '$89.50', status: 'processing', date: '2023-07-12' },
    { id: '#ORD-283', customer: 'James Wilson', amount: '$215.75', status: 'shipped', date: '2023-07-11' },
    { id: '#ORD-284', customer: 'Sarah Lee', amount: '$56.20', status: 'completed', date: '2023-07-11' },
    { id: '#ORD-285', customer: 'Robert Brown', amount: '$178.90', status: 'pending', date: '2023-07-10' },
  ];

  const statusVariant: Record<OrderStatus, string> = {
    completed: 'bg-emerald-900/30 text-emerald-400 border-emerald-800',
    processing: 'bg-blue-900/30 text-blue-400 border-blue-800',
    shipped: 'bg-amber-900/30 text-amber-400 border-amber-800',
    pending: 'bg-rose-900/30 text-rose-400 border-rose-800'
  };

  return (
    <motion.div variants={cardVariants}>
      <Card className={cn("bg-gray-800/50 border-gray-700", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <ShoppingCart className="h-5 w-5 text-indigo-400" />
            </motion.div>
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div className="space-y-3">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <p className="font-medium text-gray-100">{order.id}</p>
                  <p className="text-sm text-gray-400">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-100">{order.amount}</p>
                  <Badge className={`text-xs ${statusVariant[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const TopProducts: React.FC<{ className?: string }> = ({ className }) => {
  const products: Product[] = [
    { id: 1, name: 'Wireless Headphones', category: 'Electronics', sales: 142, rating: 4.8 },
    { id: 2, name: 'Organic Cotton T-shirt', category: 'Fashion', sales: 98, rating: 4.6 },
    { id: 3, name: 'Smart Watch', category: 'Electronics', sales: 87, rating: 4.7 },
    { id: 4, name: 'Ceramic Coffee Mug', category: 'Home', sales: 76, rating: 4.9 },
    { id: 5, name: 'Yoga Mat', category: 'Fitness', sales: 65, rating: 4.5 },
  ];

  return (
    <motion.div variants={cardVariants}>
      <Card className={cn("bg-gray-800/50 border-gray-700", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Crown className="h-5 w-5 text-amber-400" />
            </motion.div>
            Top Selling Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div className="space-y-3">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                className="flex items-center gap-4 p-3 hover:bg-gray-700/50 rounded-lg transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className="flex items-center justify-center bg-gray-700 rounded-lg h-10 w-10"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="font-medium text-gray-200">{index + 1}</span>
                </motion.div>
                <div className="flex-1">
                  <p className="font-medium text-gray-100">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-100">{product.sales} sold</p>
                  <div className="flex items-center justify-end gap-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    </motion.div>
                    <span className="text-xs text-gray-400">{product.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  // Sales Trend Chart Options
  const salesTrendOptions: echarts.EChartsOption = {
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
      valueFormatter: (value: number) => `$${value.toLocaleString()}`
    },
    legend: {
      data: ['Online', 'Offline', 'Wholesale'],
      textStyle: {
        color: '#94a3b8',
        fontFamily: 'Inter, sans-serif',
        // fontWeight: '500'
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
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#94a3b8',
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
          color: 'rgba(30, 41, 59, 0.5)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#94a3b8',
        fontFamily: 'Inter, sans-serif',
        formatter: (value: number) => `$${value / 1000}k`
      }
    },
    series: [
      {
        name: 'Online',
        type: 'bar',
        barWidth: 24,
        barGap: '10%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#6366f1' },
            { offset: 1, color: '#4338ca' }
          ]),
          shadowColor: 'rgba(99, 102, 241, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(99, 102, 241, 0.5)',
            shadowBlur: 12
          }
        },
        data: [12000, 18000, 15000, 13000, 19000, 21000],
        animationDelay: (idx: number) => idx * 120
      },
      {
        name: 'Offline',
        type: 'bar',
        barWidth: 24,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#10b981' },
            { offset: 1, color: '#047857' }
          ]),
          shadowColor: 'rgba(16, 185, 129, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(16, 185, 129, 0.5)',
            shadowBlur: 12
          }
        },
        data: [8000, 9000, 10000, 6000, 11000, 7000],
        animationDelay: (idx: number) => idx * 120 + 60
      },
      {
        name: 'Wholesale',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 3,
          color: '#f59e0b',
          shadowColor: 'rgba(245, 158, 11, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#f59e0b',
          borderColor: '#1e293b',
          borderWidth: 2
        },
        emphasis: {
          scale: 1.2
        },
        data: [5000, 7000, 12000, 8000, 15000, 18000],
        animationDelay: (idx: number) => idx * 120 + 120
      }
    ],
    animationEasing: 'cubicOut',
    animationDuration: 1200,
    animationDelayUpdate: (idx: number) => idx * 10
  };

  // Revenue Pie Chart Options
  const revenuePieOptions: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      borderWidth: 0,
      textStyle: {
        color: '#e2e8f0',
        fontSize: 12
      },
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 'center',
      textStyle: {
        color: '#94a3b8',
        fontFamily: 'Inter, sans-serif'
      },
      itemGap: 12,
      itemWidth: 8,
      itemHeight: 8,
      icon: 'circle'
    },
    series: [
      {
        name: 'Revenue Distribution',
        type: 'pie',
        radius: ['50%', '80%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderWidth: 0,
          borderRadius: 4,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 6,
          shadowOffsetY: 3
        },
        label: {
          show: false
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
          itemStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10
          },
          label: {
            show: true,
            fontSize: 14,
            // fontWeight: '500',
            color: '#f8fafc',
            formatter: '{b}\n{d}%'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { 
            value: 35, 
            name: 'Electronics', 
            itemStyle: { 
              color: '#818cf8'
            } 
          },
          { 
            value: 25, 
            name: 'Fashion', 
            itemStyle: { 
              color: '#34d399'
            } 
          },
          { 
            value: 20, 
            name: 'Home Goods', 
            itemStyle: { 
              color: '#fbbf24'
            } 
          },
          { 
            value: 15, 
            name: 'Beauty', 
            itemStyle: { 
              color: '#f87171'
            } 
          },
          { 
            value: 5, 
            name: 'Other', 
            itemStyle: { 
              color: '#60a5fa'
            } 
          }
        ],
        animationType: 'scale',
        animationEasing: 'cubicOut',
        animationDuration: 1000,
        animationDelay: (idx: number) => idx * 150
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: '45%',
      style: {
        text: 'Revenue',
        fill: '#94a3b8',
        fontSize: 14,
        fontWeight: 'normal'
      }
    }
  };

  // Performance Line Chart Options
  const performanceOptions: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderWidth: 0,
      padding: [8, 12],
      textStyle: {
        color: '#f1f5f9',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif'
      },
      axisPointer: {
        type: 'shadow',
        shadowStyle: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      }
    },
    legend: {
      data: ['Conversion Rate', 'Avg. Order Value'],
      textStyle: {
        color: '#94a3b8',
        fontFamily: 'Inter, sans-serif',
        // fontWeight: "500",
      },
      right: 20,
      top: 10,
      itemGap: 16,
      itemWidth: 12,
      itemHeight: 4,
      icon: 'rect'
    },
    grid: {
      left: '2%',
      right: '3%',
      bottom: '3%',
      top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#94a3b8',
        fontFamily: 'Inter, sans-serif',
        margin: 12
      },
      axisPointer: {
        label: {
          backgroundColor: '#1e293b',
          color: '#f8fafc'
        }
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
          color: 'rgba(30, 41, 59, 0.5)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#94a3b8',
        fontFamily: 'Inter, sans-serif',
        formatter: (value: number) => `${value}%`
      }
    },
    series: [
      {
        name: 'Conversion Rate',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#818cf8',
          shadowColor: 'rgba(129, 140, 248, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#818cf8',
          borderWidth: 2,
          borderColor: '#1e293b'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(129, 140, 248, 0.3)' },
            { offset: 1, color: 'rgba(129, 140, 248, 0.01)' }
          ])
        },
        data: [3.2, 2.8, 3.5, 4.1, 3.9, 4.5, 4.2],
        animationDelay: (idx: number) => idx * 120
      },
      {
        name: 'Avg. Order Value',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#34d399',
          shadowColor: 'rgba(52, 211, 153, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#34d399',
          borderWidth: 2,
          borderColor: '#1e293b'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(52, 211, 153, 0.3)' },
            { offset: 1, color: 'rgba(52, 211, 153, 0.01)' }
          ])
        },
        data: [85, 78, 92, 89, 95, 102, 98],
        animationDelay: (idx: number) => idx * 120 + 100
      }
    ],
    animationEasing: 'cubicOut',
    animationDuration: 1200,
    animationDelayUpdate: (idx: number) => idx * 10
  };

  // Initialize chart refs
  const salesTrendRef = useEChart(salesTrendOptions);
  const revenuePieRef = useEChart(revenuePieOptions);
  const performanceRef = useEChart(performanceOptions);

  return (
    <motion.div 
      className="max-h-screen h-full overflow-scroll overflow-x-hidden bg-[#111827] text-gray-100 p-4 md:p-6 space-y-6 no-scrollbar"
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
            Dashboard Overview
          </motion.h1>
          <motion.p 
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Welcome back! Here's what's happening with your store today.
          </motion.p>
        </div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button variant="outline" className="border-gray-700 bg-gray-900 hover:bg-gray-800/50 text-white hover:text-white">
            Last 7 Days
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Last 30 Days
          </Button>
        </motion.div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <MetricCard 
          title="Total Revenue" 
          value="$24,780" 
          change="+12.5%" 
          isPositive={true} 
          icon={<TrendingUp className="h-5 w-5 text-indigo-400" />}
          className="bg-gray-800/50 border-gray-700"
        />
        <MetricCard 
          title="Total Orders" 
          value="1,842" 
          change="+8.2%" 
          isPositive={true} 
          icon={<ShoppingCart className="h-5 w-5 text-emerald-400" />}
          className="bg-gray-800/50 border-gray-700"
        />
        <MetricCard 
          title="Products Sold" 
          value="5,312" 
          change="+3.1%" 
          isPositive={true} 
          icon={<Package className="h-5 w-5 text-amber-400" />}
          className="bg-gray-800/50 border-gray-700"
        />
        <MetricCard 
          title="New Customers" 
          value="243" 
          change="+5.7%" 
          isPositive={true} 
          icon={<Users className="h-5 w-5 text-cyan-400" />}
          className="bg-gray-800/50 border-gray-700"
        />
      </motion.div>

      {/* Main Charts */}
      <motion.div 
        className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
        variants={containerVariants}
      >
        {/* Sales Trend Chart */}
        <motion.div variants={cardVariants}>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <BarChart2 className="h-5 w-5 text-indigo-400" />
                  </motion.div>
                  Sales Trend
                </CardTitle>
                <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  12.5% from last month
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div ref={salesTrendRef} className="h-80 w-full" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Distribution */}
        <motion.div variants={cardVariants}>
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <PieChartIcon className="h-5 w-5 text-rose-400" />
                </motion.div>
                Revenue by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={revenuePieRef} className="h-80 w-full" />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div variants={cardVariants}>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <motion.div
                animate={{ x: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <LineChartIcon className="h-5 w-5 text-cyan-400" />
              </motion.div>
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={performanceRef} className="h-80 w-full" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Orders & Top Products */}
      <motion.div 
        className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
        variants={containerVariants}
      >
        <RecentOrders className="bg-gray-800/50 border-gray-700 max-h-ful h-full overflow-scroll no-scrollbar" />
        <TopProducts className="bg-gray-800/50 border-gray-700 max-h-ful h-full overflow-scroll no-scrollbar" />
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
