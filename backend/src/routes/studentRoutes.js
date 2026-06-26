/**
 * Student API Routes
 */

const express = require('express');
const studentController = require('../controllers/studentController');

const router = express.Router();

// Student CRUD routes
router.get('/', studentController.getAllStudents.bind(studentController));
router.post('/', studentController.createStudent.bind(studentController));
router.get('/:id', studentController.getStudentById.bind(studentController));
router.put('/:id', studentController.updateStudent.bind(studentController));
router.delete('/:id', studentController.deleteStudent.bind(studentController));

// Mark routes
router.post('/:id/marks', studentController.addMark.bind(studentController));
router.put('/marks/:id', studentController.updateMark.bind(studentController));
router.delete('/marks/:id', studentController.deleteMark.bind(studentController));

module.exports = router;
