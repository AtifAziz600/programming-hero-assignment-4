// src/modules/rental/rental.service.ts
import prisma from "../../config/db";
export const createRentalOrder = async (customerId, data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (days <= 0)
        throw new Error("End date must be after start date");
    return prisma.$transaction(async (tx) => {
        let total = 0;
        const orderItemsData = [];
        for (const item of data.items) {
            const gear = await tx.gearItem.findUnique({ where: { id: item.gearItemId } });
            if (!gear)
                throw new Error(`Gear item ${item.gearItemId} not found`);
            if (gear.stock < item.quantity)
                throw new Error(`Not enough stock for ${gear.name}`);
            const lineTotal = Number(gear.pricePerDay) * item.quantity * days;
            total += lineTotal;
            orderItemsData.push({
                gearItemId: gear.id,
                quantity: item.quantity,
                pricePerDay: gear.pricePerDay,
            });
            // decrement stock
            await tx.gearItem.update({
                where: { id: gear.id },
                data: { stock: { decrement: item.quantity } },
            });
        }
        return tx.rentalOrder.create({
            data: {
                customerId,
                startDate: start,
                endDate: end,
                totalAmount: total,
                items: { create: orderItemsData },
            },
            include: { items: { include: { gearItem: true } } },
        });
    });
};
export const getUserRentals = async (customerId) => {
    return prisma.rentalOrder.findMany({
        where: { customerId },
        include: { items: { include: { gearItem: true } }, payments: true },
        orderBy: { createdAt: "desc" },
    });
};
export const getRentalById = async (id, userId, role) => {
    const rental = await prisma.rentalOrder.findUnique({
        where: { id },
        include: { items: { include: { gearItem: true } }, payments: true, customer: true },
    });
    if (!rental)
        throw new Error("Rental order not found");
    // customers can only see their own orders; providers/admins bypass this check
    if (role === "CUSTOMER" && rental.customerId !== userId)
        throw new Error("Forbidden");
    return rental;
};
