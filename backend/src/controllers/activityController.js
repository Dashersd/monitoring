const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Submit a new activity
const submitActivity = async (req, res) => {
    try {
        const { title, description, date, durationHours, categoryId } = req.body;
        const teacherId = req.user.id; // From authMiddleware

        // Find or create category (for simplicity, we assume category name is passed or partial logic)
        // Ideally frontend sends categoryId, but if it sends name, we need to handle it.
        // Let's assume frontend sends categoryId. If not, we might need a lookup.
        // For this iteration, let's assume simple string or ID. 
        // If category is an ID:

        // Ensure teacher profile exists
        const teacherProfile = await prisma.teacherProfile.findUnique({
            where: { userId: teacherId }
        });

        if (!teacherProfile) {
            return res.status(400).json({ status: 'error', message: 'Teacher profile incomplete' });
        }

        const activity = await prisma.activity.create({
            data: {
                title,
                description,
                date: new Date(date),
                durationHours: parseFloat(durationHours),
                status: 'PENDING',
                teacherId: teacherProfile.id,
                categoryId: parseInt(categoryId), // Assuming categoryId is sent
            }
        });

        res.status(201).json({ status: 'success', data: activity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Failed to submit activity' });
    }
};

// Get activities for the logged-in teacher
const getMyActivities = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const teacherProfile = await prisma.teacherProfile.findUnique({
            where: { userId: teacherId }
        });

        if (!teacherProfile) {
            return res.json({ status: 'success', data: [] });
        }

        const activities = await prisma.activity.findMany({
            where: { teacherId: teacherProfile.id },
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ status: 'success', data: activities });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch activities' });
    }
};

// Get all activities (for Admin/Supervisor)
const getAllActivities = async (req, res) => {
    try {
        const { status } = req.query;
        const where = {};
        if (status) where.status = status;

        const activities = await prisma.activity.findMany({
            where,
            include: {
                teacher: {
                    include: {
                        user: { select: { name: true, email: true } },
                        department: true
                    }
                },
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ status: 'success', data: activities });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch activities' });
    }
};

// Update Activity Status (Approve/Reject)
const updateActivityStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;
        const approverId = req.user.id;

        const activity = await prisma.activity.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        // Record approval/rejection
        await prisma.approval.create({
            data: {
                activityId: activity.id,
                approverId,
                status,
                comments: remarks
            }
        });

        res.json({ status: 'success', data: activity });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update activity' });
    }
};

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const totalTeachers = await prisma.user.count({ where: { role: 'TEACHER' } });
        const pendingApprovals = await prisma.activity.count({ where: { status: 'PENDING' } });

        // Sum total credits (durationHours) for approved activities
        const approvedActivities = await prisma.activity.findMany({
            where: { status: 'APPROVED' },
            select: { durationHours: true }
        });
        const totalCredits = approvedActivities.reduce((acc, curr) => acc + curr.durationHours, 0);

        res.json({
            status: 'success',
            data: {
                totalTeachers,
                pendingApprovals,
                totalCredits: Math.round(totalCredits * 100) / 100,
                activeReports: 0 // Placeholder
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch stats' });
    }
};

// Get stats and activities for a specific teacher (Admin View)
const getTeacherStats = async (req, res) => {
    try {
        const { id } = req.params; // teacherId (User ID)

        // Fetch Teacher Profile
        const teacher = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: {
                teacherProfile: {
                    include: { department: true }
                }
            }
        });

        if (!teacher) {
            return res.status(404).json({ status: 'error', message: 'Teacher not found' });
        }

        // Fetch Activities if profile exists
        let activities = [];
        let stats = {
            totalCredits: 0,
            pending: 0,
            approved: 0,
            rejected: 0
        };

        if (teacher.teacherProfile) {
            activities = await prisma.activity.findMany({
                where: { teacherId: teacher.teacherProfile.id },
                include: { category: true },
                orderBy: { createdAt: 'desc' }
            });

            // Calculate Stats
            activities.forEach(a => {
                if (a.status === 'APPROVED') {
                    stats.approved++;
                    stats.totalCredits += a.durationHours;
                } else if (a.status === 'PENDING') {
                    stats.pending++;
                } else if (a.status === 'REJECTED') {
                    stats.rejected++;
                }
            });
        }

        res.json({
            status: 'success',
            data: {
                teacher: {
                    id: teacher.id,
                    name: teacher.name,
                    email: teacher.email,
                    department: teacher.teacherProfile?.department?.name || 'N/A',
                    status: teacher.isActive ? 'Active' : 'Inactive'
                },
                stats,
                activities
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch teacher stats' });
    }
};

module.exports = {
    submitActivity,
    getMyActivities,
    getAllActivities,
    updateActivityStatus,
    getDashboardStats,
    getTeacherStats
};
