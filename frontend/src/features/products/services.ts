import api from "@/lib/http/api";
import { PaginatedResponse } from "@/app/types/common";
import {
  Product,
  ProductReview,
  CreateProductRequest,
  UpdateProductRequest,
  ProductSearchParams,
  CreateReviewRequest,
} from "./model";

const BASE_PATH = "/products";

export const productService = {
  /**
   * Search products with filters and pagination
   */
  async searchProducts(
    params: ProductSearchParams
  ): Promise<PaginatedResponse<Product>> {
    const { query, sortBy, sortDirection, ...rest } = params;

    const mappedParams = {
      keyword: query,
      ...rest,
      sort: sortBy ? `${sortBy},${sortDirection ?? "desc"}` : undefined,
    };

    const response = await api.get<PaginatedResponse<Product>>(
      "/products/search",
      {
        params: mappedParams,
      }
    );
    return response.data;
  },

  /**
   * Get all products with filters
   */
  async getAllProducts(
    params: ProductSearchParams
  ): Promise<PaginatedResponse<Product>> {
    const { sortBy, sortDirection, ...rest } = params;

    const mappedParams = {
      ...rest,
      sort: sortBy ? `${sortBy},${sortDirection ?? "desc"}` : undefined,
    };

    const response = await api.get<PaginatedResponse<Product>>("/products", {
      params: mappedParams,
    });
    return response.data;
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(
    page = 0,
    size = 12
  ): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>(
      `${BASE_PATH}/featured`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  /**
   * Get product details by ID
   */
  async getProductById(id: string): Promise<Product> {
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
  async updateProduct(
    id: string,
    data: UpdateProductRequest
  ): Promise<Product> {
    const response = await api.put<Product>(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Delete product (requires SELLER role and ownership)
   */
  async deleteProduct(id: string): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  /**
   * Get products by seller
   */
  async getProductsBySeller(
    sellerId: string,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>(
      `${BASE_PATH}/seller/${sellerId}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  /**
   * Get product reviews
   */
  async getProductReviews(
    productId: string,
    page = 0,
    size = 10
  ): Promise<PaginatedResponse<ProductReview>> {
    const response = await api.get<PaginatedResponse<ProductReview>>(
      `${BASE_PATH}/${productId}/reviews`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  /**
   * Create product review (requires authentication)
   */
  async createReview(
    productId: string,
    data: CreateReviewRequest
  ): Promise<ProductReview> {
    const response = await api.post<ProductReview>(
      `${BASE_PATH}/${productId}/reviews`,
      data
    );
    return response.data;
  },

  /**
   * Mark review as helpful
   */
  async markReviewHelpful(productId: string, reviewId: number): Promise<void> {
    await api.post(`${BASE_PATH}/${productId}/reviews/${reviewId}/helpful`);
  },

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    const response = await api.get<number>(`${BASE_PATH}/count`);
    return response.data;
  },
};
