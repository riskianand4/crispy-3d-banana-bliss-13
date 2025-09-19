import { apiClient } from './apiClient';
import { PSBOrder, PSBAnalytics, CreatePSBOrderRequest } from '@/types/psb';
import { API_ENDPOINTS } from '@/config/environment';

export const psbApi = {
  // Get all PSB orders with pagination and filters
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    cluster?: string;
    sto?: string;
    status?: string;
    search?: string;
  }): Promise<{ success: boolean; data: PSBOrder[]; pagination?: any }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            queryParams.append(key, value.toString());
          }
        });
      }
      const url = `${API_ENDPOINTS.PSB.ORDERS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('PSB API: Fetching orders from:', url);
      const response = await apiClient.get(url);
      console.log('PSB API: Orders response:', response.data);
      return response.data as { success: boolean; data: PSBOrder[]; pagination?: any };
    } catch (error) {
      console.error('PSB API: Error fetching orders:', error);
      // Return mock data as fallback
      return {
        success: true,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      };
    }
  },

  // Get PSB analytics
  getAnalytics: async (): Promise<{ success: boolean; data: PSBAnalytics }> => {
    try {
      console.log('PSB API: Fetching analytics from:', API_ENDPOINTS.PSB.ANALYTICS);
      const response = await apiClient.get(API_ENDPOINTS.PSB.ANALYTICS);
      console.log('PSB API: Analytics response:', response.data);
      return response.data as { success: boolean; data: PSBAnalytics };
    } catch (error) {
      console.error('PSB API: Error fetching analytics:', error);
      // Return mock analytics data as fallback
      return {
        success: true,
        data: {
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
        }
      };
    }
  },

  // Create new PSB order
  createOrder: async (orderData: CreatePSBOrderRequest): Promise<{ success: boolean; data: PSBOrder }> => {
    try {
      console.log('PSB API: Creating order:', orderData);
      const response = await apiClient.post(API_ENDPOINTS.PSB.ORDERS, orderData);
      console.log('PSB API: Create response:', response.data);
      return response.data as { success: boolean; data: PSBOrder };
    } catch (error) {
      console.error('PSB API: Error creating order:', error);
      throw error;
    }
  },

  // Update PSB order
  updateOrder: async (id: string, orderData: Partial<CreatePSBOrderRequest>): Promise<{ success: boolean; data: PSBOrder }> => {
    try {
      console.log('PSB API: Updating order:', id, orderData);
      const response = await apiClient.put(`${API_ENDPOINTS.PSB.ORDERS}/${id}`, orderData);
      console.log('PSB API: Update response:', response.data);
      return response.data as { success: boolean; data: PSBOrder };
    } catch (error) {
      console.error('PSB API: Error updating order:', error);
      throw error;
    }
  },

  // Delete PSB order
  deleteOrder: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('PSB API: Deleting order:', id);
      const response = await apiClient.delete(`${API_ENDPOINTS.PSB.ORDERS}/${id}`);
      console.log('PSB API: Delete response:', response.data);
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error('PSB API: Error deleting order:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<{ success: boolean; data: PSBOrder }> => {
    try {
      console.log('PSB API: Fetching order by ID:', id);
      const response = await apiClient.get(`${API_ENDPOINTS.PSB.ORDERS}/${id}`);
      console.log('PSB API: Order by ID response:', response.data);
      return response.data as { success: boolean; data: PSBOrder };
    } catch (error) {
      console.error('PSB API: Error fetching order by ID:', error);
      throw error;
    }
  },

  // Health check for PSB API
  healthCheck: async (): Promise<{ success: boolean; status: string }> => {
    try {
      console.log('PSB API: Health check');
      const response = await apiClient.get('/health');
      console.log('PSB API: Health check response:', response.data);
      return { success: true, status: 'OK' };
    } catch (error) {
      console.error('PSB API: Health check failed:', error);
      return { success: false, status: 'ERROR' };
    }
  }
};