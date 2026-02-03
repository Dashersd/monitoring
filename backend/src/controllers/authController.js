const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
    try {
        const { email, password, name, role, department } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User Transaction
        const newUser = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: role || 'TEACHER',
                },
            });

            // If user is a teacher, create profile
            if (user.role === 'TEACHER' && department) {
                // Find department ID (assuming seed data exists or created on fly)
                let dept = await prisma.department.findUnique({ where: { name: department } });
                if (!dept) {
                    dept = await prisma.department.create({ data: { name: department } });
                }

                await prisma.teacherProfile.create({
                    data: {
                        userId: user.id,
                        departmentId: dept.id
                    }
                });
            }

            return user;
        });

        res.status(201).json({ status: 'success', message: 'User registered successfully', userId: newUser.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Registration failed', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ status: 'error', message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ status: 'error', message: 'Invalid password' });
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            status: 'success',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Login failed' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ status: 'error', message: 'Current password incorrect' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });

        res.json({ status: 'success', message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to change password' });
    }
};

module.exports = { register, login, changePassword };
