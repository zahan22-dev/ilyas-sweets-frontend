import { apiClient } from '../axios';

export type DeliveryPricingMode = 'PER_KM' | 'DISTANCE_SLAB';

export interface DeliveryCalculationResult {
  branchId: number;
  branchName: string;
  distanceKm: number;
  fee: number;
  pricingMode: DeliveryPricingMode;
}

export interface DeliverySettings {
  id: number;
  pricingMode: DeliveryPricingMode;
  pricePerKm: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeliverySlab {
  id: number;
  minKm: number;
  maxKm: number;
  fee: number;
}

export interface UpdateDeliverySettingsDto {
  pricingMode?: DeliveryPricingMode;
  pricePerKm?: number;
}

export interface CreateDeliverySlabDto {
  minKm: number;
  maxKm: number;
  fee: number;
}

export interface UpdateDeliverySlabDto {
  minKm?: number;
  maxKm?: number;
  fee?: number;
}

export const deliveryService = {
  /**
   * Calculate delivery fee based on user coordinates.
   * Public endpoint — no auth required.
   */
  calculate: (lat: number, lng: number): Promise<DeliveryCalculationResult> => {
    return apiClient.post('/delivery/calculate', { lat, lng });
  },

  // ── Admin ─────────────────────────────────────────────────────────────────

  getSettings: (): Promise<DeliverySettings> => {
    return apiClient.get('/delivery/settings');
  },

  updateSettings: (data: UpdateDeliverySettingsDto): Promise<DeliverySettings> => {
    return apiClient.patch('/delivery/settings', data);
  },

  getSlabs: (): Promise<DeliverySlab[]> => {
    return apiClient.get('/delivery/slabs');
  },

  createSlab: (data: CreateDeliverySlabDto): Promise<DeliverySlab> => {
    return apiClient.post('/delivery/slabs', data);
  },

  updateSlab: (id: number, data: UpdateDeliverySlabDto): Promise<DeliverySlab> => {
    return apiClient.patch(`/delivery/slabs/${id}`, data);
  },

  deleteSlab: (id: number): Promise<void> => {
    return apiClient.delete(`/delivery/slabs/${id}`);
  },
};
