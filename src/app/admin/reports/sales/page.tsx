"use client";
import * as echarts from "echarts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Download,
  LineChart,
  PieChart,
  BarChart2,
  ShoppingCart,
  TrendingUp,
  Users,
  DollarSign,
  Calendar as CalendarIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subDays, subMonths } from "date-fns";
import { toast } from "sonner";

// Dynamic import with no SSR
const ReactECharts = dynamic(
  () => import("echarts-for-react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full flex items-center justify-center">
        Loading chart...
      </div>
    ),
  }
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

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
  className,
}) => {
  return (
    <motion.div variants={itemVariants}>
      <Card
        className={`bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg ${className}`}
      >
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
            transition={{ type: "spring", stiffness: 200 }}
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
            className={`text-xs flex items-center mt-1 ${
              isPositive ? "text-emerald-400" : "text-rose-400"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isPositive ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            {change}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Define data for different time periods
const timeRangeData = {
  "7d": {
    summaryData: [
      {
        label: "Total Sales",
        value: "₹1,20,000",
        change: "+12%",
        isPositive: true,
        icon: <TrendingUp className="h-5 w-5 text-violet-400" />,
      },
      {
        label: "Total Orders",
        value: "310",
        change: "+8%",
        isPositive: true,
        icon: <ShoppingCart className="h-5 w-5 text-emerald-400" />,
      },
      {
        label: "Total Revenue",
        value: "₹1,85,000",
        change: "+18%",
        isPositive: true,
        icon: <DollarSign className="h-5 w-5 text-amber-400" />,
      },
      {
        label: "New Customers",
        value: "72",
        change: "+5%",
        isPositive: true,
        icon: <Users className="h-5 w-5 text-cyan-400" />,
      },
    ],
    dailySalesData: [
      { day: "Mon", sales: 10000, target: 8000 },
      { day: "Tue", sales: 12000, target: 9000 },
      { day: "Wed", sales: 15000, target: 10000 },
      { day: "Thu", sales: 13000, target: 11000 },
      { day: "Fri", sales: 17000, target: 12000 },
      { day: "Sat", sales: 19000, target: 13000 },
      { day: "Sun", sales: 21000, target: 14000 },
    ],
    categoryData: [
      {
        category: "Electronics",
        orders: 120,
        sales: "₹70,000",
        change: "+22%",
        isPositive: true,
      },
      {
        category: "Apparel",
        orders: 85,
        sales: "₹40,000",
        change: "+7%",
        isPositive: true,
      },
      {
        category: "Office Supplies",
        orders: 65,
        sales: "₹30,000",
        change: "+3%",
        isPositive: true,
      },
    ],
    distributionData: [
      {
        value: [80, 65, 45, 30, 60],
        name: "Current Period",
      },
      {
        value: [70, 55, 40, 25, 50],
        name: "Previous Period",
      },
    ],
  },
  "30d": {
    summaryData: [
      {
        label: "Total Sales",
        value: "₹4,85,000",
        change: "+15%",
        isPositive: true,
        icon: <TrendingUp className="h-5 w-5 text-violet-400" />,
      },
      {
        label: "Total Orders",
        value: "1,250",
        change: "+10%",
        isPositive: true,
        icon: <ShoppingCart className="h-5 w-5 text-emerald-400" />,
      },
      {
        label: "Total Revenue",
        value: "₹7,20,000",
        change: "+20%",
        isPositive: true,
        icon: <DollarSign className="h-5 w-5 text-amber-400" />,
      },
      {
        label: "New Customers",
        value: "215",
        change: "+8%",
        isPositive: true,
        icon: <Users className="h-5 w-5 text-cyan-400" />,
      },
    ],
    dailySalesData: [
      { day: "Week 1", sales: 95000, target: 85000 },
      { day: "Week 2", sales: 110000, target: 90000 },
      { day: "Week 3", sales: 130000, target: 100000 },
      { day: "Week 4", sales: 150000, target: 110000 },
    ],
    categoryData: [
      {
        category: "Electronics",
        orders: 480,
        sales: "₹2,80,000",
        change: "+25%",
        isPositive: true,
      },
      {
        category: "Apparel",
        orders: 350,
        sales: "₹1,20,000",
        change: "+12%",
        isPositive: true,
      },
      {
        category: "Office Supplies",
        orders: 280,
        sales: "₹85,000",
        change: "+5%",
        isPositive: true,
      },
      {
        category: "Home & Kitchen",
        orders: 140,
        sales: "₹60,000",
        change: "+18%",
        isPositive: true,
      },
    ],
    distributionData: [
      {
        value: [85, 70, 50, 40, 65],
        name: "Current Period",
      },
      {
        value: [75, 60, 45, 35, 55],
        name: "Previous Period",
      },
    ],
  },
  "90d": {
    summaryData: [
      {
        label: "Total Sales",
        value: "₹12,50,000",
        change: "+22%",
        isPositive: true,
        icon: <TrendingUp className="h-5 w-5 text-violet-400" />,
      },
      {
        label: "Total Orders",
        value: "3,850",
        change: "+15%",
        isPositive: true,
        icon: <ShoppingCart className="h-5 w-5 text-emerald-400" />,
      },
      {
        label: "Total Revenue",
        value: "₹18,75,000",
        change: "+25%",
        isPositive: true,
        icon: <DollarSign className="h-5 w-5 text-amber-400" />,
      },
      {
        label: "New Customers",
        value: "620",
        change: "+12%",
        isPositive: true,
        icon: <Users className="h-5 w-5 text-cyan-400" />,
      },
    ],
    dailySalesData: [
      { day: "Month 1", sales: 380000, target: 350000 },
      { day: "Month 2", sales: 420000, target: 380000 },
      { day: "Month 3", sales: 450000, target: 400000 },
    ],
    categoryData: [
      {
        category: "Electronics",
        orders: 1450,
        sales: "₹6,80,000",
        change: "+28%",
        isPositive: true,
      },
      {
        category: "Apparel",
        orders: 1050,
        sales: "₹2,90,000",
        change: "+15%",
        isPositive: true,
      },
      {
        category: "Office Supplies",
        orders: 850,
        sales: "₹1,80,000",
        change: "+10%",
        isPositive: true,
      },
      {
        category: "Home & Kitchen",
        orders: 500,
        sales: "₹1,00,000",
        change: "+20%",
        isPositive: true,
      },
    ],
    distributionData: [
      {
        value: [90, 75, 60, 50, 70],
        name: "Current Period",
      },
      {
        value: [80, 65, 50, 40, 60],
        name: "Previous Period",
      },
    ],
  },
  "12m": {
    summaryData: [
      {
        label: "Total Sales",
        value: "₹48,50,000",
        change: "+30%",
        isPositive: true,
        icon: <TrendingUp className="h-5 w-5 text-violet-400" />,
      },
      {
        label: "Total Orders",
        value: "15,200",
        change: "+18%",
        isPositive: true,
        icon: <ShoppingCart className="h-5 w-5 text-emerald-400" />,
      },
      {
        label: "Total Revenue",
        value: "₹72,00,000",
        change: "+32%",
        isPositive: true,
        icon: <DollarSign className="h-5 w-5 text-amber-400" />,
      },
      {
        label: "New Customers",
        value: "2,450",
        change: "+15%",
        isPositive: true,
        icon: <Users className="h-5 w-5 text-cyan-400" />,
      },
    ],
    dailySalesData: [
      { day: "Jan", sales: 1100000, target: 1000000 },
      { day: "Feb", sales: 1150000, target: 1050000 },
      { day: "Mar", sales: 1200000, target: 1100000 },
      { day: "Apr", sales: 1250000, target: 1150000 },
      { day: "May", sales: 1300000, target: 1200000 },
      { day: "Jun", sales: 1350000, target: 1250000 },
      { day: "Jul", sales: 1400000, target: 1300000 },
      { day: "Aug", sales: 1450000, target: 1350000 },
      { day: "Sep", sales: 1500000, target: 1400000 },
      { day: "Oct", sales: 1550000, target: 1450000 },
      { day: "Nov", sales: 1600000, target: 1500000 },
      { day: "Dec", sales: 1650000, target: 1550000 },
    ],
    categoryData: [
      {
        category: "Electronics",
        orders: 5800,
        sales: "₹25,50,000",
        change: "+35%",
        isPositive: true,
      },
      {
        category: "Apparel",
        orders: 4200,
        sales: "₹12,00,000",
        change: "+20%",
        isPositive: true,
      },
      {
        category: "Office Supplies",
        orders: 3100,
        sales: "₹7,50,000",
        change: "+15%",
        isPositive: true,
      },
      {
        category: "Home & Kitchen",
        orders: 2100,
        sales: "₹3,50,000",
        change: "+25%",
        isPositive: true,
      },
    ],
    distributionData: [
      {
        value: [95, 80, 70, 60, 85],
        name: "Current Period",
      },
      {
        value: [85, 70, 60, 50, 75],
        name: "Previous Period",
      },
    ],
  },
};

// Default to 7d data
const summaryData = timeRangeData["7d"].summaryData;

// Default to 7d data for category and daily sales
const categoryData = timeRangeData["7d"].categoryData;
const dailySalesData = timeRangeData["7d"].dailySalesData;

export default function SalesReportPage() {
  const { theme, resolvedTheme } = useTheme();
  const [timeRange, setTimeRange] = useState("7d");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isExpanded, setIsExpanded] = useState({
    trend: true,
    categories: true,
    distribution: true,
  });
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for dynamic data
  const [currentSummaryData, setCurrentSummaryData] = useState(timeRangeData["7d"].summaryData);
  const [currentCategoryData, setCurrentCategoryData] = useState(timeRangeData["7d"].categoryData);
  const [currentDailySalesData, setCurrentDailySalesData] = useState(timeRangeData["7d"].dailySalesData);
  const [currentDistributionData, setCurrentDistributionData] = useState(timeRangeData["7d"].distributionData);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Update data when time range changes
  useEffect(() => {
    const updateData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update all data based on selected time range
      setCurrentSummaryData(timeRangeData[timeRange].summaryData);
      setCurrentCategoryData(timeRangeData[timeRange].categoryData);
      setCurrentDailySalesData(timeRangeData[timeRange].dailySalesData);
      setCurrentDistributionData(timeRangeData[timeRange].distributionData);
      
      setIsLoading(false);
    };
    
    updateData();
    
    // Update date range based on time range selection
    const now = new Date();
    let fromDate;
    
    switch(timeRange) {
      case "7d":
        fromDate = subDays(now, 7);
        break;
      case "30d":
        fromDate = subDays(now, 30);
        break;
      case "90d":
        fromDate = subDays(now, 90);
        break;
      case "12m":
        fromDate = subDays(now, 365);
        break;
      default:
        fromDate = subDays(now, 7);
    }
    
    setDateRange({
      from: fromDate,
      to: now
    });
    
    // Log the time range change for debugging
    console.log("Time range changed to:", timeRange);
    
  }, [timeRange]);
  
  // This effect runs when date range is manually changed through the date picker
  useEffect(() => {
    // This is where you would fetch data based on the manually selected date range
    if (dateRange?.from && dateRange?.to) {
      console.log("Date range manually changed:", dateRange);
      // You could implement custom date range data fetching here
    }
  }, [dateRange]);

  // Helper function to get chart options with current theme
  const getChartOptions = (type: "trend" | "pie" | "radar") => {
    const currentTheme = resolvedTheme === "dark" ? "dark" : "light";
    const textColor = currentTheme === "dark" ? "#94a3b8" : "#64748b";
    const gridLineColor =
      currentTheme === "dark"
        ? "rgba(51, 65, 85, 0.5)"
        : "rgba(226, 232, 240, 0.7)";

    if (type === "trend") {
      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          borderWidth: 0,
          padding: [10, 14],
          textStyle: {
            color: "#f8fafc",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
          },
          axisPointer: {
            type: "shadow",
            shadowStyle: {
              color: "rgba(148, 163, 184, 0.15)",
            },
          },
          formatter: function (params: any) {
            let result = `<div style="font-weight: 500; margin-bottom: 4px">${params[0].axisValue}</div>`;
            params.forEach((param: any) => {
              const color = param.color;
              const marker = `<span style="display:inline-block;margin-right:4px;border-radius:50%;width:10px;height:10px;background-color:${color};"></span>`;
              result += `<div style="margin: 3px 0">${marker} ${
                param.seriesName
              }: ₹${param.value.toLocaleString()}</div>`;
            });
            return result;
          },
        },
        legend: {
          data: ["Sales", "Target"],
          textStyle: {
            color: textColor,
            fontFamily: "Inter, sans-serif",
          },
          right: 24,
          top: 12,
          itemGap: 20,
          itemWidth: 12,
          itemHeight: 4,
          icon: "rect",
        },
        grid: {
          left: "2%",
          right: "3%",
          bottom: "3%",
          top: "20%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: currentDailySalesData.map((item) => item.day),
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: textColor,
            fontFamily: "Inter, sans-serif",
            margin: 12,
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: gridLineColor,
              type: "dashed",
            },
          },
          axisLabel: {
            color: textColor,
            fontFamily: "Inter, sans-serif",
            formatter: (value: number) => `₹${value / 1000}k`,
          },
        },
        series: [
          {
            name: "Sales",
            type: "bar",
            barWidth: 20,
            data: currentDailySalesData.map((item) => item.sales),
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#8b5cf6" },
                { offset: 1, color: "#6d28d9" },
              ]),
              shadowColor: "rgba(139, 92, 246, 0.3)",
              shadowBlur: 8,
              shadowOffsetY: 4,
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#a78bfa" },
                  { offset: 1, color: "#7c3aed" },
                ]),
              },
            },
            animationDelay: (idx: number) => idx * 120,
          },
          {
            name: "Target",
            type: "line",
            data: currentDailySalesData.map((item) => item.target),
            smooth: true,
            symbol: "circle",
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: "#f59e0b",
              shadowColor: "rgba(245, 158, 11, 0.3)",
              shadowBlur: 8,
            },
            itemStyle: {
              color: "#f59e0b",
              borderColor: currentTheme === "dark" ? "#1e293b" : "#f8fafc",
              borderWidth: 2,
            },
            emphasis: {
              scale: 1.2,
            },
            animationDelay: (idx: number) => idx * 120 + 60,
          },
        ],
        animationEasing: "cubicOut",
        animationDuration: 1200,
        animationDelayUpdate: (idx: number) => idx * 10,
      };
    }

    if (type === "pie") {
      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          borderWidth: 0,
          padding: [10, 14],
          textStyle: {
            color: "#f8fafc",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
          },
          formatter: "{b}: ₹{c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          right: 20,
          top: "center",
          textStyle: {
            color: textColor,
            fontFamily: "Inter, sans-serif",
          },
          itemGap: 12,
          itemWidth: 8,
          itemHeight: 8,
          icon: "circle",
        },
        series: [
          {
            name: "Sales by Category",
            type: "pie",
            radius: ["45%", "75%"],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 6,
              borderColor: currentTheme === "dark" ? "#1e293b" : "#f8fafc",
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.2)",
            },
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: "bold",
                color: currentTheme === "dark" ? "#f8fafc" : "#020617",
              },
              itemStyle: {
                shadowBlur: 15,
                shadowColor: "rgba(0, 0, 0, 0.3)",
              },
            },
            labelLine: {
              show: false,
            },
            data: currentCategoryData.map((item, index) => ({
              value: parseInt(item.sales.replace(/[^0-9]/g, "")),
              name: item.category,
              itemStyle: {
                color: [
                  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#c084fc" },
                    { offset: 1, color: "#8b5cf6" },
                  ]),
                  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#34d399" },
                    { offset: 1, color: "#10b981" },
                  ]),
                  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#fbbf24" },
                    { offset: 1, color: "#f59e0b" },
                  ]),
                  new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#38bdf8" },
                    { offset: 1, color: "#0ea5e9" },
                  ]),
                ][index % 4],
              },
            })),
          },
        ],
        animationEasing: "cubicOut",
        animationDuration: 1200,
      };
    }

    if (type === "radar") {
      return {
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          borderWidth: 0,
          padding: [10, 14],
          textStyle: {
            color: "#f8fafc",
            fontSize: 12,
            fontFamily: "Inter, sans-serif",
          },
        },
        radar: {
          indicator: [
            { name: "Online", max: 100 },
            { name: "Retail", max: 100 },
            { name: "Wholesale", max: 100 },
            { name: "Direct", max: 100 },
            { name: "Partners", max: 100 },
          ],
          radius: "65%",
          splitNumber: 4,
          axisName: {
            color: textColor,
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
          },
          splitLine: {
            lineStyle: {
              color:
                currentTheme === "dark"
                  ? "rgba(51, 65, 85, 0.6)"
                  : "rgba(226, 232, 240, 0.8)",
            },
          },
          splitArea: {
            show: true,
            areaStyle: {
              color:
                currentTheme === "dark"
                  ? [
                      "rgba(30, 41, 59, 0.2)",
                      "rgba(30, 41, 59, 0.4)",
                      "rgba(30, 41, 59, 0.6)",
                      "rgba(30, 41, 59, 0.8)",
                    ]
                  : [
                      "rgba(248, 250, 252, 0.5)",
                      "rgba(241, 245, 249, 0.5)",
                      "rgba(226, 232, 240, 0.5)",
                      "rgba(203, 213, 225, 0.5)",
                    ],
            },
          },
          axisLine: {
            lineStyle: {
              color:
                currentTheme === "dark"
                  ? "rgba(51, 65, 85, 0.6)"
                  : "rgba(203, 213, 225, 0.8)",
            },
          },
        },
        series: [
          {
            name: "Sales Distribution",
            type: "radar",
            data: currentDistributionData.map((item, index) => ({
              value: item.value,
              name: item.name,
              symbol: "circle",
              symbolSize: index === 0 ? 8 : 6,
              lineStyle: {
                width: index === 0 ? 3 : 2,
                type: index === 0 ? "solid" : "dashed",
                color: index === 0 ? "#8b5cf6" : "#94a3b8",
                shadowColor: index === 0 ? "rgba(139, 92, 246, 0.3)" : "transparent",
                shadowBlur: index === 0 ? 8 : 0,
              },
              itemStyle: {
                color: index === 0 ? "#8b5cf6" : "#94a3b8",
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { 
                    offset: 0, 
                    color: index === 0 
                      ? "rgba(139, 92, 246, 0.5)" 
                      : "rgba(148, 163, 184, 0.3)" 
                  },
                  { 
                    offset: 1, 
                    color: index === 0 
                      ? "rgba(139, 92, 246, 0.1)" 
                      : "rgba(148, 163, 184, 0.1)" 
                  },
                ]),
              },
            })),
          },
        ],
        animationEasing: "cubicOut",
        animationDuration: 1200,
      };
    }

    return {};
  };

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
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-950 to-gray-900 h-screen overflow-scroll no-scrollbar">
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin text-violet-500 border-2 border-current border-t-transparent rounded-full"></div>
            <p className="text-sm text-gray-300">Loading {timeRange} data...</p>
          </div>
        </div>
      )}
      {/* Header with Glassmorphism */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-xl bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full md:w-auto">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-500">
            Sales Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track and analyze your sales performance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex gap-2 w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-[240px] justify-start text-left font-normal bg-gray-900 text-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d")} -{" "}
                        {format(dateRange.to, "MMM d, y")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM d, y")
                    )
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
                  onSelect={(range) => {
                    setDateRange(range);
                    if (range?.from && range?.to) {
                      // When a complete range is selected, set custom time range
                      setTimeRange("custom");
                      setIsLoading(true);
                      
                      // Simulate API call for custom date range
                      setTimeout(() => {
                        // For demo purposes, we'll just use the 30d data for custom ranges
                        setCurrentSummaryData(timeRangeData["30d"].summaryData);
                        setCurrentCategoryData(timeRangeData["30d"].categoryData);
                        setCurrentDailySalesData(timeRangeData["30d"].dailySalesData);
                        setCurrentDistributionData(timeRangeData["30d"].distributionData);
                        setIsLoading(false);
                        
                        toast.info("Custom Date Range", {
                          description: `Data loaded for ${format(range.from, "MMM d, yyyy")} to ${format(range.to, "MMM d, yyyy")}`,
                        });
                      }, 1200);
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select 
              value={timeRange}
              onValueChange={(value) => {
                setTimeRange(value);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="12m">Last 12 months</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <Button 
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 border-0 shadow-lg shadow-violet-900/20"
            onClick={() => {
              setIsLoading(true);
              // Simulate export process
              setTimeout(() => {
                setIsLoading(false);
              toast.success("Export Successful", {
                 description: `Sales report for ${timeRange === "7d" ? "last 7 days" : 
                     timeRange === "30d" ? "last 30 days" : 
                     timeRange === "90d" ? "last 90 days" : 
                     "last 12 months"} has been downloaded.`,
                 duration: 3000,
               });
              }, 1500);
            }}
          >
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
        {currentSummaryData.map((item, idx) => (
          <MetricCard
            key={idx}
            title={item.label}
            value={item.value}
            change={item.change}
            isPositive={item.isPositive}
            icon={item.icon}
            className={
              [
                "from-violet-900/40 to-indigo-900/40",
                "from-emerald-900/40 to-green-900/40",
                "from-amber-900/40 to-yellow-900/40",
                "from-cyan-900/40 to-blue-900/40",
              ][idx % 4]
            }
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
            onClick={() =>
              setIsExpanded((prev) => ({ ...prev, trend: !prev.trend }))
            }
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
                  option={getChartOptions("trend")}
                  style={{ height: "100%", width: "100%" }}
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
              onClick={() =>
                setIsExpanded((prev) => ({
                  ...prev,
                  categories: !prev.categories,
                }))
              }
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
                    option={getChartOptions("pie")}
                    style={{ height: "100%", width: "100%" }}
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
              onClick={() =>
                setIsExpanded((prev) => ({
                  ...prev,
                  distribution: !prev.distribution,
                }))
              }
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
                    option={getChartOptions("radar")}
                    style={{ height: "100%", width: "100%" }}
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
                      <TableHead className="text-gray-300 font-medium">
                        Category
                      </TableHead>
                      <TableHead className="text-gray-300 font-medium">
                        Orders
                      </TableHead>
                      <TableHead className="text-gray-300 font-medium">
                        Sales
                      </TableHead>
                      <TableHead className="text-right text-gray-300 font-medium">
                        Change
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCategoryData.map((cat, idx) => (
                      <TableRow
                        key={idx}
                        className="border-gray-800 hover:bg-gray-800/50"
                      >
                        <TableCell className="font-medium">
                          {cat.category}
                        </TableCell>
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
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  Data updated 2 hours ago
                </div>
                <div>Showing {currentCategoryData.length} categories</div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
