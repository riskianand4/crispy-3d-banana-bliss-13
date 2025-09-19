import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton, StatsCardSkeleton } from '@/components/ui/loading-skeleton';
import { 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Calendar,
  RefreshCw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { usePSBAnalytics } from '@/hooks/usePSBAnalytics';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

export const PSBAnalytics: React.FC = () => {
  const { analytics, loading, error, refreshAnalytics } = usePSBAnalytics();
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    // Check connection status
    if (analytics) {
      setConnectionStatus('connected');
    } else if (error) {
      setConnectionStatus('disconnected');  
    } else {
      setConnectionStatus('checking');
    }
  }, [analytics, error]);

  const generatePerformanceData = () => {
    if (!analytics) return [];
    
    return analytics.clusterStats.slice(0, 8).map(cluster => ({
      name: cluster._id,
      performance: cluster.count > 0 ? ((cluster.completed / cluster.count) * 100) : 0,
      total: cluster.count,
      completed: cluster.completed
    }));
  };

  const generateRadialData = () => {
    if (!analytics) return [];
    
    const { summary } = analytics;
    return [
      {
        name: 'Completed',
        value: summary.completedOrders,
        fill: 'hsl(var(--chart-1))'
      },
      {
        name: 'In Progress', 
        value: summary.inProgressOrders,
        fill: 'hsl(var(--chart-2))'
      },
      {
        name: 'Pending',
        value: summary.pendingOrders,
        fill: 'hsl(var(--chart-3))'
      }
    ];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-gradient-to-br from-muted/50 to-muted/20 border relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-muted/10 rounded-full -translate-y-4 translate-x-4"></div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="w-12 h-12 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Advanced Charts Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-56" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[350px] w-full" />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Cluster Performance Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>

        {/* Performance Insights Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4 mt-1" />
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3 mt-1" />
              </div>
            </div>
            <div className="pt-4 border-t">
              <Skeleton className="h-5 w-40 mb-3" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-48 rounded-full" />
                <Skeleton className="h-6 w-44 rounded-full" />
                <Skeleton className="h-6 w-40 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics && !loading) {
    return (
      <div className="space-y-6">
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Backend PSB Service Tidak Tersedia</strong>
                <p className="text-sm mt-1">
                  {error || 'Analytics data tidak dapat dimuat. Periksa koneksi backend.'}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {connectionStatus === 'connected' ? (
                  <Wifi className="h-4 w-4 text-green-600" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-600" />
                )}
                <span className="text-xs capitalize">{connectionStatus}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
        
        <div className="text-center py-8">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Analytics data tidak tersedia</p>
          <p className="text-sm text-muted-foreground mb-6">
            Backend server mungkin tidak berjalan atau endpoint /api/psb-orders/analytics tidak dapat diakses
          </p>
          <Button onClick={refreshAnalytics} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground">
            Deep insights dan prediksi performa PSB menggunakan AI analytics
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={refreshAnalytics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Period
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="glass hover-lift relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-4 translate-x-4"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-foreground">{analytics.summary.totalOrders}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success font-medium">+12.5%</span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass hover-lift relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-success/10 rounded-full -translate-y-4 translate-x-4"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-foreground">{analytics.summary.completionRate}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success font-medium">+3.2%</span>
                  <span className="text-xs text-muted-foreground">improvement</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-success text-success-foreground rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass hover-lift relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full -translate-y-4 translate-x-4"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Avg. Completion</p>
                <p className="text-3xl font-bold text-foreground">4.2d</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDown className="h-3 w-3 text-success" />
                  <span className="text-xs text-success font-medium">-0.8d</span>
                  <span className="text-xs text-muted-foreground">faster</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass hover-lift relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-warning/10 rounded-full -translate-y-4 translate-x-4"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">Active Clusters</p>
                <p className="text-3xl font-bold text-foreground">{analytics.clusterStats.length}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success font-medium">+2</span>
                  <span className="text-xs text-muted-foreground">new clusters</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-warning text-warning-foreground rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Advanced Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Trend */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Performance Trend Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={analytics.monthlyTrends.reverse()}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="_id"
                    tickFormatter={(value) => `${value.month}/${value.year}`}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value: any) => `${value.month}/${value.year}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    strokeWidth={2}
                    name="Total Orders"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                    strokeWidth={2}
                    name="Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="90%"
                  data={generateRadialData()}
                >
                  <RadialBar
                    label={{ position: 'insideStart', fill: '#fff' }}
                    background
                    dataKey="value"
                  />
                  <Legend 
                    iconSize={10}
                    wrapperStyle={{
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px'
                    }}
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cluster Performance Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Cluster Performance Benchmarking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={generatePerformanceData()} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="total" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  name="Total Orders"
                />
                <Bar 
                  yAxisId="left"
                  dataKey="completed" 
                  fill="hsl(var(--chart-2))" 
                  radius={[4, 4, 0, 0]}
                  name="Completed"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="performance" 
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={3}
                  name="Performance %"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-700">High Performance</span>
                </div>
                <p className="text-sm text-green-600">
                  Cluster {analytics.clusterStats[0]?._id} shows exceptional performance with {
                    analytics.clusterStats[0]?.count > 0 
                      ? ((analytics.clusterStats[0].completed / analytics.clusterStats[0].count) * 100).toFixed(1)
                      : 0
                  }% completion rate
                </p>
              </div>
              
              <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="font-medium text-orange-700">Optimization Opportunity</span>
                </div>
                <p className="text-sm text-orange-600">
                  Consider reviewing processes in underperforming clusters to improve overall efficiency
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Predictive Analytics</h4>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2">
                  <TrendingUp className="h-3 w-3" />
                  Expected Growth: +15.3% next month
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2">
                  <Target className="h-3 w-3" />
                  Optimal Target: 95% completion rate
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Peak Performance: Cluster A, B, C
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};