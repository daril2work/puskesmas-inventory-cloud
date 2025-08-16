import { useState, useMemo } from 'react';

interface UsePaginationProps {
  data: any[];
  itemsPerPage?: number;
}

export function usePagination<T>({ data, itemsPerPage = 10 }: UsePaginationProps & { data: T[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex) as T[];
  }, [data, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (hasNextPage) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) setCurrentPage(currentPage - 1);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
    totalItems: data.length,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, data.length),
  };
}