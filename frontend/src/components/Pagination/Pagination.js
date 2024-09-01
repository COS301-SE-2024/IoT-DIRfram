import React from 'react';
import './Pagination.css';

const Pagination = ({ filteredDevices, devicesPerPage, currentPage, paginate }) => {
  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return pageNumbers;
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    const pages = [1];
    
    // Add pages between start and end
    if (start > 2) {
      pages.push("...");
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < totalPages - 1) {
      pages.push("...");
    }
    
    pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button onClick={() => paginate(currentPage - 1)} className="page-link">
          &laquo;
        </button>
      )}
      {visiblePages.map((number, index) => (
        <button
          key={index}
          onClick={() => typeof number === 'number' && paginate(number)}
          className={`page-link ${currentPage === number ? 'active' : ''}`}
          disabled={typeof number !== 'number'}
        >
          {number}
        </button>
      ))}
      {currentPage < totalPages && (
        <button onClick={() => paginate(currentPage + 1)} className="page-link">
          &raquo;
        </button>
      )}
    </div>
  );
};

export default Pagination;
