/**
 * StudentDetail Component - Displays detailed view of a student with marks
 */

import React, { useState } from 'react';
import { studentApi } from '../api/studentApi';

const StudentDetail = ({ student, onBack, isLoading = false, onStudentUpdate }) => {
  const [showMarkForm, setShowMarkForm] = useState(false);
  const [markForm, setMarkForm] = useState({
    subject: '',
    score: '',
    exam_date: new Date().toISOString().split('T')[0],
  });
  const [markErrors, setMarkErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-gray-600">Loading student details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Student not found</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Back
        </button>
      </div>
    );
  }

  const calculateAverage = (marks) => {
    if (!marks || marks.length === 0) return 0;
    const total = marks.reduce((sum, mark) => sum + parseFloat(mark.score), 0);
    return (total / marks.length).toFixed(2);
  };

  const handleMarkInputChange = (e) => {
    const { name, value } = e.target;
    setMarkForm((prev) => ({ ...prev, [name]: value }));
    if (markErrors[name]) {
      setMarkErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateMarkForm = () => {
    const errors = {};
    if (!markForm.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    if (!markForm.score || parseFloat(markForm.score) < 0 || parseFloat(markForm.score) > 100) {
      errors.score = 'Score must be between 0 and 100';
    }
    setMarkErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMark = async (e) => {
    e.preventDefault();
    if (!validateMarkForm()) return;

    try {
      setIsSubmitting(true);
      setMarkErrors({});
      await studentApi.addMark(student.id, markForm);
      setMarkForm({ subject: '', score: '', exam_date: new Date().toISOString().split('T')[0] });
      setShowMarkForm(false);
      setMarkErrors({});
      if (onStudentUpdate) onStudentUpdate(student.id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add mark';
      setMarkErrors((prev) => ({
        ...prev,
        submit: typeof errorMessage === 'string' ? errorMessage : 'An error occurred',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      {/* Student Information */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg mb-4 font-semibold flex items-center gap-1 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-4 rounded-xl text-white">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{student.name}</h2>
            <p className="text-gray-500">Student Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Email</p>
            <p className="text-gray-800 font-medium mt-2">{student.email}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-semibold uppercase tracking-wide">Phone</p>
            <p className="text-gray-800 font-medium mt-2">{student.phone || <span className="text-gray-400">-</span>}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-semibold uppercase tracking-wide">Enrollment</p>
            <p className="text-gray-800 font-medium mt-2">
              {new Date(student.enrollment_date).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-600 font-semibold uppercase tracking-wide">Member Since</p>
            <p className="text-gray-800 font-medium mt-2">
              {new Date(student.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Marks Section */}
      <div className="border-t-2 border-gray-200 pt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Academic Records</h3>
          </div>
          <button
            onClick={() => setShowMarkForm(!showMarkForm)}
            className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
              showMarkForm
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {showMarkForm ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Mark
              </>
            )}
          </button>
        </div>

        {/* Add Mark Form */}
        {showMarkForm && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <form onSubmit={handleAddMark}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={markForm.subject}
                    onChange={handleMarkInputChange}
                    placeholder="e.g., Mathematics"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      markErrors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {markErrors.subject && (
                    <p className="text-red-500 text-sm mt-1">{markErrors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score (0-100) *
                  </label>
                  <input
                    type="number"
                    name="score"
                    value={markForm.score}
                    onChange={handleMarkInputChange}
                    placeholder="85.5"
                    min="0"
                    max="100"
                    step="0.5"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      markErrors.score ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {markErrors.score && (
                    <p className="text-red-500 text-sm mt-1">{markErrors.score}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    name="exam_date"
                    value={markForm.exam_date}
                    onChange={handleMarkInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {markErrors.submit && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm font-medium">{String(markErrors.submit)}</p>
                </div>
              )}

              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Mark'}
              </button>
            </form>
          </div>
        )}

        {student.marks && student.marks.length > 0 ? (
          <>
            <div className="mb-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <p className="text-blue-100 text-sm font-semibold uppercase tracking-wide">Overall Performance</p>
              <p className="text-4xl font-bold mt-3">
                {calculateAverage(student.marks)}<span className="text-2xl text-blue-100 ml-1">/100</span>
              </p>
              <p className="text-blue-100 mt-2 text-sm">Average Score</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 border-b-2 border-blue-800">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                      Exam Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {student.marks.map((mark) => (
                    <tr key={mark.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                        {mark.subject}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold inline-block ${
                            mark.score >= 80
                              ? 'bg-green-100 text-green-800 shadow-sm'
                              : mark.score >= 60
                              ? 'bg-yellow-100 text-yellow-800 shadow-sm'
                              : 'bg-red-100 text-red-800 shadow-sm'
                          }`}
                        >
                          {mark.score}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(mark.exam_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-xl text-center border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-lg font-semibold">No marks recorded yet</p>
            <p className="text-gray-400 mt-2">Click "Add Mark" to record the first exam</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
