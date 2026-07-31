import { verifyToken } from "../utils/jwt";
import prisma from "../config/db";
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user)
            return res.status(401).json({ success: false, message: "User not found" });
        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
