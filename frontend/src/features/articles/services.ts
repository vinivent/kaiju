import api from '@/lib/http/api';
import { PaginatedResponse } from '@/app/types/common';
import {
  Article,
  ArticleComment,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleSearchParams,
  CreateCommentRequest,
  UpdateCommentRequest,
} from './model';
const BASE_PATH = '/articles';

export const articleService = {
  /**
   * Search articles with filters and pagination
   */
  async searchArticles(params: ArticleSearchParams): Promise<PaginatedResponse<Article>> {
    const response = await api.get<PaginatedResponse<Article>>(`${BASE_PATH}/search`, { params });
    return response.data;
  },

  /**
   * Get published articles
   */
  async getPublishedArticles(page = 0, size = 10): Promise<PaginatedResponse<Article>> {
    const response = await api.get<PaginatedResponse<Article>>(`${BASE_PATH}/published`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get popular articles (by view count)
   */
  async getPopularArticles(page = 0, size = 10): Promise<PaginatedResponse<Article>> {
    const response = await api.get<PaginatedResponse<Article>>(`${BASE_PATH}/popular`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get article by ID
   */
  async getArticleById(id: number): Promise<Article> {
    const response = await api.get<Article>(`${BASE_PATH}/${id}`);
    return response.data;
  },

  /**
   * Get article by slug
   */
  async getArticleBySlug(slug: string): Promise<Article> {
    const response = await api.get<Article>(`${BASE_PATH}/slug/${slug}`);
    return response.data;
  },

  /**
   * Create new article (requires AUTHOR role)
   */
  async createArticle(data: CreateArticleRequest): Promise<Article> {
    const response = await api.post<Article>(BASE_PATH, data);
    return response.data;
  },

  /**
   * Update article (requires AUTHOR role and ownership)
   */
  async updateArticle(id: number, data: UpdateArticleRequest): Promise<Article> {
    const response = await api.put<Article>(`${BASE_PATH}/${id}`, data);
    return response.data;
  },

  /**
   * Delete article (requires AUTHOR role and ownership)
   */
  async deleteArticle(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}`);
  },

  /**
   * Publish article (requires AUTHOR role and ownership)
   */
  async publishArticle(id: number): Promise<Article> {
    const response = await api.post<Article>(`${BASE_PATH}/${id}/publish`);
    return response.data;
  },

  /**
   * Like article (requires authentication)
   */
  async likeArticle(id: number): Promise<void> {
    await api.post(`${BASE_PATH}/${id}/like`);
  },

  /**
   * Unlike article (requires authentication)
   */
  async unlikeArticle(id: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${id}/like`);
  },

  /**
   * Get article comments
   */
  async getArticleComments(articleId: number, page = 0, size = 20): Promise<PaginatedResponse<ArticleComment>> {
    const response = await api.get<PaginatedResponse<ArticleComment>>(`${BASE_PATH}/${articleId}/comments`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Create comment on article (requires authentication)
   */
  async createComment(articleId: number, data: CreateCommentRequest): Promise<ArticleComment> {
    const response = await api.post<ArticleComment>(`${BASE_PATH}/${articleId}/comments`, data);
    return response.data;
  },

  /**
   * Update comment (requires authentication and ownership)
   */
  async updateComment(articleId: number, commentId: number, data: UpdateCommentRequest): Promise<ArticleComment> {
    const response = await api.put<ArticleComment>(`${BASE_PATH}/${articleId}/comments/${commentId}`, data);
    return response.data;
  },

  /**
   * Delete comment (requires authentication and ownership)
   */
  async deleteComment(articleId: number, commentId: number): Promise<void> {
    await api.delete(`${BASE_PATH}/${articleId}/comments/${commentId}`);
  },

  /**
   * Like comment (requires authentication)
   */
  async likeComment(articleId: number, commentId: number): Promise<void> {
    await api.post(`${BASE_PATH}/${articleId}/comments/${commentId}/like`);
  },

  /**
   * Get articles by category
   */
  async getArticlesByCategory(category: string, page = 0, size = 10): Promise<PaginatedResponse<Article>> {
    const response = await api.get<PaginatedResponse<Article>>(`${BASE_PATH}/category/${category}`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get articles by author
   */
  async getArticlesByAuthor(authorId: number, page = 0, size = 10): Promise<PaginatedResponse<Article>> {
    const response = await api.get<PaginatedResponse<Article>>(`${BASE_PATH}/author/${authorId}`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * Get articles by tag
   */
  async getArticlesByTag(tag: string, page = 0, size = 10): Promise<PaginatedResponse<Article>> {
    const response = await api.get<PaginatedResponse<Article>>(`${BASE_PATH}/tag/${tag}`, {
      params: { page, size },
    });
    return response.data;
  },
};
