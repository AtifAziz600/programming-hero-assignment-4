// src/modules/auth/auth.service.ts
import bcrypt from "bcryptjs";
import prisma from "../../config/db";
import { generateToken } from "../../utils/jwt";

export const registerUser = async (data: {
  name: string; email: string; password: string; role: "CUSTOMER" | "PROVIDER";
}) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });

  const { password, ...safeUser } = user;
  return safeUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  if (user.status === "SUSPENDED") throw new Error("Account suspended");

  const token = generateToken({ id: user.id, role: user.role });
  const { password: _, ...safeUser } = user;

  return { token, user: safeUser };
};