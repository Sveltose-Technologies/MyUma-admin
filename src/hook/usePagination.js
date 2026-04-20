import { useState, useMemo } from "react";

export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const startRange =
    totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRange = Math.min(currentPage * itemsPerPage, totalItems);

  return { 
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    paginatedData,
    startRange,
    endRange,
  };
};
