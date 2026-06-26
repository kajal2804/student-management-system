/**
 * Student Service - Business logic for student operations
 */

const db = require('../db');
const { NotFoundError, ConflictError, ValidationError } = require('../utils/errors');
const { validateStudentData } = require('../utils/validators');

class StudentService {
  /**
   * Get all students with pagination
   */
  async getAllStudents(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    // Fetch paginated students
    const students = await db('students')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get total count
    const countResult = await db('students').count('* as count').first();
    const totalRecords = countResult.count;
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: students,
      pagination: {
        currentPage: page,
        pageSize: limit,
        totalRecords,
        totalPages,
      },
    };
  }

  /**
   * Get student by ID with their marks
   */
  async getStudentById(studentId) {
    const student = await db('students').where('id', studentId).first();

    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Fetch student's marks
    const marks = await db('marks').where('student_id', studentId).orderBy('exam_date', 'desc');

    return {
      ...student,
      marks,
    };
  }

  /**
   * Create a new student
   */
  async createStudent(data) {
    // Validate input
    const validation = validateStudentData(data);
    if (!validation.isValid) {
      throw new ValidationError('Invalid student data', validation.errors);
    }

    // Check if email already exists
    const existingStudent = await db('students').where('email', data.email).first();
    if (existingStudent) {
      throw new ConflictError('Student with this email already exists');
    }

    // Insert student
    const [id] = await db('students').insert({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone || null,
      enrollment_date: data.enrollment_date || new Date().toISOString().split('T')[0],
    });

    return this.getStudentById(id);
  }

  /**
   * Update student information
   */
  async updateStudent(studentId, data) {
    // Verify student exists
    const student = await db('students').where('id', studentId).first();
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Validate input
    const validation = validateStudentData(data);
    if (!validation.isValid) {
      throw new ValidationError('Invalid student data', validation.errors);
    }

    // Check if new email is unique (if email is being changed)
    if (data.email && data.email.toLowerCase() !== student.email) {
      const existingStudent = await db('students').where('email', data.email).first();
      if (existingStudent) {
        throw new ConflictError('Student with this email already exists');
      }
    }

    // Update student
    await db('students').where('id', studentId).update({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone || null,
      updated_at: db.raw('CURRENT_TIMESTAMP'),
    });

    return this.getStudentById(studentId);
  }

  /**
   * Delete a student
   */
  async deleteStudent(studentId) {
    // Verify student exists
    const student = await db('students').where('id', studentId).first();
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Delete student (marks will be deleted automatically due to CASCADE)
    await db('students').where('id', studentId).delete();

    return {
      message: 'Student deleted successfully',
      id: studentId,
    };
  }

  /**
   * Add mark for a student
   */
  async addMark(studentId, markData) {
    // Verify student exists
    const student = await db('students').where('id', studentId).first();
    if (!student) {
      throw new NotFoundError('Student not found');
    }

    // Validate mark data
    const { validateMarkData } = require('../utils/validators');
    const validation = validateMarkData(markData);
    if (!validation.isValid) {
      throw new ValidationError('Invalid mark data', validation.errors);
    }

    // Check if mark for this subject already exists
    const existingMark = await db('marks')
      .where('student_id', studentId)
      .where('subject', markData.subject)
      .first();

    if (existingMark) {
      throw new ConflictError('Mark for this subject already exists for this student');
    }

    // Insert mark
    const [markId] = await db('marks').insert({
      student_id: studentId,
      subject: markData.subject.trim(),
      score: parseFloat(markData.score),
      exam_date: markData.exam_date || new Date().toISOString().split('T')[0],
    });

    return db('marks').where('id', markId).first();
  }

  /**
   * Update mark for a student
   */
  async updateMark(markId, markData) {
    // Verify mark exists
    const mark = await db('marks').where('id', markId).first();
    if (!mark) {
      throw new NotFoundError('Mark not found');
    }

    // Validate mark data
    const { validateMarkData } = require('../utils/validators');
    const validation = validateMarkData(markData);
    if (!validation.isValid) {
      throw new ValidationError('Invalid mark data', validation.errors);
    }

    // Update mark
    await db('marks').where('id', markId).update({
      score: parseFloat(markData.score),
      exam_date: markData.exam_date || mark.exam_date,
      updated_at: db.raw('CURRENT_TIMESTAMP'),
    });

    return db('marks').where('id', markId).first();
  }

  /**
   * Delete a mark
   */
  async deleteMark(markId) {
    // Verify mark exists
    const mark = await db('marks').where('id', markId).first();
    if (!mark) {
      throw new NotFoundError('Mark not found');
    }

    // Delete mark
    await db('marks').where('id', markId).delete();

    return {
      message: 'Mark deleted successfully',
      id: markId,
    };
  }
}

module.exports = new StudentService();
