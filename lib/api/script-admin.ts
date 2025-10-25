import axiosInstance from '../axios';
import {
  ScriptAdminProfile,
  ScriptAdminCustomization,
  PaymentSession,
  SubdomainCheck,
  SubdomainSuggestion,
  PaymentData,
  ScriptAdminStats,
  UpdateScriptAdminStatus,
  ApiResponse,
  PaginatedResponse,
  ScriptAdminRegistrationForm,
  ScriptAdminLoginForm,
} from '../../types/script-admin';

// Script Admin API Functions
export const scriptAdminApi = {
  // Authentication
  async register(data: ScriptAdminRegistrationForm): Promise<ApiResponse<{ token: string; user: ScriptAdminProfile }>> {
    const response = await axiosInstance.post<ApiResponse<{ token: string; user: ScriptAdminProfile }>>(
      '/script-admin/register',
      data
    );
    return response.data;
  },

  async login(data: ScriptAdminLoginForm): Promise<ApiResponse<{ token: string; user: ScriptAdminProfile }>> {
    const response = await axiosInstance.post<ApiResponse<{ token: string; user: ScriptAdminProfile }>>(
      '/script-admin/login',
      data
    );
    return response.data;
  },

  async getProfile(): Promise<ApiResponse<ScriptAdminProfile>> {
    const response = await axiosInstance.get<ApiResponse<ScriptAdminProfile>>('/script-admin/profile');
    return response.data;
  },

  async updateProfile(data: { name?: string; email?: string }): Promise<ApiResponse<ScriptAdminProfile>> {
    const response = await axiosInstance.put<ApiResponse<ScriptAdminProfile>>('/script-admin/profile', data);
    return response.data;
  },

  // Customization
  async updateCustomization(data: ScriptAdminCustomization): Promise<ApiResponse<{ scriptAdminProfile: any }>> {
    const response = await axiosInstance.put<ApiResponse<{ scriptAdminProfile: any }>>('/script-admin/customization', data);
    return response.data;
  },

  async getPanelUrl(): Promise<ApiResponse<{ panelUrl: string }>> {
    const response = await axiosInstance.get<ApiResponse<{ panelUrl: string }>>('/script-admin/panel-url');
    return response.data;
  },

  // Subdomain Management
  async checkSubdomain(subdomain: string): Promise<ApiResponse<SubdomainCheck>> {
    const response = await axiosInstance.post<ApiResponse<SubdomainCheck>>('/script-admin/check-subdomain', { subdomain });
    return response.data;
  },

  async getSubdomainSuggestions(baseName: string): Promise<ApiResponse<{ suggestions: SubdomainSuggestion[] }>> {
    const response = await axiosInstance.get<ApiResponse<{ suggestions: SubdomainSuggestion[] }>>(
      `/script-admin/subdomain-suggestions?baseName=${encodeURIComponent(baseName)}`
    );
    return response.data;
  },

  // Payment
  async processPayment(data: PaymentData): Promise<ApiResponse<PaymentSession>> {
    const response = await axiosInstance.post<ApiResponse<PaymentSession>>('/script-admin/payment', data);
    return response.data;
  },
};

// Master Admin API Functions
export const masterAdminApi = {
  async getAllScriptAdmins(): Promise<ApiResponse<ScriptAdminProfile[]>> {
    const response = await axiosInstance.get<ApiResponse<ScriptAdminProfile[]>>('/master-admin/script-admins');
    return response.data;
  },

  async getScriptAdminStats(): Promise<ApiResponse<ScriptAdminStats>> {
    const response = await axiosInstance.get<ApiResponse<ScriptAdminStats>>('/master-admin/script-admins/stats');
    return response.data;
  },

  async getScriptAdminById(id: string): Promise<ApiResponse<ScriptAdminProfile>> {
    const response = await axiosInstance.get<ApiResponse<ScriptAdminProfile>>(`/master-admin/script-admins/${id}`);
    return response.data;
  },

  async updateScriptAdminStatus(id: string, data: UpdateScriptAdminStatus): Promise<ApiResponse<ScriptAdminProfile>> {
    const response = await axiosInstance.put<ApiResponse<ScriptAdminProfile>>(`/master-admin/script-admins/${id}/status`, data);
    return response.data;
  },

  async updateScriptAdminProfile(id: string, data: { name?: string; email?: string }): Promise<ApiResponse<ScriptAdminProfile>> {
    const response = await axiosInstance.put<ApiResponse<ScriptAdminProfile>>(`/master-admin/script-admins/${id}/profile`, data);
    return response.data;
  },

  async deleteScriptAdmin(id: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/master-admin/script-admins/${id}`);
    return response.data;
  },

  async getScriptAdminPaymentHistory(id: string): Promise<ApiResponse<{
    isPaid: boolean;
    stripeCustomerId?: string;
    paymentDate?: string;
    amount: number;
    currency: string;
  }>> {
    const response = await axiosInstance.get<ApiResponse<{
      isPaid: boolean;
      stripeCustomerId?: string;
      paymentDate?: string;
      amount: number;
      currency: string;
    }>>(`/master-admin/script-admins/${id}/payments`);
    return response.data;
  },
};

// Webhook API (for health checks)
export const webhookApi = {
  async getWebhookHealth(): Promise<ApiResponse<{ message: string; timestamp: string }>> {
    const response = await axiosInstance.get<ApiResponse<{ message: string; timestamp: string }>>('/webhooks/health');
    return response.data;
  },
};
