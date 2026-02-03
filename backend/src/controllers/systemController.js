const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all teachers
// Get all teachers
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await prisma.user.findMany({
            where: { role: 'TEACHER' },
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                createdAt: true,
                teacherProfile: {
                    include: {
                        department: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Format data for frontend
        const formatted = teachers.map(t => ({
            id: t.id,
            name: t.name,
            email: t.email,
            status: t.isActive ? 'Active' : 'Inactive',
            department: t.teacherProfile?.department?.name || 'N/A',
            departmentId: t.teacherProfile?.departmentId,
            joinDate: t.createdAt
        }));

        res.json({ status: 'success', data: formatted });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch teachers' });
    }
};

// Seed basic data (Departments and Categories)
const seedData = async (req, res) => {
    try {
        // Categories
        const categories = ['Training', 'Workshop', 'Community Service', 'Publication', 'Other'];
        for (const cat of categories) {
            await prisma.serviceCategory.upsert({
                where: { name: cat },
                update: {},
                create: { name: cat }
            });
        }

        // Departments
        const departments = ['Science', 'Mathematics', 'English', 'History', 'Physical Education', 'Arts'];
        for (const dept of departments) {
            await prisma.department.upsert({
                where: { name: dept },
                update: {},
                create: { name: dept }
            });
        }

        res.json({ status: 'success', message: 'Reference data seeded' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Seeding failed' });
    }
};

const getReferenceData = async (req, res) => {
    try {
        const categories = await prisma.serviceCategory.findMany();
        const departments = await prisma.department.findMany();
        res.json({ status: 'success', data: { categories, departments } });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch reference data' });
    }
}

const bcrypt = require('bcrypt');

const createTeacher = async (req, res) => {
    try {
        const { name, email, password, departmentId } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: 'TEACHER',
                    isActive: true
                }
            });

            if (departmentId) {
                await prisma.teacherProfile.create({
                    data: {
                        userId: user.id,
                        departmentId: parseInt(departmentId)
                    }
                });
            }
        });

        res.status(201).json({ status: 'success', message: 'Teacher created successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to create teacher' });
    }
};

// Update Teacher (Edit Profile / Status)
const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, departmentId, status } = req.body; // status: 'Active' | 'Inactive'

        const isActive = status === 'Active';

        await prisma.$transaction(async (prisma) => {
            // Update User
            await prisma.user.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    email,
                    isActive
                }
            });

            // Update Department if provided
            if (departmentId) {
                // Check if profile exists
                const profile = await prisma.teacherProfile.findUnique({ where: { userId: parseInt(id) } });
                if (profile) {
                    await prisma.teacherProfile.update({
                        where: { userId: parseInt(id) },
                        data: { departmentId: parseInt(departmentId) }
                    });
                } else {
                    await prisma.teacherProfile.create({
                        data: { userId: parseInt(id), departmentId: parseInt(departmentId) }
                    });
                }
            }
        });

        res.json({ status: 'success', message: 'Teacher updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Failed to update teacher' });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        // Default password or generated one. For now, hardcode or use a default.
        // In real app, maybe send email. Here: set to "welcome123"
        const newPassword = "welcome123";
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: parseInt(id) },
            data: { password: hashedPassword }
        });

        res.json({ status: 'success', message: 'Password reset to "welcome123"' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to reset password' });
    }
};

module.exports = {
    getAllTeachers,
    seedData,
    getReferenceData,
    createTeacher,
    updateTeacher,
    resetPassword
};
