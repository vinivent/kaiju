export enum UserRole {
  USER = 'USER',
  VETERINARIAN = 'VETERINARIAN',
  SELLER = 'SELLER',
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN',
}

export enum ProductCategory {
  FOOD = 'FOOD',
  HABITAT = 'HABITAT',
  HEATING = 'HEATING',
  LIGHTING = 'LIGHTING',
  ACCESSORIES = 'ACCESSORIES',
  HEALTHCARE = 'HEALTHCARE',
  BOOKS = 'BOOKS',
  DECORATION = 'DECORATION'
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum ReptileSpecialty {
  SNAKES = 'SNAKES',
  LIZARDS = 'LIZARDS',
  TURTLES = 'TURTLES',
  CROCODILIANS = 'CROCODILIANS',
  AMPHIBIANS = 'AMPHIBIANS',
  GENERAL = 'GENERAL',
}

export enum VetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  VACATION = 'VACATION',
}

export enum LocationType {
  VETERINARY_CLINIC = 'VETERINARY_CLINIC',
  EMERGENCY_HOSPITAL = 'EMERGENCY_HOSPITAL',
  SPECIALTY_CENTER = 'SPECIALTY_CENTER',
  PET_STORE = 'PET_STORE',
  RESCUE_CENTER = 'RESCUE_CENTER',
}

export enum LocationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TEMPORARILY_CLOSED = 'TEMPORARILY_CLOSED',
}

export enum ArticleCategory {
  CARE_GUIDE = 'CARE_GUIDE',
  HEALTH = 'HEALTH',
  NUTRITION = 'NUTRITION',
  HABITAT_SETUP = 'HABITAT_SETUP',
  BREEDING = 'BREEDING',
  BEHAVIOR = 'BEHAVIOR',
  SPECIES_PROFILE = 'SPECIES_PROFILE',
  NEWS = 'NEWS',
}

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
};

