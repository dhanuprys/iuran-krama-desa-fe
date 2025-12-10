export interface HttpResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details: Record<string, string[]> | null;
  } | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}
