const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        await prisma.$connect();
        console.log('Connection successful.');

        const email = 'admin@school.edu';
        console.log(`Checking for user: ${email}`);
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (user) {
            console.log('User found:', user.email);
            console.log('Role:', user.role);
        } else {
            console.log('User NOT found.');
        }

    } catch (e) {
        console.error('Database error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
