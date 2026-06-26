/**
 * Student Controller - Request/Response handlers
 */

const studentService = require('../services/studentService');

class StudentController {
  /**
   * GET /students
   * Get all students with pagination
   */
  async getAllStudents(req, res, next) {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10)); // Cap at 100

      const result = await studentService.getAllStudents(page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /students/:id
   * Get student by ID with marks
   */
  async getStudentById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid student ID',
        });
      }

      const student = await studentService.getStudentById(parseInt(id));

      res.json({
        success: true,
        data: student,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /students
   * Create a new student
   */
  async createStudent(req, res, next) {
    try {
      const student = await studentService.createStudent(req.body);

      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /students/:id
   * Update student information
   */
  async updateStudent(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid student ID',
        });
      }

      const student = await studentService.updateStudent(parseInt(id), req.body);

      res.json({
        success: true,
        message: 'Student updated successfully',
        data: student,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /students/:id
   * Delete a student
   */
  async deleteStudent(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid student ID',
        });
      }

      const result = await studentService.deleteStudent(parseInt(id));

      res.json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /students/:id/marks
   * Add a mark for a student
   */
  async addMark(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid student ID',
        });
      }

      const mark = await studentService.addMark(parseInt(id), req.body);

      res.status(201).json({
        success: true,
        message: 'Mark added successfully',
        data: mark,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /marks/:id
   * Update a mark
   */
  async updateMark(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid mark ID',
        });
      }

      const mark = await studentService.updateMark(parseInt(id), req.body);

      res.json({
        success: true,
        message: 'Mark updated successfully',
        data: mark,
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * DELETE /marks/:id
   * Delete a mark
   */
  async deleteMark(req, res, next) {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid mark ID',
        });
      }

      const result = await studentService.deleteMark(parseInt(id));

      res.json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StudentController();
