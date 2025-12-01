import api from "../../lib/http/api";
import { PaginatedResponse, ReptileSpecialty } from "@/app/types/common";
import {
  Veterinarian,
  VetReview,
  CreateVeterinarianRequest,
  CreateVeterinarianFormData,
  UpdateVeterinarianRequest,
  VeterinarianSearchParams,
  CreateVetReviewRequest,
  VeterinarianSpecialization,
} from "./models";

const BASE_PATH = "/veterinarians";

// Map ReptileSpecialty to VeterinarianSpecialization
function mapSpecialtyToSpecialization(
  specialty: ReptileSpecialty
): VeterinarianSpecialization {
  const mapping: Record<ReptileSpecialty, VeterinarianSpecialization> = {
    [ReptileSpecialty.GENERAL]: VeterinarianSpecialization.REPTILE_GENERAL,
    [ReptileSpecialty.SNAKES]: VeterinarianSpecialization.SNAKE_SPECIALIST,
    [ReptileSpecialty.LIZARDS]: VeterinarianSpecialization.LIZARD_SPECIALIST,
    [ReptileSpecialty.TURTLES]: VeterinarianSpecialization.TURTLE_TORTOISE,
    [ReptileSpecialty.CROCODILIANS]: VeterinarianSpecialization.CROCODILIAN,
    [ReptileSpecialty.AMPHIBIANS]: VeterinarianSpecialization.HERPETOLOGY,
  };
  return mapping[specialty] || VeterinarianSpecialization.REPTILE_GENERAL;
}

// Map form data to backend request DTO
function mapFormDataToRequest(
  formData: CreateVeterinarianFormData
): CreateVeterinarianRequest {
  return {
    fullName: formData.fullName,
    licenseNumber: formData.licenseNumber,
    specializations: formData.specialties.map(mapSpecialtyToSpecialization),
    bio: formData.bio || undefined,
    contactEmail: formData.email,
    phoneNumber: formData.phone || undefined,
    clinicName: formData.clinicName || undefined,
    clinicAddress: formData.clinicAddress || undefined,
    city: formData.city,
    state: formData.state,
    zipCode: formData.zipCode || undefined,
    country: "Brasil", // Default to Brazil, can be made configurable
    yearsOfExperience: formData.yearsOfExperience || undefined,
    profilePicture: formData.imageUrl || undefined,
    isAvailableForChat: formData.availableForOnlineConsultation || false,
    acceptsNewPatients: true, // Default to true
    consultationFee:
      formData.consultationFee > 0 ? formData.consultationFee : undefined,
  };
}

export const veterinarianService = {
  /**
   * Search veterinarians with filters and pagination
   */
  async searchVeterinarians(
    params: VeterinarianSearchParams
  ): Promise<PaginatedResponse<Veterinarian>> {
    const response = await api.get<PaginatedResponse<Veterinarian>>(
      `${BASE_PATH}/search`,
      { params }
    );
    return response.data;
  },

  /**
   * Get top-rated veterinarians
   */
  async getTopRatedVeterinarians(
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Veterinarian>> {
    const response = await api.get<PaginatedResponse<Veterinarian>>(
      `${BASE_PATH}/top-rated`,
      {
        params: { page, size },
      }
    );
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
  async createVeterinarian(
    data: CreateVeterinarianFormData | CreateVeterinarianRequest
  ): Promise<Veterinarian> {
    // Check if it's form data (has 'email' field) or already a request DTO
    const isFormData = "email" in data;
    const requestData = isFormData
      ? mapFormDataToRequest(data as CreateVeterinarianFormData)
      : (data as CreateVeterinarianRequest);

    const response = await api.post<Veterinarian>(BASE_PATH, requestData);
    return response.data;
  },

  /**
   * Update veterinarian profile (requires VETERINARIAN role and ownership)
   */
  async updateVeterinarian(
    id: number,
    data: UpdateVeterinarianRequest
  ): Promise<Veterinarian> {
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
  async getVeterinarianReviews(
    vetId: number,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<VetReview>> {
    const response = await api.get<PaginatedResponse<VetReview>>(
      `${BASE_PATH}/${vetId}/reviews`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  /**
   * Create veterinarian review (requires authentication)
   */
  async createReview(
    vetId: number,
    data: CreateVetReviewRequest
  ): Promise<VetReview> {
    const response = await api.post<VetReview>(
      `${BASE_PATH}/${vetId}/reviews`,
      data
    );
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
    const response = await api.get<PaginatedResponse<Veterinarian>>(
      `${BASE_PATH}/specialty/${specialty}`,
      {
        params: { page, size },
      }
    );
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
    const response = await api.get<PaginatedResponse<Veterinarian>>(
      `${BASE_PATH}/location`,
      {
        params: { city, state, page, size },
      }
    );
    return response.data;
  },
};
