/**
 * StudentForm Component - Form for creating/editing students
 */

import React, { useState, useEffect } from 'react';

const StudentForm = ({ student = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    enrollment_date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        enrollment_date: student.enrollment_date,
      });
    }
  }, [student]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        {student ? 'Edit Student' : 'Add New Student'}
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter student name"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email address"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="10-digit phone number"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enrollment Date
        </label>
        <input
          type="date"
          name="enrollment_date"
          value={formData.enrollment_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : student ? 'Update Student' : 'Add Student'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition"
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
