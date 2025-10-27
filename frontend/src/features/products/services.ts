import api from '@/lib/http/api';
import { PaginatedResponse } from '@/app/types/common';
import {
  Product,
  ProductReview,
  CreateProductRequest,
  UpdateProductRequest,
  ProductSearchParams,
  CreateReviewRequest,
} from './model';

const BASE_PATH = '/products';

export const productService = {
  /**
   * Search products with filters and pagination
   */
  async searchProducts(params: ProductSearchParams): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>(`${BASE_PATH}/search`, { params });
    return response.data;
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(page = 0, size = 12): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>(`${BASE_PATH}/featured`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get product details by ID
   */
  async getProductById(id: number): Promise<Product> {
    const response = await api.get<Product>(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Create new product (requires SELLER role)
   */
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await api.post<Product>(BASE_PATH, data);
    return response.data;
  },

  /**
   * Update product (requires SELLER role and ownership)
   */
  async updateProduct(id: number, data: UpdateProductRequest): Promise<Product> {
    const response = await api.put<Product>(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Delete product (requires SELLER role and ownership)
   */
  async deleteProduct(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  /**
   * Get products by seller
   */
  async getProductsBySeller(sellerId: number, page = 0, size = 10): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>(`${BASE_PATH}/seller/${sellerId}`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get product reviews
   */
  async getProductReviews(productId: number, page = 0, size = 10): Promise<PaginatedResponse<ProductReview>> {
    const response = await api.get<PaginatedResponse<ProductReview>>(`${BASE_PATH}/${productId}/reviews`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Create product review (requires authentication)
   */
  async createReview(productId: number, data: CreateReviewRequest): Promise<ProductReview> {
    const response = await api.post<ProductReview>(`${BASE_PATH}/${productId}/reviews`, data);
    return response.data;
  },

  /**
   * Mark review as helpful
   */
  async markReviewHelpful(productId: number, reviewId: number): Promise<void> {
    await api.post(`${BASE_PATH}/${productId}/reviews/${reviewId}/helpful`);
  },
};
