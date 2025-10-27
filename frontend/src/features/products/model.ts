import { ProductCategory, ProductStatus } from "@/app/types/common";

export interface Product {
  id: number;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  currency: string;
  imageUrl?: string;
  stock: number;
  sellerId: number;
  sellerName: string;
  status: ProductStatus;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
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
  currency: string;
  imageUrl?: string;
  stock: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  category?: ProductCategory;
  price?: number;
  imageUrl?: string;
  stock?: number;
  status?: ProductStatus;
  featured?: boolean;
}

export interface ProductSearchParams {
  query?: string;
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  sellerId?: number;
  featured?: boolean;
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
