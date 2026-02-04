const express = require('express');
const router = express.Router();
const {
    submitActivity,
    getMyActivities,
    getAllActivities,
    updateActivityStatus,
    getDashboardStats,
    getTeacherStats,
    getReportData,
    getMyStats
} = require('../controllers/activityController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Storage Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

router.get('/all', authenticateToken, authorizeRole(['ADMIN', 'SUPERVISOR']), getAllActivities);
router.get('/my', authenticateToken, getMyActivities);
router.get('/my-stats', authenticateToken, getMyStats);
router.get('/stats', authenticateToken, authorizeRole(['ADMIN', 'SUPERVISOR']), getDashboardStats);
router.get('/reports', authenticateToken, authorizeRole(['ADMIN', 'SUPERVISOR']), getReportData);
router.get('/teacher/:id', authenticateToken, authorizeRole(['ADMIN', 'SUPERVISOR']), getTeacherStats);

// Submit with File Upload (max 3 files)
router.post('/submit', authenticateToken, upload.array('files', 3), submitActivity);

router.put('/:id/status', authenticateToken, authorizeRole(['ADMIN', 'SUPERVISOR']), updateActivityStatus);

module.exports = router;
