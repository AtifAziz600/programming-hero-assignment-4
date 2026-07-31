// src/modules/gear/gear.service.ts
import prisma from "../../config/db";
export const getAllGear = async (filters) => {
    return prisma.gearItem.findMany({
        where: {
            isAvailable: true,
            ...(filters.category && { categoryId: filters.category }),
            ...(filters.brand && { brand: { equals: filters.brand, mode: "insensitive" } }),
            ...(filters.minPrice || filters.maxPrice
                ? {
                    pricePerDay: {
                        ...(filters.minPrice && { gte: Number(filters.minPrice) }),
                        ...(filters.maxPrice && { lte: Number(filters.maxPrice) }),
                    },
                }
                : {}),
        },
        include: { category: true, provider: { select: { id: true, name: true } } },
    });
};
export const getGearById = async (id) => {
    const gear = await prisma.gearItem.findUnique({
        where: { id },
        include: { category: true, provider: { select: { id: true, name: true } }, reviews: true },
    });
    if (!gear)
        throw new Error("Gear not found");
    return gear;
};
export const createGear = async (providerId, data) => {
    return prisma.gearItem.create({ data: { ...data, providerId } });
};
export const updateGear = async (providerId, gearId, data) => {
    const gear = await prisma.gearItem.findUnique({ where: { id: gearId } });
    if (!gear)
        throw new Error("Gear not found");
    if (gear.providerId !== providerId)
        throw new Error("Not your gear item");
    return prisma.gearItem.update({ where: { id: gearId }, data });
};
export const deleteGear = async (providerId, gearId) => {
    const gear = await prisma.gearItem.findUnique({ where: { id: gearId } });
    if (!gear)
        throw new Error("Gear not found");
    if (gear.providerId !== providerId)
        throw new Error("Not your gear item");
    return prisma.gearItem.delete({ where: { id: gearId } });
};
