const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get user notifications
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        res.json({ status: 'success', data: notifications });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch notifications' });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.notification.update({
            where: { id: parseInt(id) },
            data: { isRead: true }
        });

        res.json({ status: 'success', message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update notification' });
    }
};

// Mark all as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });

        res.json({ status: 'success', message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update notifications' });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
