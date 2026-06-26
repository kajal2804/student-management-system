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
      await studentApi.addMark(student.id, markForm);
      setMarkForm({ subject: '', score: '', exam_date: new Date().toISOString().split('T')[0] });
      setShowMarkForm(false);
      if (onStudentUpdate) onStudentUpdate(student.id);
    } catch (error) {
      setMarkErrors({
        submit: error.response?.data?.message || 'Failed to add mark',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Student Information */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 mb-4 font-medium"
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{student.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-gray-800 font-medium">{student.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="text-gray-800 font-medium">{student.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Enrollment Date</p>
            <p className="text-gray-800 font-medium">
              {new Date(student.enrollment_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="text-gray-800 font-medium">
              {new Date(student.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Marks Section */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Academic Records</h3>
          <button
            onClick={() => setShowMarkForm(!showMarkForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
          >
            {showMarkForm ? 'Cancel' : '+ Add Mark'}
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
                <p className="text-red-500 text-sm mb-4">{markErrors.submit}</p>
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
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {calculateAverage(student.marks)}/100
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Score
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Exam Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {student.marks.map((mark) => (
                    <tr key={mark.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {mark.subject}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            mark.score >= 80
                              ? 'bg-green-100 text-green-800'
                              : mark.score >= 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
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
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">No marks recorded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
