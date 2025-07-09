export interface PagedContent<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface SlicedContent<T> {
  items: T[];
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

