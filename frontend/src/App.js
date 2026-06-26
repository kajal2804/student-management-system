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
      const message = String(
        error.response?.data?.message || error.message || 'Failed to fetch students'
      );
      showAlert('error', message);
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
      const message = String(
        error.response?.data?.message || error.message || 'Failed to fetch student details'
      );
      showAlert('error', message);
      console.error('Error fetching student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle student creation/update
  const handleSaveStudent = async (data) => {
    try {
      setIsLoading(true);
      setEditingStudent(null);

      if (editingStudent) {
        await studentApi.updateStudent(editingStudent.id, data);
        showAlert('success', 'Student updated successfully');
      } else {
        await studentApi.createStudent(data);
        showAlert('success', 'Student created successfully');
      }

      // Delay state changes to ensure alert renders first
      setTimeout(() => {
        setView('list');
        fetchStudents(1);
      }, 500);
    } catch (error) {
      console.error('Full error object:', error);
      let errorMessage = 'Failed to save student';

      if (error?.response?.data?.message) {
        errorMessage = String(error.response.data.message);
      } else if (error?.message) {
        errorMessage = String(error.message);
      }

      showAlert('error', errorMessage);
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
      const message = String(
        error.response?.data?.message || error.message || 'Failed to delete student'
      );
      showAlert('error', message);
      console.error('Error deleting student:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show alert message
  const showAlert = (type, message) => {
    // Ensure message is always a string
    const safeMessage = message ? String(message) : '';
    setAlert({ type, message: safeMessage });
  };

  // Initialize
  useEffect(() => {
    fetchStudents(1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Student Management System</h1>
              <p className="text-blue-100 mt-1">Manage students and their academic records</p>
            </div>
          </div>
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
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Student
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
            onStudentUpdate={fetchStudentDetail}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-2">Student Management</h4>
              <p className="text-gray-400 text-sm">Efficient student and academic record management system.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-2">Features</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Student CRUD Operations</li>
                <li>• Mark Management</li>
                <li>• Pagination Support</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-2">Technology</h4>
              <p className="text-gray-400 text-sm">React • Node.js • PostgreSQL</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>© 2024 Student Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
