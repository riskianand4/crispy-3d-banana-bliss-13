import { useState, useEffect } from 'react';
import { psbApi } from '@/services/psbApi';
import { PSBOrder, PSBAnalytics } from '@/types/psb';
import { toast } from 'sonner';

export const usePSBData = () => {
  const [orders, setOrders] = useState<PSBOrder[]>([]);
  const [analytics, setAnalytics] = useState<PSBAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchOrders = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await psbApi.getOrders(params);
      if (response.success) {
        setOrders(response.data);
        return response;
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error: any) {
      console.error('Error fetching PSB orders:', error);
      setError(error.message || 'Failed to fetch orders');
      toast.error('Gagal memuat data orders PSB');
      // Set empty orders as fallback
      setOrders([]);
      return { success: false, data: [], pagination: null };
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await psbApi.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
        return response;
      } else {
        throw new Error('Failed to fetch analytics');
      }
    } catch (error: any) {
      console.error('Error fetching PSB analytics:', error);
      setError(error.message || 'Failed to fetch analytics');
      toast.error('Gagal memuat data analytics PSB');
      // Set empty analytics as fallback
      setAnalytics({
        summary: {
          totalOrders: 0,
          completedOrders: 0,
          pendingOrders: 0,
          inProgressOrders: 0,
          completionRate: '0'
        },
        clusterStats: [],
        stoStats: [],
        monthlyTrends: []
      });
      return { success: false, data: analytics };
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      const response = await psbApi.createOrder(orderData);
      if (response.success) {
        toast.success('Order PSB berhasil dibuat');
        // Refresh orders list
        fetchOrders();
        return response;
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating PSB order:', error);
      toast.error(error.message || 'Gagal membuat order PSB');
      throw error;
    }
  };

  const updateOrder = async (id: string, orderData: any) => {
    try {
      const response = await psbApi.updateOrder(id, orderData);
      if (response.success) {
        toast.success('Order PSB berhasil diupdate');
        // Refresh orders list
        fetchOrders();
        return response;
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error: any) {
      console.error('Error updating PSB order:', error);
      toast.error(error.message || 'Gagal mengupdate order PSB');
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const response = await psbApi.deleteOrder(id);
      if (response.success) {
        toast.success('Order PSB berhasil dihapus');
        // Refresh orders list
        fetchOrders();
        return response;
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (error: any) {
      console.error('Error deleting PSB order:', error);
      toast.error(error.message || 'Gagal menghapus order PSB');
      throw error;
    }
  };

  return {
    orders,
    analytics,
    loading,
    error,
    fetchOrders,
    fetchAnalytics,
    createOrder,
    updateOrder,
    deleteOrder,
  };
};