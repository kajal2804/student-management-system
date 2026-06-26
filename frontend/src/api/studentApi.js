/**
 * Student API - API methods for student operations
 */

import client from './client';

export const studentApi = {
  // Get all students with pagination
  getStudents: (page = 1, limit = 10) =>
    client.get('/students', { params: { page, limit } }),

  // Get single student with marks
  getStudentById: (id) => client.get(`/students/${id}`),

  // Create new student
  createStudent: (data) => client.post('/students', data),

  // Update student
  updateStudent: (id, data) => client.put(`/students/${id}`, data),

  // Delete student
  deleteStudent: (id) => client.delete(`/students/${id}`),

  // Add mark for student
  addMark: (studentId, data) => client.post(`/students/${studentId}/marks`, data),

  // Update mark
  updateMark: (markId, data) => client.put(`/marks/${markId}`, data),

  // Delete mark
  deleteMark: (markId) => client.delete(`/marks/${markId}`),
};
