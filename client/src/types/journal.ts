/**
 * Journal interface representing journal data from the API
 */
export interface Journal {
  _id: string;
  title: string;
  description: string;
  category?: string;
  tags?: string[];
  publishedDate?: string;
  isDeleted?: boolean;
  impactFactor?: {
    value: number;
    year: number;
  };
  metrics?: {
    averageReviewTime: string;
    acceptanceRate: string;
    timeToPublication: string;
    articlesPerYear: number;
  };
  publicationFrequency?: string;
  openAccess?: boolean;
  peerReviewProcess?: string;
  submissionGuidelines?: string[];
  createdAt: string;
  updatedAt: string;
  editorId?: string;
}

/**
 * Article interface representing article data from the API
 */
export interface Article {
  _id: string;
  title: string;
  abstract: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  comment?: string;
  journalId?: string;
}

/**
 * Pagination interface for API responses
 */
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Journal API response interface
 */
export interface JournalApiResponse {
  success: boolean;
  message: string;
  data: {
    journals: Journal[];
    pagination: Pagination;
  };
}

/**
 * Article API response interface
 */
export interface ArticleApiResponse {
  success: boolean;
  message: string;
  data: {
    articles: Article[];
    pagination: Pagination;
  };
}

/**
 * Journal details API response interface
 */
export interface JournalDetailsApiResponse {
  success: boolean;
  message: string;
  data: Journal;
}