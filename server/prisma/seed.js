import "dotenv/config";
import prisma from "../src/config/db";
import bcrypt from "bcryptjs";
async function main() {
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await prisma.user.upsert({
        where: { email: "admin@gearup.com" },
        update: {},
        create: {
            name: "System Admin",
            email: "admin@gearup.com",
            password: adminPassword,
            role: "ADMIN",
            status: "ACTIVE",
        },
    });
    console.log("Admin user created/updated:", admin.email);
    const categories = [
        { name: "Tents" },
        { name: "Sleeping Bags" },
        { name: "Backpacks" },
        { name: "Climbing Gear" },
        { name: "Cooking Equipment" },
    ];
    for (const cat of categories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: cat,
        });
    }
    console.log("Categories seeded successfully");
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
