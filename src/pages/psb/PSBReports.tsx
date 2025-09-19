import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton, StatsCardSkeleton } from '@/components/ui/loading-skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, Download, Calendar, Filter, TrendingUp, BarChart3, PieChart, Users, Package, Clock, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { psbApi } from '@/services/psbApi';
import { PSBAnalytics } from '@/types/psb';
import { toast } from 'sonner';
const reportTypes = [{
  id: 'summary',
  title: 'Laporan Summary',
  description: 'Ringkasan performa PSB secara keseluruhan',
  icon: BarChart3,
  color: 'bg-blue-500'
}, {
  id: 'cluster',
  title: 'Laporan per Cluster',
  description: 'Analisis performa berdasarkan cluster',
  icon: PieChart,
  color: 'bg-green-500'
}, {
  id: 'technician',
  title: 'Laporan Teknisi',
  description: 'Evaluasi performa teknisi lapangan',
  icon: Users,
  color: 'bg-purple-500'
}, {
  id: 'package',
  title: 'Laporan Paket',
  description: 'Analisis berdasarkan jenis paket layanan',
  icon: Package,
  color: 'bg-orange-500'
}];
export const PSBReports: React.FC = () => {
  const [analytics, setAnalytics] = useState<PSBAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState('summary');
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  } | undefined>();
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await psbApi.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Gagal memuat data analytics');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAnalytics();
  }, []);
  const handleExportReport = (reportType: string) => {
    toast.success(`Export laporan ${reportType} akan segera dimulai`);
  };
  const generateTrendData = () => {
    if (!analytics) return [];
    return analytics.monthlyTrends.map(trend => ({
      month: `${trend._id.month}/${trend._id.year}`,
      total: trend.count,
      completed: trend.completed,
      pending: trend.count - trend.completed
    }));
  };
  if (loading) {
    return <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        {/* Report Type Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({
          length: 4
        }).map((_, i) => <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({
          length: 4
        }).map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Detail Report Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-2">
                  {Array.from({
                  length: 4
                }).map((_, i) => <div key={i} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-12" />
                    </div>)}
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <div className="space-y-2">
                  {Array.from({
                  length: 5
                }).map((_, i) => <div key={i} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <Skeleton className="h-4 w-32" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  return <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3
    }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Laporan PSB
          </h1>
          <p className="text-muted-foreground">
            Generate dan analisis laporan performa PSB secara detail
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Pilih Periode
          </Button>
          <Button size="sm" onClick={() => handleExportReport(selectedReport)}>
            <Download className="h-4 w-4 mr-2" />
            Export Laporan
          </Button>
        </div>
      </motion.div>

      {/* Report Type Selection */}
      <TooltipProvider>
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.1
      }} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((report, index) => <motion.div key={report.id} initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.3,
          delay: index * 0.1
        }}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg h-[140px] ${selectedReport === report.id ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`} onClick={() => setSelectedReport(report.id)}>
                    <CardContent className="p-6 h-full">
                      <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${report.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <report.icon className="h-5 w-5 text-white" />
                          </div>
                          {selectedReport === report.id && <Badge variant="default" className="text-xs ml-auto">Active</Badge>}
                        </div>
                        <div className="flex-1 mt-3">
                          <h3 className="font-semibold text-sm mb-2">{report.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {report.description.length > 35 ? `${report.description.substring(0, 35)}...` : report.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-4">
                  <div className="space-y-2">
                    <p className="font-medium">{report.title}</p>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Klik untuk memilih jenis laporan ini</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </motion.div>)}
        </motion.div>
      </TooltipProvider>

      {analytics && <>
          {/* Summary Stats */}
          <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.2
      }} className="grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-700">{analytics.summary.totalOrders}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Completed</p>
                    <p className="text-2xl font-bold text-green-700">{analytics.summary.completedOrders}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 font-medium">In Progress</p>
                    <p className="text-2xl font-bold text-orange-700">{analytics.summary.inProgressOrders}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Success Rate</p>
                    <p className="text-2xl font-bold text-purple-700">{analytics.summary.completionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Monthly Trend */}
            <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.3,
          delay: 0.3
        }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trend Bulanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={generateTrendData().reverse()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="total" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Total Orders" />
                      <Area type="monotone" dataKey="completed" stackId="2" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} name="Completed" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cluster Performance */}
            <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.3,
          delay: 0.4
        }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performa Cluster
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.clusterStats.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" name="Total Orders" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" fill="hsl(var(--chart-2))" name="Completed" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Report Section */}
          <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: 0.5
      }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Laporan Detail - {reportTypes.find(r => r.id === selectedReport)?.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedReport === 'summary' && <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Ringkasan Performa</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>Total Order PSB</span>
                          <Badge variant="outline">{analytics.summary.totalOrders}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>Order Selesai</span>
                          <Badge variant="secondary">{analytics.summary.completedOrders}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>Dalam Proses</span>
                          <Badge variant="outline">{analytics.summary.inProgressOrders}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                          <span>Tingkat Keberhasilan</span>
                          <Badge variant="default">{analytics.summary.completionRate}%</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">Top 5 Cluster</h4>
                      <div className="space-y-2">
                        {analytics.clusterStats.slice(0, 5).map((cluster, index) => <div key={cluster._id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                            <span className="font-medium">#{index + 1} {cluster._id}</span>
                            <div className="flex gap-2">
                              <Badge variant="outline">{cluster.count} total</Badge>
                              <Badge variant="secondary">{cluster.completed} selesai</Badge>
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </div>}

                {selectedReport === 'cluster' && <div className="space-y-4">
                    <h4 className="font-semibold">Analisis per Cluster</h4>
                    <div className="grid gap-3">
                      {analytics.clusterStats.map((cluster, index) => <motion.div key={cluster._id} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.3,
                  delay: index * 0.05
                }} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-bold text-primary">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{cluster._id}</p>
                              <p className="text-sm text-muted-foreground">
                                Success Rate: {cluster.count > 0 ? (cluster.completed / cluster.count * 100).toFixed(1) : 0}%
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{cluster.count} orders</Badge>
                            <Badge variant="secondary">{cluster.completed} completed</Badge>
                          </div>
                        </motion.div>)}
                    </div>
                  </div>}

                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={() => handleExportReport(selectedReport)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" onClick={() => handleExportReport(selectedReport)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>}
    </div>;
};