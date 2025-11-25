import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { masterAdminApi } from '../lib/api/admin';
import {
  AdminProfile,
  AdminStats,
  UpdateAdminStatus,
  ApiResponse,
} from '../types/admin';

// Query keys
export const masterAdminKeys = {
  all: ['master-admin'] as const,
  admins: () => [...masterAdminKeys.all, 'admins'] as const,
  adminStats: () => [...masterAdminKeys.all, 'stats'] as const,
  admin: (id: string) => [...masterAdminKeys.all, 'admin', id] as const,
};

// Custom hook for all admins
export function useAllAdmins() {
  return useQuery({
    queryKey: masterAdminKeys.admins(),
    queryFn: () => masterAdminApi.getAllAdmins(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Custom hook for admin statistics
export function useAdminStats() {
  return useQuery({
    queryKey: masterAdminKeys.adminStats(),
    queryFn: () => masterAdminApi.getAdminStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook for single admin
export function useAdmin(id: string) {
  return useQuery({
    queryKey: masterAdminKeys.admin(id),
    queryFn: () => masterAdminApi.getAdminById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Mutation hooks
export function useUpdateAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAdminStatus }) =>
      masterAdminApi.updateAdminStatus(id, data),
    onSuccess: () => {
      // Invalidate and refetch admins and stats
      queryClient.invalidateQueries({ queryKey: masterAdminKeys.admins() });
      queryClient.invalidateQueries({ queryKey: masterAdminKeys.adminStats() });
    },
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; email?: string } }) =>
      masterAdminApi.updateAdminProfile(id, data),
    onSuccess: () => {
      // Invalidate and refetch admins
      queryClient.invalidateQueries({ queryKey: masterAdminKeys.admins() });
    },
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => masterAdminApi.deleteAdmin(id),
    onSuccess: () => {
      // Invalidate and refetch admins and stats
      queryClient.invalidateQueries({ queryKey: masterAdminKeys.admins() });
      queryClient.invalidateQueries({ queryKey: masterAdminKeys.adminStats() });
    },
  });
}

// Combined hook for master admin dashboard
export function useMasterAdminApi() {
  const adminsQuery = useAllAdmins();
  const statsQuery = useAdminStats();
  const updateStatus = useUpdateAdminStatus();
  const deleteAdmin = useDeleteAdmin();

  return {
    admins: adminsQuery.data?.data,
    stats: statsQuery.data?.data,
    isLoading: adminsQuery.isLoading || statsQuery.isLoading,
    error: adminsQuery.error || statsQuery.error,
    updateStatus,
    deleteAdmin,
    refreshData: () => {
      adminsQuery.refetch();
      statsQuery.refetch();
    },
  };
}
