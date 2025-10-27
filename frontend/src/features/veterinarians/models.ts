import { ReptileSpecialty, VetStatus } from "@/app/types/common";

// Veterinarian domain models
export interface Veterinarian {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialties: ReptileSpecialty[];
  yearsOfExperience: number;
  clinicName: string;
  clinicAddress: string;
  city: string;
  state: string;
  zipCode: string;
  bio: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  availableForOnlineConsultation: boolean;
  status: VetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VetReview {
  id: number;
  veterinarianId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Request/Response DTOs
export interface CreateVeterinarianRequest {
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialties: ReptileSpecialty[];
  yearsOfExperience: number;
  clinicName: string;
  clinicAddress: string;
  city: string;
  state: string;
  zipCode: string;
  bio: string;
  imageUrl?: string;
  consultationFee: number;
  availableForOnlineConsultation: boolean;
}

export interface UpdateVeterinarianRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  specialties?: ReptileSpecialty[];
  yearsOfExperience?: number;
  clinicName?: string;
  clinicAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bio?: string;
  imageUrl?: string;
  consultationFee?: number;
  availableForOnlineConsultation?: boolean;
  status?: VetStatus;
}

export interface VeterinarianSearchParams {
  query?: string;
  specialty?: ReptileSpecialty;
  city?: string;
  state?: string;
  minExperience?: number;
  onlineConsultation?: boolean;
  status?: VetStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CreateVetReviewRequest {
  rating: number;
  comment: string;
}
