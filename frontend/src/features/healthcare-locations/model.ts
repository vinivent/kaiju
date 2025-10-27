import { LocationType, LocationStatus } from "@/app/types/common";

// Healthcare Location domain models
export interface HealthcareLocation {
  id: number;
  name: string;
  type: LocationType;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  emergencyService: boolean;
  hours24: boolean;
  acceptsInsurance: boolean;
  status: LocationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LocationReview {
  id: number;
  locationId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Request/Response DTOs
export interface CreateLocationRequest {
  name: string;
  type: LocationType;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  emergencyService: boolean;
  hours24: boolean;
  acceptsInsurance: boolean;
}

export interface UpdateLocationRequest {
  name?: string;
  type?: LocationType;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  emergencyService?: boolean;
  hours24?: boolean;
  acceptsInsurance?: boolean;
  status?: LocationStatus;
}

export interface LocationSearchParams {
  query?: string;
  type?: LocationType;
  city?: string;
  state?: string;
  emergencyService?: boolean;
  hours24?: boolean;
  acceptsInsurance?: boolean;
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  status?: LocationStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CreateLocationReviewRequest {
  rating: number;
  comment: string;
}
