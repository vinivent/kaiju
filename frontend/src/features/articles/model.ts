import { ArticleCategory, ArticleStatus } from "@/app/types/common";

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: ArticleCategory;
  authorId: number;
  authorName: string;
  imageUrl?: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: ArticleStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleComment {
  id: number;
  articleId: number;
  userId: number;
  userName: string;
  content: string;
  parentCommentId?: number;
  likeCount: number;
  createdAt: string;
}

// Request/Response DTOs
export interface CreateArticleRequest {
  title: string;
  content: string;
  summary: string;
  category: ArticleCategory;
  imageUrl?: string;
  tags: string[];
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  summary?: string;
  category?: ArticleCategory;
  imageUrl?: string;
  tags?: string[];
  status?: ArticleStatus;
}

export interface ArticleSearchParams {
  query?: string;
  category?: ArticleCategory;
  authorId?: number;
  tags?: string[];
  status?: ArticleStatus;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface CreateCommentRequest {
  content: string;
  parentCommentId?: number;
}

export interface UpdateCommentRequest {
  content: string;
}
