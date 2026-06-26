/**
 * Alert Component - Display success/error messages
 */

import React, { useEffect } from 'react';

const Alert = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
  const textColor = type === 'error' ? 'text-red-800' : 'text-green-800';
  const borderColor = type === 'error' ? 'border-red-300' : 'border-green-300';

  return (
    <div
      className={`fixed top-4 right-4 max-w-md p-4 rounded-lg border ${bgColor} ${textColor} ${borderColor} shadow-lg flex items-start gap-3 z-50`}
    >
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-lg font-bold opacity-50 hover:opacity-100 transition"
      >
        ×
      </button>
    </div>
  );
};

export default Alert;
