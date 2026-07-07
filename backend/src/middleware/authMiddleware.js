import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../config/prisma.js";
import { unauthorized } from "../utils/ApiError.js";

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      throw unauthorized("Authentication token is required.");
    }

    const token = header.slice("Bearer ".length).trim();
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw unauthorized("Invalid authentication token.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      next(unauthorized("Invalid or expired authentication token."));
      return;
    }
    next(error);
  }
}
