const express = require('express');
const router = express.Router();
const {
    submitActivity,
    getMyActivities,
    getAllActivities,
    updateActivityStatus,
    getDashboardStats,
    getTeacherStats
} = require('../controllers/activityController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.get('/all', authenticateToken, authorizeRole(['ADMIN', 'SUPERVISOR']), getAllActivities);
router.get('/my', authenticateToken, getMyActivities);
router.get('/stats', authenticateToken, authorizeRole(['ADMIN', 'SUPERVISOR']), getDashboardStats);
router.get('/teacher/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPERVISOR']), getTeacherStats); // New
router.post('/submit', authenticateToken, submitActivity);
router.put('/:id/status', authenticateToken, authorizeRole(['ADMIN', 'SUPERVISOR']), updateActivityStatus);

module.exports = router;
