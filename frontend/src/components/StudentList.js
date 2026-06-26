/**
 * StudentList Component - Displays list of students
 */

import React from 'react';

const StudentList = ({ students, onEdit, onDelete, onView, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No students found</p>
          <p className="text-gray-400">Click "Add New Student" to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Enrollment Date
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">{student.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {student.phone || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(student.enrollment_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onView(student.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="text-green-600 hover:text-green-800 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${student.name}?`
                          )
                        ) {
                          onDelete(student.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
