import "dotenv/config";
import prisma from "../src/config/db";
import bcrypt from "bcryptjs";

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const customerPassword = await bcrypt.hash("cust1234", 10);
  const providerPassword = await bcrypt.hash("prov1234", 10);

  // Clean up existing data
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.rentalOrderItem.deleteMany();
  await prisma.rentalOrder.deleteMany();
  await prisma.gearItem.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  // Admin user
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@gearup.com",
      password: adminPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  console.log("Admin user created:", admin.email);

  // Customer user
  const customer = await prisma.user.create({
    data: {
      name: "Alice Customer",
      email: "customer@gearup.com",
      password: customerPassword,
      role: "CUSTOMER",
      status: "ACTIVE",
    },
  });
  console.log("Customer user created:", customer.email);

  // Provider user
  const provider = await prisma.user.create({
    data: {
      name: "Outdoor Gear Pro",
      email: "provider@gearup.com",
      password: providerPassword,
      role: "PROVIDER",
      status: "ACTIVE",
    },
  });
  console.log("Provider user created:", provider.email);

  // Categories
  const tent = await prisma.category.create({ data: { name: "Tents" } });
  const sleepingBag = await prisma.category.create({ data: { name: "Sleeping Bags" } });
  const backpack = await prisma.category.create({ data: { name: "Backpacks" } });
  const climbing = await prisma.category.create({ data: { name: "Climbing Gear" } });
  const cooking = await prisma.category.create({ data: { name: "Cooking Equipment" } });
  console.log("Categories seeded");

  // Gear items
  await prisma.gearItem.createMany({
    data: [
      { name: "4-Person Tent", description: "Waterproof 4-person tent with rainfly", brand: "Coleman", pricePerDay: 25, categoryId: tent.id, stock: 5, images: ["https://example.com/tent1.jpg"], isAvailable: true, providerId: provider.id },
      { name: "Down Sleeping Bag", description: "Warm down sleeping bag rated to -10C", brand: "Kelty", pricePerDay: 15, categoryId: sleepingBag.id, stock: 8, images: ["https://example.com/sleepingbag1.jpg"], isAvailable: true, providerId: provider.id },
      { name: "Hiking Backpack 60L", description: "Large hiking backpack with hydration system", brand: "Osprey", pricePerDay: 20, categoryId: backpack.id, stock: 3, images: ["https://example.com/backpack1.jpg"], isAvailable: true, providerId: provider.id },
      { name: "Climbing Harness", description: "Professional climbing harness with gear loops", brand: "Black Diamond", pricePerDay: 10, categoryId: climbing.id, stock: 6, images: ["https://example.com/harness1.jpg"], isAvailable: true, providerId: provider.id },
      { name: "Camping Stove", description: "Portable propane camping stove", brand: "Jetboil", pricePerDay: 12, categoryId: cooking.id, stock: 4, images: ["https://example.com/stove1.jpg"], isAvailable: true, providerId: provider.id },
    ],
  });
  console.log("Gear items seeded");
  console.log("Seed complete!");
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
