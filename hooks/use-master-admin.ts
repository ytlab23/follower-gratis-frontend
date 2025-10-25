import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { masterAdminApi } from '../lib/api/script-admin';
import {
  ScriptAdminProfile,
  ScriptAdminStats,
  UpdateScriptAdminStatus,
  ApiResponse,
} from '../types/script-admin';

// Query keys
export const masterAdminKeys = {
  all: ['master-admin'] as const,
  scriptAdmins: () => [...masterAdminKeys.all, 'script-admins'] as const,
  scriptAdminStats: () => [...masterAdminKeys.all, 'stats'] as const,
  scriptAdmin: (id: string) => [...masterAdminKeys.all, 'script-admin', id] as const,
};

// Custom hook for all script admins
export function useAllScriptAdmins() {
  return useQuery({
    queryKey: masterAdminKeys.scriptAdmins(),
    queryFn: () => masterAdminApi.getAllScriptAdmins(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Custom hook for script admin statistics
export function useScriptAdminStats() {
  return useQuery({
    queryKey: masterAdminKeys.scriptAdminStats(),
    queryFn: () => masterAdminApi.getScriptAdminStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Custom hook for single script admin
export function useScriptAdmin(id: string) {
  return useQuery({
    queryKey: masterAdminKeys.scriptAdmin(id),
    queryFn: () => masterAdminApi.getScriptAdminById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Mutation hooks
export function useUpdateScriptAdminStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScriptAdminStatus }) =>
      masterAdminApi.updateScriptAdminStatus(id, data),
    onSuccess: () => {
      // Invalidate and refetch script admins and stats
      queryClient.invalidateQueries({ queryKey: masterAdminKeys.scriptAdmins() });
      queryClient.invalidateQueries({ queryKey: masterAdminKeys.scriptAdminStats() });
    },
  });
}

export function useUpdateScriptAdminProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; email?: string } }) =>
      masterAdminApi.updateScriptAdminProfile(id, data),
    onSuccess: () => {
      // Invalidate and refetch script admins
      queryClient.invalidateQueries({ queryKey: masterAdminKeys.scriptAdmins() });
    },
  });
}

export function useDeleteScriptAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => masterAdminApi.deleteScriptAdmin(id),
    onSuccess: () => {
      // Invalidate and refetch script admins and stats
      queryClient.invalidateQueries({ queryKey: masterAdminKeys.scriptAdmins() });
      queryClient.invalidateQueries({ queryKey: masterAdminKeys.scriptAdminStats() });
    },
  });
}

// Combined hook for master admin dashboard
export function useMasterAdminApi() {
  const scriptAdminsQuery = useAllScriptAdmins();
  const statsQuery = useScriptAdminStats();
  const updateStatus = useUpdateScriptAdminStatus();
  const deleteScriptAdmin = useDeleteScriptAdmin();

  return {
    scriptAdmins: scriptAdminsQuery.data?.data,
    stats: statsQuery.data?.data,
    isLoading: scriptAdminsQuery.isLoading || statsQuery.isLoading,
    error: scriptAdminsQuery.error || statsQuery.error,
    updateStatus,
    deleteScriptAdmin,
    refreshData: () => {
      scriptAdminsQuery.refetch();
      statsQuery.refetch();
    },
  };
}
