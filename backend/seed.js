const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@school.edu' },
        update: {},
        create: {
            email: 'admin@school.edu',
            password: password,
            name: 'System Admin',
            role: 'ADMIN',
        },
    });
    console.log({ admin });

    // 2. Create Supervisor
    const supervisor = await prisma.user.upsert({
        where: { email: 'supervisor@school.edu' },
        update: {},
        create: {
            email: 'supervisor@school.edu',
            password: password,
            name: 'Academic Supervisor',
            role: 'SUPERVISOR',
        },
    });
    console.log({ supervisor });

    // 3. Create Department
    const scienceDept = await prisma.department.upsert({
        where: { name: 'Science' },
        update: {},
        create: {
            name: 'Science',
            description: 'Science Department'
        }
    });

    // 4. Create Teacher
    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@school.edu' },
        update: {},
        create: {
            email: 'teacher@school.edu',
            password: password,
            name: 'John Doe',
            role: 'TEACHER',
            teacherProfile: {
                create: {
                    departmentId: scienceDept.id
                }
            }
        },
    });
    console.log({ teacher });

    // 5. Create Service Categories
    const categories = ['Training', 'Committee', 'Event/Workshop', 'Community Service'];
    for (const cat of categories) {
        await prisma.serviceCategory.upsert({
            where: { name: cat },
            update: {},
            create: { name: cat }
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
