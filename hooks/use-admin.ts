import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../lib/api/admin';
import {
  AdminProfile,
  AdminCustomization,
  PaymentData,
  AdminRegistrationForm,
  AdminLoginForm,
  ApiResponse,
} from '../types/admin';

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  profile: () => [...adminKeys.all, 'profile'] as const,
  panelUrl: () => [...adminKeys.all, 'panel-url'] as const,
  subdomainSuggestions: (baseName: string) => [...adminKeys.all, 'subdomain-suggestions', baseName] as const,
};

// Custom hook for admin profile
export function useAdminProfile() {
  return useQuery({
    queryKey: adminKeys.profile(),
    queryFn: () => adminApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook for admin panel URL
export function useAdminPanelUrl() {
  return useQuery({
    queryKey: adminKeys.panelUrl(),
    queryFn: () => adminApi.getPanelUrl(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Custom hook for subdomain suggestions
export function useSubdomainSuggestions(baseName: string) {
  return useQuery({
    queryKey: adminKeys.subdomainSuggestions(baseName),
    queryFn: () => adminApi.getSubdomainSuggestions(baseName),
    enabled: !!baseName && baseName.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Mutation hooks
export function useAdminRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminRegistrationForm) => adminApi.register(data),
    onSuccess: (response: ApiResponse<{ token: string; user: AdminProfile }>) => {
      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        // Invalidate and refetch profile
        queryClient.invalidateQueries({ queryKey: adminKeys.profile() });
      }
    },
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminLoginForm) => adminApi.login(data),
    onSuccess: (response: ApiResponse<{ token: string; user: AdminProfile }>) => {
      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        // Invalidate and refetch profile
        queryClient.invalidateQueries({ queryKey: adminKeys.profile() });
      }
    },
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; email?: string }) => adminApi.updateProfile(data),
    onSuccess: () => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: adminKeys.profile() });
    },
  });
}

export function useUpdateAdminCustomization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminCustomization) => adminApi.updateCustomization(data),
    onSuccess: () => {
      // Invalidate and refetch profile to get updated customization
      queryClient.invalidateQueries({ queryKey: adminKeys.profile() });
      queryClient.invalidateQueries({ queryKey: adminKeys.panelUrl() });
    },
  });
}

export function useCheckSubdomain() {
  return useMutation({
    mutationFn: (subdomain: string) => adminApi.checkSubdomain(subdomain),
  });
}

export function useProcessPayment() {
  return useMutation({
    mutationFn: (data: PaymentData) => adminApi.processPayment(data),
  });
}

// Utility hook for admin authentication status
export function useAdminAuth() {
  const { data: profileResponse, isLoading, error } = useAdminProfile();

  return {
    isAuthenticated: !!profileResponse?.success,
    profile: profileResponse?.data,
    isLoading,
    error,
    isActive: profileResponse?.data?.isActive || false,
    isPaid: profileResponse?.data?.adminProfile?.isPaid || false,
  };
}
