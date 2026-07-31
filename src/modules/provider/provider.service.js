// src/modules/provider/provider.service.ts
import prisma from "../../config/db";
export const getProviderOrders = async (providerId) => {
    return prisma.rentalOrder.findMany({
        where: { items: { some: { gearItem: { providerId } } } },
        include: { items: { include: { gearItem: true } }, customer: { select: { id: true, name: true } } },
    });
};
export const updateOrderStatus = async (providerId, orderId, status) => {
    const order = await prisma.rentalOrder.findUnique({
        where: { id: orderId },
        include: { items: { include: { gearItem: true } } },
    });
    if (!order)
        throw new Error("Order not found");
    const ownsOrder = order.items.some((i) => i.gearItem.providerId === providerId);
    if (!ownsOrder)
        throw new Error("Forbidden: not your order");
    return prisma.rentalOrder.update({ where: { id: orderId }, data: { status } });
};
