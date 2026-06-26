/**
 * Main App Component - Student Management System
 */

import React, { useState, useEffect } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetail from './components/StudentDetail';
import Pagination from './components/Pagination';
import Alert from './components/Alert';
import { studentApi } from './api/studentApi';
import './App.css';

function App() {
  const [view, setView] = useState('list'); // 'list', 'form', 'detail'
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const PAGE_SIZE = 10;

  // Fetch students
  const fetchStudents = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await studentApi.getStudents(page, PAGE_SIZE);
      setStudents(response.data.data);
      setPagination(response.data.pagination);
      setCurrentPage(page);
    } catch (error) {
      showAlert('error', 'Failed to fetch students');
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single student with marks
  const fetchStudentDetail = async (id) => {
    try {
      setIsLoading(true);
      const response = await studentApi.getStudentById(id);
      setSelectedStudent(response.data.data);
      setView('detail');
    } catch (error) {
      showAlert('error', 'Failed to fetch student details');
      console.error('Error fetching student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle student creation/update
  const handleSaveStudent = async (data) => {
    try {
      setIsLoading(true);

      if (editingStudent) {
        await studentApi.updateStudent(editingStudent.id, data);
        showAlert('success', 'Student updated successfully');
      } else {
        await studentApi.createStudent(data);
        showAlert('success', 'Student created successfully');
      }

      setEditingStudent(null);
      setView('list');
      fetchStudents(1);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Failed to save student';
      showAlert('error', message);
      console.error('Error saving student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle student deletion
  const handleDeleteStudent = async (id) => {
    try {
      setIsLoading(true);
      await studentApi.deleteStudent(id);
      showAlert('success', 'Student deleted successfully');
      fetchStudents(1);
    } catch (error) {
      showAlert('error', 'Failed to delete student');
      console.error('Error deleting student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show alert message
  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  // Initialize
  useEffect(() => {
    fetchStudents(1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Management System
          </h1>
          <p className="text-gray-600 mt-2">Manage students and their academic records</p>
        </div>
      </header>

      {/* Alert */}
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: '', message: '' })}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'list' && (
          <div>
            {/* Action Button */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setView('form');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                + Add New Student
              </button>
            </div>

            {/* Student List */}
            <StudentList
              students={students}
              onEdit={(student) => {
                setEditingStudent(student);
                setView('form');
              }}
              onDelete={handleDeleteStudent}
              onView={fetchStudentDetail}
              isLoading={isLoading}
            />

            {/* Pagination */}
            {pagination.totalPages && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={fetchStudents}
              />
            )}
          </div>
        )}

        {view === 'form' && (
          <div className="max-w-2xl">
            <StudentForm
              student={editingStudent}
              onSubmit={handleSaveStudent}
              onCancel={() => {
                setEditingStudent(null);
                setView('list');
              }}
              isLoading={isLoading}
            />
          </div>
        )}

        {view === 'detail' && (
          <StudentDetail
            student={selectedStudent}
            onBack={() => setView('list')}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>Student Management System © 2024</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
