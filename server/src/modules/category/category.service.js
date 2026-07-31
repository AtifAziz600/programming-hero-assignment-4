import prisma from "../../config/db";
export const getAllCategories = async () => {
    return prisma.category.findMany();
};
