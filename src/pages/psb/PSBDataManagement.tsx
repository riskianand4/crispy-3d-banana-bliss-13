import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton, StatsCardSkeleton, TableSkeleton } from '@/components/ui/loading-skeleton';
import { Database, Upload, Download, Search, Filter, Edit, Trash2, Eye, Plus, RefreshCw, FileSpreadsheet, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { psbApi } from '@/services/psbApi';
import { PSBOrder } from '@/types/psb';
import { toast } from 'sonner';
export const PSBDataManagement: React.FC = () => {
  const [orders, setOrders] = useState<PSBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [importing, setImporting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await psbApi.getOrders({
        search,
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 100
      });
      if (response && response.success) {
        setOrders(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Gagal memuat data orders');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
        setSelectedFile(file);
        toast.success(`File ${file.name} siap untuk diimport`);
      } else {
        toast.error('Format file tidak didukung. Gunakan file Excel (.xlsx atau .xls)');
      }
    }
  };
  const handleImport = async () => {
    if (!selectedFile) {
      toast.error('Pilih file Excel terlebih dahulu');
      return;
    }
    try {
      setImporting(true);

      // Simulate import process - In real implementation, you would send the file to backend
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success(`Berhasil mengimport data dari ${selectedFile.name}`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh data after import
      fetchOrders();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Gagal mengimport data');
    } finally {
      setImporting(false);
    }
  };
  const handleExport = () => {
    toast.success('Export data akan segera dimulai');
    // In real implementation, trigger Excel export
  };
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await psbApi.deleteOrder(orderId);
      toast.success('Data berhasil dihapus');
      fetchOrders();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus data');
    }
  };
  const getStatusBadge = (status: string) => {
    const variants = {
      'Completed': 'default',
      'In Progress': 'secondary',
      'Pending': 'outline',
      'Cancelled': 'destructive'
    };
    return variants[status as keyof typeof variants] || 'outline';
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'Pending':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };
  if (loading) {
    return <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>

        {/* Stats Overview Skeleton */}
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({
          length: 4
        }).map((_, i) => <StatsCardSkeleton key={i} />)}
        </div>

        {/* Filters Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Skeleton className="h-10 flex-1 min-w-[300px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
          </CardContent>
        </Card>

        {/* Data Table Skeleton */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <TableSkeleton rows={10} />
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
    }} className="flex items-center justify-end ">
        
        <div className="flex gap-3">
          <Button onClick={fetchOrders} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import Excel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Data dari Excel</DialogTitle>
                <DialogDescription>
                  Upload file Excel (.xlsx atau .xls) untuk mengimport data PSB secara batch
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileSelect} className="hidden" />
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Pilih File Excel
                  </Button>
                  {selectedFile && <p className="text-sm text-muted-foreground">
                      File terpilih: {selectedFile.name}
                    </p>}
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={handleImport} disabled={!selectedFile || importing} className="flex-1">
                    {importing ? <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengimport...
                      </> : <>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </>}
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedFile(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.1
    }} className="grid gap-4 md:grid-cols-4">
        <Card className="glass hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Database className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === 'Completed').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 text-success rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {orders.filter(o => o.status === 'In Progress').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 text-warning rounded-xl flex items-center justify-center">
                <RefreshCw className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass hover-lift">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clusters</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(orders.map(o => o.cluster)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                <Database className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.2
    }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Cari berdasarkan nama, order ID, atau nomor telepon..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Table */}
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.3,
      delay: 0.3
    }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data PSB Management
              </span>
              <Badge variant="outline">{orders.length} records</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">No</TableHead>
                    <TableHead className="font-semibold">Order ID</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Cluster</TableHead>
                    <TableHead className="font-semibold">STO</TableHead>
                    <TableHead className="font-semibold">Package</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Technician</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => <motion.tr key={order._id} initial={{
                  opacity: 0,
                  x: -20
                }} animate={{
                  opacity: 1,
                  x: 0
                }} transition={{
                  duration: 0.3,
                  delay: index * 0.02
                }} className="hover:bg-muted/50 transition-all duration-200">
                      <TableCell className="font-medium">{order.no}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {order.orderNo}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {order.cluster}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.sto}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.package}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <Badge variant={getStatusBadge(order.status) as any} className="text-xs">
                            {order.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {order.technician || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="hover:bg-green-100 hover:text-green-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteOrder(order._id)} className="hover:bg-red-100 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>)}
                </TableBody>
              </Table>
            </div>
            
            {orders.length === 0 && <div className="text-center py-12">
                <Database className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">Tidak ada data</h3>
                <p className="text-sm text-muted-foreground">
                  Import data Excel atau tambah data manual untuk memulai
                </p>
                <Button className="mt-4" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Data
                </Button>
              </div>}
          </CardContent>
        </Card>
      </motion.div>
    </div>;
};