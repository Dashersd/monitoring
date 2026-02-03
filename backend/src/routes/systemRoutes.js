const express = require('express');
const router = express.Router();
const { getAllTeachers, seedData, getReferenceData, createTeacher, updateTeacher, resetPassword } = require('../controllers/systemController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/teachers', authenticateToken, authorizeRole(['ADMIN']), getAllTeachers);
router.post('/teachers', authenticateToken, authorizeRole(['ADMIN']), createTeacher);
router.put('/teachers/:id', authenticateToken, authorizeRole(['ADMIN']), updateTeacher);
router.put('/teachers/:id/reset-password', authenticateToken, authorizeRole(['ADMIN']), resetPassword);
router.get('/reference-data', authenticateToken, getReferenceData); // Categories, Depts
router.post('/seed', seedData); // Open for initial setup

module.exports = router;
