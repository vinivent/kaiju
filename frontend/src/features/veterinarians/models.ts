import { ReptileSpecialty, VetStatus } from "@/app/types/common";

// VeterinarianSpecialization enum matching backend
export enum VeterinarianSpecialization {
  REPTILE_GENERAL = "REPTILE_GENERAL",
  HERPETOLOGY = "HERPETOLOGY",
  EXOTIC_ANIMALS = "EXOTIC_ANIMALS",
  REPTILE_SURGERY = "REPTILE_SURGERY",
  REPTILE_NUTRITION = "REPTILE_NUTRITION",
  REPTILE_EMERGENCY = "REPTILE_EMERGENCY",
  REPTILE_DERMATOLOGY = "REPTILE_DERMATOLOGY",
  REPTILE_BEHAVIOR = "REPTILE_BEHAVIOR",
  SNAKE_SPECIALIST = "SNAKE_SPECIALIST",
  LIZARD_SPECIALIST = "LIZARD_SPECIALIST",
  TURTLE_TORTOISE = "TURTLE_TORTOISE",
  CROCODILIAN = "CROCODILIAN",
  BREEDING_GENETICS = "BREEDING_GENETICS",
}

// Veterinarian domain models
export interface Veterinarian {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
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

// Request/Response DTOs - matches backend VeterinarianRequestDTO
export interface CreateVeterinarianRequest {
  fullName: string;
  licenseNumber: string;
  specializations: VeterinarianSpecialization[];
  bio?: string;
  contactEmail: string;
  phoneNumber?: string;
  clinicName?: string;
  clinicAddress?: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  yearsOfExperience?: number;
  certifications?: string[];
  languagesSpoken?: string[];
  profilePicture?: string;
  isAvailableForChat?: boolean;
  acceptsNewPatients?: boolean;
}

// Form data interface - for form collection
export interface CreateVeterinarianFormData {
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
  sortDirection?: "asc" | "desc";
}

export interface CreateVetReviewRequest {
  rating: number;
  comment: string;
}
