import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deliveryService,
  DeliveryCalculationResult,
  CreateDeliverySlabDto,
  UpdateDeliverySlabDto,
  UpdateDeliverySettingsDto,
} from '@/lib/services/delivery';

const QUERY_KEYS = {
  settings: ['delivery', 'settings'] as const,
  slabs: ['delivery', 'slabs'] as const,
};

// ── Public ────────────────────────────────────────────────────────────────────

/**
 * Mutation to calculate delivery fee based on user coordinates.
 * Call `.mutateAsync({ lat, lng })` from the checkout page.
 */
export function useCalculateDelivery() {
  return useMutation<DeliveryCalculationResult, Error, { lat: number; lng: number }>({
    mutationFn: ({ lat, lng }) => deliveryService.calculate(lat, lng),
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useDeliverySettings() {
  return useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: deliveryService.getSettings,
    staleTime: 60_000,
  });
}

export function useUpdateDeliverySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateDeliverySettingsDto) =>
      deliveryService.updateSettings(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.settings });
    },
  });
}

export function useDeliverySlabs() {
  return useQuery({
    queryKey: QUERY_KEYS.slabs,
    queryFn: deliveryService.getSlabs,
    staleTime: 60_000,
  });
}

export function useCreateDeliverySlab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDeliverySlabDto) =>
      deliveryService.createSlab(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.slabs });
    },
  });
}

export function useUpdateDeliverySlab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeliverySlabDto }) =>
      deliveryService.updateSlab(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.slabs });
    },
  });
}

export function useDeleteDeliverySlab() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deliveryService.deleteSlab(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.slabs });
    },
  });
}
