import api from '../../lib/http/api';
import { PaginatedResponse } from '@/app/types/common';
import {
  Veterinarian,
  VetReview,
  CreateVeterinarianRequest,
  UpdateVeterinarianRequest,
  VeterinarianSearchParams,
  CreateVetReviewRequest,
} from './models';

const BASE_PATH = '/veterinarians';

export const veterinarianService = {
  /**
   * Search veterinarians with filters and pagination
   */
  async searchVeterinarians(params: VeterinarianSearchParams): Promise<PaginatedResponse<Veterinarian>> {
    const response = await api.get<PaginatedResponse<Veterinarian>>(`${BASE_PATH}/search`, { params });
    return response.data;
  },

  /**
   * Get top-rated veterinarians
   */
  async getTopRatedVeterinarians(page = 0, size = 10): Promise<PaginatedResponse<Veterinarian>> {
    const response = await api.get<PaginatedResponse<Veterinarian>>(`${BASE_PATH}/top-rated`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get veterinarian details by ID
   */
  async getVeterinarianById(id: number): Promise<Veterinarian> {
    const response = await api.get<Veterinarian>(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Create new veterinarian profile (requires VETERINARIAN role)
   */
  async createVeterinarian(data: CreateVeterinarianRequest): Promise<Veterinarian> {
    const response = await api.post<Veterinarian>(BASE_PATH, data);
    return response.data;
  },

  /**
   * Update veterinarian profile (requires VETERINARIAN role and ownership)
   */
  async updateVeterinarian(id: number, data: UpdateVeterinarianRequest): Promise<Veterinarian> {
    const response = await api.put<Veterinarian>(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Delete veterinarian profile (requires VETERINARIAN role and ownership)
   */
  async deleteVeterinarian(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  /**
   * Get veterinarian reviews
   */
  async getVeterinarianReviews(vetId: number, page = 0, size = 10): Promise<PaginatedResponse<VetReview>> {
    const response = await api.get<PaginatedResponse<VetReview>>(`${BASE_PATH}/${vetId}/reviews`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Create veterinarian review (requires authentication)
   */
  async createReview(vetId: number, data: CreateVetReviewRequest): Promise<VetReview> {
    const response = await api.post<VetReview>(`${BASE_PATH}/${vetId}/reviews`, data);
    return response.data;
  },

  /**
   * Get veterinarians by specialty
   */
  async getVeterinariansBySpecialty(
    specialty: string,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Veterinarian>> {
    const response = await api.get<PaginatedResponse<Veterinarian>>(`${BASE_PATH}/specialty/${specialty}`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get veterinarians by location
   */
  async getVeterinariansByLocation(
    city: string,
    state: string,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Veterinarian>> {
    const response = await api.get<PaginatedResponse<Veterinarian>>(`${BASE_PATH}/location`, {
      params: { city, state, page, size },
    });
    return response.data;
  },
};
