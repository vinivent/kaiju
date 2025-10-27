import api from '@/lib/http/api';
import { PaginatedResponse } from '@/app/types/common';
import {
  HealthcareLocation,
  LocationReview,
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationSearchParams,
  CreateLocationReviewRequest,
} from './model';

const BASE_PATH = '/locations';

export const healthcareLocationService = {
  /**
   * Search healthcare locations with filters and pagination
   */
  async searchLocations(params: LocationSearchParams): Promise<PaginatedResponse<HealthcareLocation>> {
    const response = await api.get<PaginatedResponse<HealthcareLocation>>(`${BASE_PATH}/search`, { params });
    return response.data;
  },

  /**
   * Find nearby locations based on coordinates
   */
  async findNearbyLocations(
    latitude: number,
    longitude: number,
    radius = 10,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<HealthcareLocation>> {
    const response = await api.get<PaginatedResponse<HealthcareLocation>>(`${BASE_PATH}/nearby`, {
      params: { latitude, longitude, radius, page, size },
    });
    return response.data;
  },

  /**
   * Get emergency locations
   */
  async getEmergencyLocations(page = 0, size = 10): Promise<PaginatedResponse<HealthcareLocation>> {
    const response = await api.get<PaginatedResponse<HealthcareLocation>>(`${BASE_PATH}/emergency`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get location details by ID
   */
  async getLocationById(id: number): Promise<HealthcareLocation> {
    const response = await api.get<HealthcareLocation>(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Create new location (requires ADMIN role)
   */
  async createLocation(data: CreateLocationRequest): Promise<HealthcareLocation> {
    const response = await api.post<HealthcareLocation>(BASE_PATH, data);
    return response.data;
  },

  /**
   * Update location (requires ADMIN role)
   */
  async updateLocation(id: number, data: UpdateLocationRequest): Promise<HealthcareLocation> {
    const response = await api.put<HealthcareLocation>(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Delete location (requires ADMIN role)
   */
  async deleteLocation(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  /**
   * Get location reviews
   */
  async getLocationReviews(locationId: number, page = 0, size = 10): Promise<PaginatedResponse<LocationReview>> {
    const response = await api.get<PaginatedResponse<LocationReview>>(`${BASE_PATH}/${locationId}/reviews`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Create location review (requires authentication)
   */
  async createReview(locationId: number, data: CreateLocationReviewRequest): Promise<LocationReview> {
    const response = await api.post<LocationReview>(`${BASE_PATH}/${locationId}/reviews`, data);
    return response.data;
  },

  /**
   * Get locations by type
   */
  async getLocationsByType(type: string, page = 0, size = 10): Promise<PaginatedResponse<HealthcareLocation>> {
    const response = await api.get<PaginatedResponse<HealthcareLocation>>(`${BASE_PATH}/type/${type}`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get locations by city and state
   */
  async getLocationsByArea(
    city: string,
    state: string,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<HealthcareLocation>> {
    const response = await api.get<PaginatedResponse<HealthcareLocation>>(`${BASE_PATH}/area`, {
      params: { city, state, page, size },
    });
    return response.data;
  },
};
