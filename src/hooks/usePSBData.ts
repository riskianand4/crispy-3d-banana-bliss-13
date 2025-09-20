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
      
      // Handle both wrapped and direct array responses
      let ordersData = [];
      let success = false;
      
      if (response && typeof response === 'object') {
        if (response.success !== undefined) {
          // Wrapped response format: { success: boolean, data: array }
          success = response.success;
          ordersData = response.data || [];
        } else if (Array.isArray(response)) {
          // Direct array response
          success = true;
          ordersData = response;
        } else if (Array.isArray((response as any).data)) {
          // Response with data property containing array
          success = true;
          ordersData = (response as any).data;
        } else {
          // Unknown format, treat as successful if data exists
          success = true;
          ordersData = [];
        }
      }
      
      if (success || Array.isArray(ordersData)) {
        setOrders(ordersData);
        return { success: true, data: ordersData, pagination: response.pagination || null };
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error fetching PSB orders:', error);
      setError(error.message || 'Failed to fetch orders');
      
      // Only show toast for actual network errors, not for empty data
      if (error.status >= 500 || error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Backend PSB service bermasalah');
      }
      
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
      
      // psbApi.getAnalytics always returns success with fallback data
      if (response.success) {
        setAnalytics(response.data);
        return response;
      }
    } catch (error: any) {
      console.error('Error fetching PSB analytics:', error);
      setError(error.message || 'Failed to fetch analytics');
      
      // Only show toast for actual API failures, not fallback data
      if (error.message && !error.message.includes('fallback')) {
        toast.error('Gagal memuat data analytics PSB');
      }
      
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
      return { success: false, data: null };
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