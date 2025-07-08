export interface ApiResponse<T> {
  status: 'SUCCESS' | 'FAILED' | 'ERROR';
  message: string | null;
  data: T;
}

export interface PagedContent<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export type PageResponse<T> = ApiResponse<PagedContent<T>>;

export interface SlicedContent<T> {
  items: T[];
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type SliceResponse<T> = ApiResponse<SlicedContent<T>>;

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export function getPaginationInfo<T>(response: PageResponse<T>): PaginationInfo {
  return {
    currentPage: response.data.page,
    totalPages: response.data.totalPages,
    pageSize: response.data.size,
    totalItems: response.data.total,
    hasNext: !response.data.last,
    hasPrevious: !response.data.first,
    isFirst: response.data.first,
    isLast: response.data.last,
  };
}

export interface SliceInfo {
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function getSliceInfo<T>(response: SliceResponse<T>): SliceInfo {
  return {
    currentPage: response.data.page,
    pageSize: response.data.size,
    hasNext: response.data.hasNext,
    hasPrevious: response.data.hasPrevious,
  };
}
