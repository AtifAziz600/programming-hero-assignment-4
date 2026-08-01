// src/modules/admin/admin.service.ts
import prisma from "../../config/db";

export const getAllUsers = () => prisma.user.findMany({ omit: { password: true } });

export const updateUserStatus = (id: string, status: "ACTIVE" | "SUSPENDED") =>
  prisma.user.update({ where: { id }, data: { status } });

export const getAllGearAdmin = () => prisma.gearItem.findMany({ include: { provider: true, category: true } });
     
export const getAllRentalsAdmin = () => prisma.rentalOrder.findMany({ include: { items: true, customer: true } });