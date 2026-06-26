/**
 * Alert Component - Display success/error messages
 */

import React, { useEffect } from 'react';

const Alert = ({ type, message, onClose, duration = 5000 }) => {
  // Ensure message is always a string
  const safeMessage = message ? String(message) : '';

  useEffect(() => {
    if (safeMessage) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [safeMessage, duration, onClose]);

  if (!safeMessage) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-gradient-to-r from-red-50 to-red-100' : 'bg-gradient-to-r from-green-50 to-green-100';
  const borderColor = isError ? 'border-red-300' : 'border-green-300';
  const textColor = isError ? 'text-red-800' : 'text-green-800';
  const Icon = isError ? (
    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div
      className={`fixed top-4 right-4 max-w-md p-4 rounded-xl border-2 ${bgColor} ${borderColor} ${textColor} shadow-xl flex items-start gap-3 z-50 animate-fadeIn backdrop-blur-sm`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {Icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{safeMessage}</p>
      </div>
      <button
        onClick={onClose}
        className="text-lg font-bold opacity-50 hover:opacity-100 transition ml-2 flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
};

export default Alert;
