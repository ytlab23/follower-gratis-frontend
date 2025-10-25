import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scriptAdminApi } from '../lib/api/script-admin';
import {
  ScriptAdminProfile,
  ScriptAdminCustomization,
  PaymentData,
  ScriptAdminRegistrationForm,
  ScriptAdminLoginForm,
  ApiResponse,
} from '../types/script-admin';

// Query keys
export const scriptAdminKeys = {
  all: ['script-admin'] as const,
  profile: () => [...scriptAdminKeys.all, 'profile'] as const,
  panelUrl: () => [...scriptAdminKeys.all, 'panel-url'] as const,
  subdomainSuggestions: (baseName: string) => [...scriptAdminKeys.all, 'subdomain-suggestions', baseName] as const,
};

// Custom hook for script admin profile
export function useScriptAdminProfile() {
  return useQuery({
    queryKey: scriptAdminKeys.profile(),
    queryFn: () => scriptAdminApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook for script admin panel URL
export function useScriptAdminPanelUrl() {
  return useQuery({
    queryKey: scriptAdminKeys.panelUrl(),
    queryFn: () => scriptAdminApi.getPanelUrl(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Custom hook for subdomain suggestions
export function useSubdomainSuggestions(baseName: string) {
  return useQuery({
    queryKey: scriptAdminKeys.subdomainSuggestions(baseName),
    queryFn: () => scriptAdminApi.getSubdomainSuggestions(baseName),
    enabled: !!baseName && baseName.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Mutation hooks
export function useScriptAdminRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScriptAdminRegistrationForm) => scriptAdminApi.register(data),
    onSuccess: (response: ApiResponse<{ token: string; user: ScriptAdminProfile }>) => {
      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        // Invalidate and refetch profile
        queryClient.invalidateQueries({ queryKey: scriptAdminKeys.profile() });
      }
    },
  });
}

export function useScriptAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScriptAdminLoginForm) => scriptAdminApi.login(data),
    onSuccess: (response: ApiResponse<{ token: string; user: ScriptAdminProfile }>) => {
      if (response.success && response.data?.token) {
        localStorage.setItem('token', response.data.token);
        // Invalidate and refetch profile
        queryClient.invalidateQueries({ queryKey: scriptAdminKeys.profile() });
      }
    },
  });
}

export function useUpdateScriptAdminProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; email?: string }) => scriptAdminApi.updateProfile(data),
    onSuccess: () => {
      // Invalidate and refetch profile
      queryClient.invalidateQueries({ queryKey: scriptAdminKeys.profile() });
    },
  });
}

export function useUpdateScriptAdminCustomization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScriptAdminCustomization) => scriptAdminApi.updateCustomization(data),
    onSuccess: () => {
      // Invalidate and refetch profile to get updated customization
      queryClient.invalidateQueries({ queryKey: scriptAdminKeys.profile() });
      queryClient.invalidateQueries({ queryKey: scriptAdminKeys.panelUrl() });
    },
  });
}

export function useCheckSubdomain() {
  return useMutation({
    mutationFn: (subdomain: string) => scriptAdminApi.checkSubdomain(subdomain),
  });
}

export function useProcessPayment() {
  return useMutation({
    mutationFn: (data: PaymentData) => scriptAdminApi.processPayment(data),
  });
}

// Utility hook for script admin authentication status
export function useScriptAdminAuth() {
  const { data: profileResponse, isLoading, error } = useScriptAdminProfile();

  return {
    isAuthenticated: !!profileResponse?.success,
    profile: profileResponse?.data,
    isLoading,
    error,
    isActive: profileResponse?.data?.isActive || false,
    isPaid: profileResponse?.data?.scriptAdminProfile?.isPaid || false,
  };
}
