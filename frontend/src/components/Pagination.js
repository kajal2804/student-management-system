/**
 * Pagination Component - Navigation for paginated data
 */

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        ← Previous
      </button>

      <div className="flex gap-1">
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-2 py-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded border transition ${
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>

      <span className="ml-4 text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
