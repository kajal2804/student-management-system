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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg border-2 border-blue-300 text-blue-700 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
      </div>

      <div className="flex gap-1 flex-wrap justify-center">
        {pages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition font-semibold"
            >
              1
            </button>
            {pages[0] > 2 && <span className="px-2 py-2 text-gray-500">•••</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg font-semibold transition ${
              currentPage === page
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-2 border-blue-600 shadow-lg'
                : 'border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
            }`}
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-2 py-2 text-gray-500">•••</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition font-semibold"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg border-2 border-blue-300 text-blue-700 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition font-medium flex items-center gap-1"
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <span className="text-sm font-semibold text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
        Page <span className="text-blue-600">{currentPage}</span> of <span className="text-blue-600">{totalPages}</span>
      </span>
    </div>
  );
};

export default Pagination;
