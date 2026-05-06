import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchesService, CreateBranchDto, UpdateBranchDto } from '@/lib/services/branches';

export const branchKeys = {
  all: ['branches'] as const,
  lists: () => [...branchKeys.all, 'list'] as const,
  adminList: () => [...branchKeys.all, 'admin'] as const,
  detail: (id: number) => [...branchKeys.all, 'detail', id] as const,
};

/** Public hook: active branches only — for checkout */
export function useBranches() {
  return useQuery({
    queryKey: branchKeys.lists(),
    queryFn: () => branchesService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

/** Admin hook: all branches including inactive */
export function useAdminBranches() {
  return useQuery({
    queryKey: branchKeys.adminList(),
    queryFn: () => branchesService.getAllAdmin(),
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBranchDto) => branchesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
    },
  });
}

export function useUpdateBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBranchDto }) =>
      branchesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
    },
  });
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => branchesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.all });
    },
  });
}
