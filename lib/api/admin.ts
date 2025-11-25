import axiosInstance from '../axios';
import {
  AdminProfile,
  AdminCustomization,
  PaymentSession,
  AdminStats,
  UpdateAdminStatus,
  PaymentData,
  SubdomainSuggestion,
  AdminRegistrationForm,
  AdminLoginForm,
  ApiResponse,
} from '../../types/admin';

// Authentication
async function register(data: AdminRegistrationForm): Promise<ApiResponse<{ token: string; user: AdminProfile }>> {
  const response = await axiosInstance.post<ApiResponse<{ token: string; user: AdminProfile }>>(
    '/admin/register',
    data
  );
  return response.data;
}

async function login(data: AdminLoginForm): Promise<ApiResponse<{ token: string; user: AdminProfile }>> {
  const response = await axiosInstance.post<ApiResponse<{ token: string; user: AdminProfile }>>(
    '/admin/login',
    data
  );
  return response.data;
}

async function getProfile(): Promise<ApiResponse<AdminProfile>> {
  const response = await axiosInstance.get<ApiResponse<AdminProfile>>('/admin/profile');
  return response.data;
}

async function updateProfile(data: { name?: string; email?: string }): Promise<ApiResponse<AdminProfile>> {
  const response = await axiosInstance.put<ApiResponse<AdminProfile>>('/admin/profile', data);
  return response.data;
}

// Customization
async function updateCustomization(data: AdminCustomization): Promise<ApiResponse<{ adminProfile: any }>> {
  const response = await axiosInstance.put<ApiResponse<{ adminProfile: any }>>('/admin/customization', data);
  return response.data;
}

async function getPanelUrl(): Promise<ApiResponse<{ panelUrl: string }>> {
  const response = await axiosInstance.get<ApiResponse<{ panelUrl: string }>>('/admin/panel-url');
  return response.data;
}

// Subdomain
async function checkSubdomain(subdomain: string): Promise<ApiResponse<{ subdomain: string; available: boolean }>> {
  const response = await axiosInstance.post<ApiResponse<{ subdomain: string; available: boolean }>>('/admin/check-subdomain', {
    subdomain,
  });
  return response.data;
}

async function getSubdomainSuggestions(baseName: string): Promise<ApiResponse<SubdomainSuggestion[]>> {
  const response = await axiosInstance.get<ApiResponse<SubdomainSuggestion[]>>(`/admin/subdomain-suggestions?baseName=${baseName}`);
  return response.data;
}

// Payment
async function processPayment(data: PaymentData): Promise<ApiResponse<PaymentSession>> {
  const response = await axiosInstance.post<ApiResponse<PaymentSession>>('/admin/payment', data);
  return response.data;
}

// Master admin functions
export const masterAdminApi = {
  async getAllAdmins(): Promise<ApiResponse<AdminProfile[]>> {
    const response = await axiosInstance.get<ApiResponse<AdminProfile[]>>('/master-admin/admins');
    return response.data;
  },

  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    const response = await axiosInstance.get<ApiResponse<AdminStats>>('/master-admin/admins/stats');
    return response.data;
  },

  async getAdminById(id: string): Promise<ApiResponse<AdminProfile>> {
    const response = await axiosInstance.get<ApiResponse<AdminProfile>>(`/master-admin/admins/${id}`);
    return response.data;
  },

  async updateAdminStatus(id: string, data: UpdateAdminStatus): Promise<ApiResponse<AdminProfile>> {
    const response = await axiosInstance.put<ApiResponse<AdminProfile>>(`/master-admin/admins/${id}/status`, data);
    return response.data;
  },

  async updateAdminProfile(id: string, data: { name?: string; email?: string }): Promise<ApiResponse<AdminProfile>> {
    const response = await axiosInstance.put<ApiResponse<AdminProfile>>(`/master-admin/admins/${id}/profile`, data);
    return response.data;
  },

  async deleteAdmin(id: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/master-admin/admins/${id}`);
    return response.data;
  },

  async getAdminPaymentHistory(id: string): Promise<ApiResponse<{
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
    }>>(`/master-admin/admins/${id}/payments`);
    return response.data;
  },
};

export const adminApi = {
  register,
  login,
  getProfile,
  updateProfile,
  updateCustomization,
  getPanelUrl,
  checkSubdomain,
  getSubdomainSuggestions,
  processPayment,
};
