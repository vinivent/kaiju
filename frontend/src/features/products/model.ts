import { ProductCategory, ProductStatus } from "@/app/types/common";
import { UUID } from "crypto";

export interface Product {
  productId: UUID;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  status: ProductStatus;
  images: string[];
  stockQuantity: number;
  sellerId: string;
  sellerName: string;
  brand?: string;
  manufacturer?: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: number;
  productId: string;
  userId: string; 
  userName: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  status: ProductStatus;
  images?: string[];
  stockQuantity: number;
  brand?: string;
  manufacturer?: string;
  tags?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  category?: ProductCategory;
  price?: number;
  images?: string[];
  stockQuantity?: number;
  status?: ProductStatus;
}

export interface ProductSearchParams {
  query?: string;
  category?: ProductCategory;
  status?: ProductStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CreateReviewRequest {
  rating: number;
  comment: string;
}