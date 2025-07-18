"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  ArrowDown,
  DollarSign,
  LineChart,
  PieChart,
  BarChart2,
  Wallet,
  Banknote,
  Percent,
  Download,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays, subMonths,  startOfYear, endOfYear } from 'date-fns';

// Types
type MetricCardProps = {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  className?: string;
};

type TimeRange = '7d' | '30d' | '90d' | '12m' | 'custom';

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

// ECharts hook
const useEChart = (options: echarts.EChartsOption, theme: 'dark' | 'light' = 'dark') => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, theme);
    chart.setOption(options);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
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
      <Card className={cn(
        "bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg",
        className
      )}>
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

// Sample data generation functions
const generateRevenueData = (range: TimeRange, dateRange?: DateRange) => {
  let data: { quarter: string; revenue: number; expenses: number; profit: number }[] = [];
  const now = new Date();

  if (range === '7d') {
    // Daily data for 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      data.push({
        quarter: format(date, 'EEE'),
        revenue: Math.round(50000 + Math.random() * 30000),
        expenses: Math.round(20000 + Math.random() * 15000),
        profit: 0 // Will be calculated
      });
    }
  } else if (range === '30d') {
    // Weekly data for 30 days (4 weeks)
    for (let i = 3; i >= 0; i--) {
      // const weekStart = subDays(now, i * 7);
      data.push({
        quarter: `Week ${4 - i}`,
        revenue: Math.round(150000 + Math.random() * 100000),
        expenses: Math.round(60000 + Math.random() * 40000),
        profit: 0
      });
    }
  } else if (range === '90d') {
    // Monthly data for 90 days (3 months)
    for (let i = 2; i >= 0; i--) {
      const monthStart = subMonths(now, i);
      data.push({
        quarter: format(monthStart, 'MMM'),
        revenue: Math.round(450000 + Math.random() * 150000),
        expenses: Math.round(180000 + Math.random() * 70000),
        profit: 0
      });
    }
  } else if (range === '12m') {
    // Quarterly data for 12 months
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    for (let i = 3; i >= 0; i--) {
      data.push({
        quarter: quarters[i],
        revenue: Math.round(1200000 + Math.random() * 500000),
        expenses: Math.round(500000 + Math.random() * 200000),
        profit: 0
      });
    }
  } else if (range === 'custom' && dateRange?.from && dateRange?.to) {
    // Custom range - generate monthly data
    const diffInMonths = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) / (30 * 24 * 60 * 60 * 1000)
    );
    
    for (let i = diffInMonths - 1; i >= 0; i--) {
      const monthDate = subMonths(dateRange.to, i);
      data.push({
        quarter: format(monthDate, 'MMM yyyy'),
        revenue: Math.round(450000 + Math.random() * 150000),
        expenses: Math.round(180000 + Math.random() * 70000),
        profit: 0
      });
    }
  }

  // Calculate profit
  data = data.map(item => ({
    ...item,
    profit: item.revenue - item.expenses
  }));

  return data;
};

const generateExpenseData = () => {
  return [
    { name: 'Salaries', value: 125000, color: '#3b82f6' },
    { name: 'Operations', value: 85000, color: '#10b981' },
    { name: 'Marketing', value: 60000, color: '#f59e0b' },
    { name: 'Rent', value: 45000, color: '#ef4444' },
    { name: 'Utilities', value: 30000, color: '#8b5cf6' },
  ];
};

const generateHealthData = (range: TimeRange) => {
  const data: { month: string; grossMargin: number; operatingMargin: number; netMargin: number }[] = [];
  const now = new Date();

  if (range === '7d' || range === '30d') {
    // Weekly data
    const weeks = range === '7d' ? 1 : 4;
    for (let i = weeks - 1; i >= 0; i--) {
      data.push({
        month: `Week ${weeks - i}`,
        grossMargin: 50 + Math.random() * 10,
        operatingMargin: 30 + Math.random() * 10,
        netMargin: 20 + Math.random() * 10
      });
    }
  } else {
    // Monthly data
    const months = range === '90d' ? 3 : 12;
    for (let i = months - 1; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      data.push({
        month: format(monthDate, 'MMM'),
        grossMargin: 50 + Math.random() * 10,
        operatingMargin: 30 + Math.random() * 10,
        netMargin: 20 + Math.random() * 10
      });
    }
  }

  return data;
};

const FinanceReportPage = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [isExpanded, setIsExpanded] = useState({
    revenue: true,
    expenses: true,
    health: true
  });

  // Generate data based on selected time range
  const revenueData = generateRevenueData(timeRange, dateRange);
  const expenseData = generateExpenseData();
  const healthData = generateHealthData(timeRange);

  // Calculate metrics
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = revenueData.reduce((sum, item) => sum + item.profit, 0);
  const avgGrossMargin = (healthData.reduce((sum, item) => sum + item.grossMargin, 0) / healthData.length).toFixed(1);

  // Calculate changes (simplified - in a real app you'd compare to previous period)
  const revenueChange = (Math.random() * 15).toFixed(1);
  const profitChange = (Math.random() * 12).toFixed(1);
  const expensesChange = (Math.random() * 5).toFixed(1);
  const marginChange = (Math.random() * 3).toFixed(1);

  // Revenue chart options
  const revenueChartOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      borderWidth: 0,
      padding: [10, 14],
      textStyle: {
        color: '#f3f4f6',
        fontSize: 12,
        // fontFamily: 'Inter, sans-serif'
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
      data: ['Revenue', 'Expenses', 'Profit'],
      textStyle: {
        color: '#9ca3af',
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
      data: revenueData.map(item => item.quarter),
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#9ca3af',
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
          color: 'rgba(31, 41, 55, 0.5)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#9ca3af',
        fontFamily: 'Inter, sans-serif',
        formatter: (value: number) => `$${value >= 1000 ? `${value / 1000}k` : value}`
      }
    },
    series: [
      {
        name: 'Revenue',
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
        data: revenueData.map(item => item.revenue),
        animationDelay: (idx: number) => idx * 120
      },
      {
        name: 'Expenses',
        type: 'bar',
        barWidth: 24,
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#f59e0b' },
            { offset: 1, color: '#d97706' }
          ]),
          shadowColor: 'rgba(245, 158, 11, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(245, 158, 11, 0.5)',
            shadowBlur: 12
          }
        },
        data: revenueData.map(item => item.expenses),
        animationDelay: (idx: number) => idx * 120 + 60
      },
      {
        name: 'Profit',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 10,
        lineStyle: {
          width: 3,
          color: '#10b981',
          shadowColor: 'rgba(16, 185, 129, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#10b981',
          borderColor: '#111827',
          borderWidth: 2
        },
        emphasis: {
          scale: 1.2
        },
        data: revenueData.map(item => item.profit),
        animationDelay: (idx: number) => idx * 120 + 120
      }
    ],
    animationEasing: 'cubicOut',
    animationDuration: 1200,
    animationDelayUpdate: (idx: number) => idx * 10
  };

  // Expense chart options
  const expenseChartOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      borderWidth: 0,
      textStyle: {
        color: '#e5e7eb',
        fontSize: 12
      },
      formatter: '{b}: ${c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 20,
      top: 'center',
      textStyle: {
        color: '#9ca3af',
        fontFamily: 'Inter, sans-serif'
      },
      itemGap: 12,
      itemWidth: 8,
      itemHeight: 8,
      icon: 'circle'
    },
    series: [
      {
        name: 'Expense Breakdown',
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
            color: '#f9fafb',
            formatter: '{b}\n{d}%'
          }
        },
        labelLine: {
          show: false
        },
        data: expenseData.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: { color: item.color }
        })),
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDuration: 1000,
        animationDelay: (idx: number) => idx * 150
      }
    ],
    graphic: {
      type: 'text',
      left: 'center',
      top: '45%',
      style: {
        text: `Total: $${expenseData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}`,
        fill: '#9ca3af',
        fontSize: 14,
      }
    }
  };

  // Health chart options
  const healthChartOption: echarts.EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
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
          color: 'rgba(156, 163, 175, 0.1)'
        }
      }
    },
    legend: {
      data: ['Gross Margin', 'Operating Margin', 'Net Margin'],
      textStyle: {
        color: '#9ca3af',
        fontFamily: 'Inter, sans-serif',
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
      data: healthData.map(item => item.month),
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#9ca3af',
        fontFamily: 'Inter, sans-serif',
        margin: 12
      },
      axisPointer: {
        label: {
          backgroundColor: '#111827',
          color: '#f9fafb'
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
          color: 'rgba(31, 41, 55, 0.5)',
          type: 'dashed'
        }
      },
      axisLabel: {
        color: '#9ca3af',
        fontFamily: 'Inter, sans-serif',
        formatter: (value: number) => `${value}%`
      }
    },
    series: [
      {
        name: 'Gross Margin',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#6366f1',
          shadowColor: 'rgba(99, 102, 241, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#6366f1',
          borderWidth: 2,
          borderColor: '#111827'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0.01)' }
          ])
        },
        data: healthData.map(item => item.grossMargin),
        animationDelay: (idx: number) => idx * 80
      },
      {
        name: 'Operating Margin',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#10b981',
          shadowColor: 'rgba(16, 185, 129, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#10b981',
          borderWidth: 2,
          borderColor: '#111827'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.01)' }
          ])
        },
        data: healthData.map(item => item.operatingMargin),
        animationDelay: (idx: number) => idx * 80 + 40
      },
      {
        name: 'Net Margin',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#f59e0b',
          shadowColor: 'rgba(245, 158, 11, 0.3)',
          shadowBlur: 8,
          shadowOffsetY: 4
        },
        itemStyle: {
          color: '#f59e0b',
          borderWidth: 2,
          borderColor: '#111827'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245, 158, 11, 0.3)' },
            { offset: 1, color: 'rgba(245, 158, 11, 0.01)' }
          ])
        },
        data: healthData.map(item => item.netMargin),
        animationDelay: (idx: number) => idx * 80 + 80
      }
    ],
    animationEasing: 'cubicOut',
    animationDuration: 1200,
    animationDelayUpdate: (idx: number) => idx * 10
  };

  // Initialize chart refs
  const revenueChartRef = useEChart(revenueChartOption);
  const expenseChartRef = useEChart(expenseChartOption);
  const healthChartRef = useEChart(healthChartOption);

  // Handle time range change
  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    
    // Set default date ranges for predefined periods
    const now = new Date();
    switch (value) {
      case '7d':
        setDateRange({ from: subDays(now, 7), to: now });
        break;
      case '30d':
        setDateRange({ from: subDays(now, 30), to: now });
        break;
      case '90d':
        setDateRange({ from: subDays(now, 90), to: now });
        break;
      case '12m':
        setDateRange({ from: startOfYear(now), to: endOfYear(now) });
        break;
      case 'custom':
        // Keep current custom range
        break;
    }
  };

  // Format date range display
  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    
    if (timeRange !== 'custom') {
      return `${timeRange === '7d' ? 'Last 7 Days' : 
              timeRange === '30d' ? 'Last 30 Days' : 
              timeRange === '90d' ? 'Last 90 Days' : 
              'Last 12 Months'}`;
    }
    
    if (!dateRange.to) {
      return format(dateRange.from, 'MMM d, yyyy');
    }
    
    return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
  };

  // Handle export
  // const handleExport = (type: 'pdf' | 'csv') => {
  //   // In a real app, this would generate and download the file
  //   alert(`Exporting ${type.toUpperCase()} report for ${formatDateRange()}`);
  // };

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
            Financial Report
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Comprehensive overview of your company&apos;s financial performance
          </motion.p>
        </div>
        <motion.div
          className="flex flex-col sm:flex-row gap-2 w-full md:w-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px] bg-gray-900 border-gray-800 text-white">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800 text-white">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="12m">Last 12 Months</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {timeRange === 'custom' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[280px] justify-start text-left font-normal bg-gray-900 border-gray-800 hover:bg-gray-800 text-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-900 border-gray-800">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  className="bg-gray-900 text-white"
                />
              </PopoverContent>
            </Popover>
          )}

          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </motion.div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        <MetricCard
          title="Total Revenue"
          value={`$${(totalRevenue / 1000).toFixed(1)}k`}
          change={`+${revenueChange}%`}
          isPositive={true}
          icon={<DollarSign className="h-5 w-5 text-indigo-400" />}
        />
        <MetricCard
          title="Net Profit"
          value={`$${(totalProfit / 1000).toFixed(1)}k`}
          change={`+${profitChange}%`}
          isPositive={true}
          icon={<Wallet className="h-5 w-5 text-emerald-400" />}
        />
        <MetricCard
          title="Total Expenses"
          value={`$${(totalExpenses / 1000).toFixed(1)}k`}
          change={`+${expensesChange}%`}
          isPositive={false}
          icon={<Banknote className="h-5 w-5 text-amber-400" />}
        />
        <MetricCard
          title="Avg Gross Margin"
          value={`${avgGrossMargin}%`}
          change={`+${marginChange}%`}
          isPositive={true}
          icon={<Percent className="h-5 w-5 text-cyan-400" />}
        />
      </motion.div>

      {/* Revenue & Profit Chart */}
      <motion.div variants={cardVariants}>
        <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => setIsExpanded(prev => ({ ...prev, revenue: !prev.revenue }))}>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <LineChart className="h-5 w-5 text-indigo-400" />
              </motion.div>
              <CardTitle className="text-white">
                Revenue & Profit Trend
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
                <ArrowUp className="h-3 w-3 mr-1" />
                {profitChange}% profit growth
              </Badge>
              {isExpanded.revenue ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </CardHeader>
          {isExpanded.revenue && (
            <CardContent>
              <div ref={revenueChartRef} className="h-80 w-full" />
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Expense Breakdown & Financial Health */}
      <motion.div
        className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
        variants={containerVariants}
      >
        {/* Expense Breakdown */}
        <motion.div variants={cardVariants}>
          <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => setIsExpanded(prev => ({ ...prev, expenses: !prev.expenses }))}>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <PieChart className="h-5 w-5 text-rose-400" />
                </motion.div>
                <CardTitle className="text-white">
                  Expense Breakdown
                </CardTitle>
              </div>
              {isExpanded.expenses ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </CardHeader>
            {isExpanded.expenses && (
              <CardContent>
                <div ref={expenseChartRef} className="h-80 w-full" />
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Financial Health */}
        <motion.div variants={cardVariants}>
          <Card className="bg-gray-900 border-gray-800 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => setIsExpanded(prev => ({ ...prev, health: !prev.health }))}>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ x: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <BarChart2 className="h-5 w-5 text-cyan-400" />
                </motion.div>
                <CardTitle className="text-white">
                  Financial Health Metrics
                </CardTitle>
              </div>
              {isExpanded.health ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </CardHeader>
            {isExpanded.health && (
              <>
                <CardContent>
                  <div ref={healthChartRef} className="h-80 w-full" />
                </CardContent>
                <CardFooter className="text-xs text-gray-400">
                  Gross margin = Revenue - COGS | Operating margin = Operating income / Revenue | Net margin = Net income / Revenue
                </CardFooter>
              </>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default FinanceReportPage;