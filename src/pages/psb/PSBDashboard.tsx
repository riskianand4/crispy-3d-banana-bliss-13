import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton, StatsCardSkeleton } from '@/components/ui/loading-skeleton';
import { BarChart3, Users, FileText, TrendingUp, CheckCircle, Clock, AlertTriangle, RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { usePSBAnalytics } from '@/hooks/usePSBAnalytics';
import { Alert, AlertDescription } from '@/components/ui/alert';
const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];
export const PSBDashboard: React.FC = () => {
  const {
    analytics,
    loading,
    error,
    refreshAnalytics
  } = usePSBAnalytics();
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
  if (loading) {
    return <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({
          length: 4
        }).map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
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

        {/* Additional Charts Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({
              length: 10
            }).map((_, i) => <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  if (!analytics && !loading) {
    return <div className="space-y-6">
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Koneksi Backend Bermasalah</strong>
                <p className="text-sm mt-1">
                  {error || 'Backend PSB service tidak dapat dijangkau. Menampilkan mode offline.'}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {connectionStatus === 'connected' ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
                <span className="text-xs capitalize">{connectionStatus}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
        
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Backend PSB service tidak tersedia</p>
          <p className="text-sm text-muted-foreground mb-6">
            Periksa apakah backend server berjalan di port 3001 dan endpoint /api/psb-orders dapat diakses
          </p>
          <Button onClick={refreshAnalytics} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>;
  }
  const statusData = [{
    name: 'Completed',
    value: analytics.summary.completedOrders,
    color: COLORS[0]
  }, {
    name: 'In Progress',
    value: analytics.summary.inProgressOrders,
    color: COLORS[1]
  }, {
    name: 'Pending',
    value: analytics.summary.pendingOrders,
    color: COLORS[2]
  }];
  return <div className="space-y-6 sm:p-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard PSB</h1>
          <p className="text-muted-foreground">
            Monitoring dan analisis data PSB secara real-time
          </p>
        </div>
        <Button onClick={refreshAnalytics} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Semua order PSB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analytics.summary.completedOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              Order selesai
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analytics.summary.inProgressOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              Sedang dikerjakan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.summary.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Tingkat penyelesaian
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Order</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({
                name,
                value,
                percent
              }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Clusters */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.clusterStats.slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top STOs */}
        <Card>
          <CardHeader>
            <CardTitle>Top STOs</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.stoStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" angle={-45} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyTrends.reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" tickFormatter={value => `${value.month}/${value.year}`} />
                <YAxis />
                <Tooltip labelFormatter={(value: any) => `${value.month}/${value.year}`} />
                <Bar dataKey="count" name="Total" fill="hsl(var(--primary))" />
                <Bar dataKey="completed" name="Completed" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats List */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Cluster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.clusterStats.slice(0, 10).map(cluster => <div key={cluster._id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="font-medium">{cluster._id}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{cluster.count} total</Badge>
                  <Badge variant="secondary">{cluster.completed} selesai</Badge>
                  <span className="text-sm text-muted-foreground">
                    {cluster.count > 0 ? (cluster.completed / cluster.count * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};