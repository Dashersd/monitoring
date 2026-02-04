const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Submit a new activity
const submitActivity = async (req, res) => {
    try {
        const { title, description, date, durationHours, categoryId } = req.body;
        const teacherId = req.user.id;

        // Ensure teacher profile exists
        const teacherProfile = await prisma.teacherProfile.findUnique({
            where: { userId: teacherId }
        });

        if (!teacherProfile) {
            return res.status(400).json({ status: 'error', message: 'Teacher profile incomplete' });
        }

        const activity = await prisma.$transaction(async (prisma) => {
            const act = await prisma.activity.create({
                data: {
                    title,
                    description,
                    date: new Date(date),
                    durationHours: parseFloat(durationHours),
                    status: 'PENDING',
                    teacherId: teacherProfile.id,
                    categoryId: parseInt(categoryId),
                }
            });

            // Handle Attachments if any
            if (req.files && req.files.length > 0) {
                const attachments = req.files.map(file => ({
                    filePath: file.path, // In real app, this would be a URL
                    fileType: file.mimetype,
                    activityId: act.id
                }));

                await prisma.attachment.createMany({
                    data: attachments
                });
            }

            return act;
        });

        // Notify Admins and Supervisors
        try {
            const admins = await prisma.user.findMany({
                where: {
                    role: { in: ['ADMIN', 'SUPERVISOR'] }
                }
            });

            const teacherName = req.user.name || 'A teacher';
            const adminNotifications = admins.map(admin => ({
                userId: admin.id,
                message: `${teacherName} submitted a new activity: "${title}".`
            }));

            if (adminNotifications.length > 0) {
                await prisma.notification.createMany({
                    data: adminNotifications
                });
            }
        } catch (notifyErr) {
            console.error("Failed to notify admins:", notifyErr);
        }

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
        const { status, limit } = req.query;
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
                category: true,
                attachments: true
            },
            orderBy: { createdAt: 'desc' },
            take: limit ? parseInt(limit) : undefined
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

        // Update status
        const activity = await prisma.activity.update({
            where: { id: parseInt(id) },
            data: { status },
            include: { teacher: { include: { user: true } } }
        });

        // Create Notification for Teacher
        await prisma.notification.create({
            data: {
                message: `Your activity "${activity.title}" has been ${status.toLowerCase()}.${remarks ? ' Remarks: ' + remarks : ''}`,
                userId: activity.teacher.userId
            }
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

// Get aggregated report data for Admin/Supervisor
const getReportData = async (req, res) => {
    try {
        // 1. Activity Status by Department
        const activities = await prisma.activity.findMany({
            include: {
                teacher: { include: { department: true } }
            }
        });

        const deptMap = {};
        activities.forEach(a => {
            const deptName = a.teacher?.department?.name || 'Unknown';
            if (!deptMap[deptName]) {
                deptMap[deptName] = { name: deptName, approved: 0, pending: 0, rejected: 0 };
            }
            if (a.status === 'APPROVED') deptMap[deptName].approved++;
            else if (a.status === 'PENDING') deptMap[deptName].pending++;
            else if (a.status === 'REJECTED') deptMap[deptName].rejected++;
        });
        const departmentData = Object.values(deptMap);

        // 2. Credits by Category
        const catCredits = await prisma.activity.groupBy({
            by: ['categoryId'],
            where: { status: 'APPROVED' },
            _sum: { durationHours: true }
        });

        const categories = await prisma.serviceCategory.findMany();
        const pieData = categories.map(cat => {
            const sum = catCredits.find(c => c.categoryId === cat.id)?._sum?.durationHours || 0;
            return { name: cat.name, value: sum };
        }).filter(item => item.value > 0);

        // 3. Top Performing Teachers
        const teacherCredits = await prisma.activity.groupBy({
            by: ['teacherId'],
            where: { status: 'APPROVED' },
            _sum: { durationHours: true },
            orderBy: { _sum: { durationHours: 'desc' } },
            take: 5
        });

        const topTeachers = await Promise.all(teacherCredits.map(async (tc, index) => {
            const profile = await prisma.teacherProfile.findUnique({
                where: { id: tc.teacherId },
                include: {
                    user: { select: { name: true } },
                    department: true
                }
            });
            return {
                rank: index + 1,
                name: profile?.user?.name || 'Unknown',
                department: profile?.department?.name || 'N/A',
                credits: tc._sum.durationHours
            };
        }));

        res.json({
            status: 'success',
            data: {
                departmentData,
                pieData,
                topTeachers
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch report data' });
    }
};

// Get stats for the logged-in teacher (Dashboard)
const getMyStats = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const teacherProfile = await prisma.teacherProfile.findUnique({
            where: { userId: teacherId }
        });

        if (!teacherProfile) {
            return res.json({
                status: 'success',
                data: {
                    totalCredits: 0,
                    pendingSubmissions: 0,
                    approvedActivities: 0,
                    creditTrend: 0,
                    approvedTrend: 0
                }
            });
        }

        const tId = teacherProfile.id;
        const now = new Date();
        const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Total Service Credits (Approved)
        const totalCreditsAgg = await prisma.activity.aggregate({
            _sum: { durationHours: true },
            where: { teacherId: tId, status: 'APPROVED' }
        });
        const totalCredits = totalCreditsAgg._sum.durationHours || 0;

        // Credit Trend (Approved this month)
        const currentMonthCreditsAgg = await prisma.activity.aggregate({
            _sum: { durationHours: true },
            where: {
                teacherId: tId,
                status: 'APPROVED',
                updatedAt: { gte: firstDayCurrentMonth }
            }
        });
        const creditTrend = currentMonthCreditsAgg._sum.durationHours || 0;

        // 2. Pending Submissions (Current Count)
        const pendingSubmissions = await prisma.activity.count({
            where: { teacherId: tId, status: 'PENDING' }
        });

        // 3. Approved Activities (Total Count)
        const approvedActivities = await prisma.activity.count({
            where: { teacherId: tId, status: 'APPROVED' }
        });

        // Approved Trend (Approved count this month)
        const approvedTrend = await prisma.activity.count({
            where: {
                teacherId: tId,
                status: 'APPROVED',
                updatedAt: { gte: firstDayCurrentMonth }
            }
        });

        res.json({
            status: 'success',
            data: {
                totalCredits: Math.round(totalCredits * 100) / 100,
                pendingSubmissions,
                approvedActivities,
                creditTrend: Math.round(creditTrend * 100) / 100,
                approvedTrend
            }
        });

    } catch (error) {
        console.error("Error fetching my stats:", error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch dashboard stats' });
    }
};

module.exports = {
    submitActivity,
    getMyActivities,
    getAllActivities,
    updateActivityStatus,
    getDashboardStats,
    getTeacherStats,
    getReportData,
    getMyStats
};
