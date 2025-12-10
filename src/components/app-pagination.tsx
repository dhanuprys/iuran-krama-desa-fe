import type { PaginatedResponse } from '@/types/http';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface AppPaginationProps {
  meta: PaginatedResponse<any>['meta'] | null | undefined;
  onPageChange: (page: number) => void;
  className?: string;
}

export function AppPagination({ meta, onPageChange, className }: AppPaginationProps) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page, last_page } = meta;

  const handlePageChange = (p: number) => {
    if (p >= 1 && p <= last_page) {
      onPageChange(p);
    }
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(current_page - 1);
            }}
            className={current_page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {Array.from({ length: last_page }).map((_, i) => {
          const p = i + 1;
          /* 
                       Simple pagination logic:
                       Show first, last, current, and +/- 1 around current.
                       For a real app, we might want ellipsis (...) for large page counts.
                    */
          if (p === 1 || p === last_page || (p >= current_page - 1 && p <= current_page + 1)) {
            return (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === current_page}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            );
          }
          return null;
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(current_page + 1);
            }}
            className={
              current_page >= last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
