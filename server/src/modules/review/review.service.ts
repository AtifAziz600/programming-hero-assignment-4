// src/modules/review/review.service.ts
import prisma from "../../config/db";

export const createReview = async (
  customerId: string,
  data: { gearItemId: string; rating: number; comment?: string }
) => {
  // enforce: customer must have an order for this gear that's RETURNED
  const hasReturnedRental = await prisma.rentalOrder.findFirst({
    where: {
      customerId,
      status: "RETURNED",
      items: { some: { gearItemId: data.gearItemId } },
    },
  });
  if (!hasReturnedRental) throw new Error("You can only review gear you've rented and returned");

  return prisma.review.create({ data: { ...data, customerId } });
};