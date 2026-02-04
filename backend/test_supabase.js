const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Testing connection to Supabase...");
    try {
        await prisma.$connect();
        console.log("✅ Successfully connected to Supabase!");

        const userCount = await prisma.user.count();
        console.log(`✅ Database query successful. Found ${userCount} users.`);

    } catch (e) {
        console.error("❌ Connection failed!");
        console.error("Error Code:", e.code);
        console.error("Error Message:", e.message);
        console.error("\nSUGGESTIONS:");
        if (e.message.includes('Can\'t reach database server')) {
            console.log("1. Check if your Supabase project is PAUSED in the Supabase Dashboard.");
            console.log("2. Check if your network (WiFi) blocks port 5432.");
            console.log("3. Check if your database password is correct.");
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
