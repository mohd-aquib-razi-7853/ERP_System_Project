"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

const DashboardPage = () => {
  // Sales Trend Chart Options
  const salesTrendOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      axisLine: {
        lineStyle: {
          color: '#64748b'
        }
      },
      axisLabel: {
        color: '#94a3b8'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#64748b'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#1e293b'
        }
      },
      axisLabel: {
        color: '#94a3b8'
      }
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 4,
          color: '#6366f1'
        },
        itemStyle: {
          color: '#6366f1'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(99, 102, 241, 0.5)'
            }, {
              offset: 1,
              color: 'rgba(99, 102, 241, 0)'
            }]
          }
        }
      }
    ]
  };

  // Inventory Status Chart Options
  const inventoryOption: EChartsOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: '#94a3b8'
      }
    },
    series: [
      {
        name: 'Inventory',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0f172a',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center',
          color: '#ffffff'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Electronics', itemStyle: { color: '#6366f1' } },
          { value: 735, name: 'Furniture', itemStyle: { color: '#f59e0b' } },
          { value: 580, name: 'Clothing', itemStyle: { color: '#10b981' } },
          { value: 484, name: 'Groceries', itemStyle: { color: '#ec4899' } },
          { value: 300, name: 'Others', itemStyle: { color: '#8b5cf6' } }
        ]
      }
    ]
  };

  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4  bg-neutral-900 text-white min-h-screen">
      {/* Summary Cards */}
      <motion.div 
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="hover:shadow-lg rounded-xl"
      >
        <Card className="border-0 bg-neutral-800 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-300 font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold text-white">112</span>
            <div className="p-2 rounded-full bg-blue-900/30">
              <ArrowUpRight className="text-blue-400 w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="hover:shadow-lg rounded-xl"
      >
        <Card className="border-0 bg-neutral-800 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-300 font-medium">Projects In Progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold text-white">8</span>
            <div className="p-2 rounded-full bg-amber-900/30">
              <ArrowDownRight className="text-amber-400 w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="hover:shadow-lg rounded-xl"
      >
        <Card className="border-0 bg-neutral-800 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-300 font-medium">Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold text-white">3</span>
            <div className="p-2 rounded-full bg-red-900/30">
              <ArrowDownRight className="text-red-400 w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="hover:shadow-lg rounded-xl"
      >
        <Card className="border-0 bg-neutral-800 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-300 font-medium">Sales This Month</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-3xl font-bold text-white">₹3.2L</span>
            <div className="p-2 rounded-full bg-green-900/30">
              <ArrowUpRight className="text-green-400 w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Chart Widgets */}
      <div className="col-span-1 md:col-span-2">
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="border-0 bg-neutral-800 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-300">Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts 
                option={salesTrendOption} 
                style={{ height: '400px', width: '100%' }} 
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="col-span-1 md:col-span-2">
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="border-0 bg-neutral-800 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-300">Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts 
                option={inventoryOption} 
                style={{ height: '400px', width: '100%' }} 
                className="rounded-lg"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Logs */}
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <motion.div 
          whileHover={{ y: -3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="border-0 bg-neutral-800 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-300">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center p-3 hover:bg-neutral-700/50 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center mr-3">
                    <span className="text-green-400">✅</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Project "Alpha" marked completed</p>
                    <p className="text-xs text-gray-400">By Ravi • 2 hours ago</p>
                  </div>
                </li>
                <li className="flex items-center p-3 hover:bg-neutral-700/50 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                    <span className="text-blue-400">📦</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">12 items restocked</p>
                    <p className="text-xs text-gray-400">By Inventory team • 5 hours ago</p>
                  </div>
                </li>
                <li className="flex items-center p-3 hover:bg-neutral-700/50 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                    <span className="text-purple-400">👤</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">New employee "Aisha Khan" added</p>
                    <p className="text-xs text-gray-400">By HR • Yesterday</p>
                  </div>
                </li>
                <li className="flex items-center p-3 hover:bg-neutral-700/50 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center mr-3">
                    <span className="text-emerald-400">🧾</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Payment of ₹78,000 received</p>
                    <p className="text-xs text-gray-400">From ClientX • Yesterday</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardPage;