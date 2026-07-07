import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";
import { badRequest, conflict, unauthorized } from "../utils/ApiError.js";
import { signToken } from "../utils/jwt.js";
import { toPublicUser } from "../utils/userSerializer.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_REGISTER_ROLES = ["buyer", "farmer", "logistics"];

function validateRegisterInput({ name, email, password, role, phone }) {
  if (!name?.trim()) {
    throw badRequest("Full name is required.");
  }

  if (!email?.trim() || !EMAIL_PATTERN.test(email.trim())) {
    throw badRequest("A valid email address is required.");
  }

  if (!password || password.length < 6) {
    throw badRequest("Password must be at least 6 characters.");
  }

  if (!role || !ALLOWED_REGISTER_ROLES.includes(role)) {
    throw badRequest("Please select a valid account type.");
  }

  if (!phone?.trim()) {
    throw badRequest("Phone number is required.");
  }
}

export async function registerUser(input) {
  validateRegisterInput(input);

  const normalizedEmail = input.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw conflict("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email: normalizedEmail,
      phone: input.phone.trim(),
      passwordHash,
      role: input.role,
    },
  });

  const token = signToken({ sub: user.id, role: user.role });
  return { token, user: toPublicUser(user) };
}

export async function loginUser(email, password) {
  if (!email?.trim() || !password) {
    throw badRequest("Email and password are required.");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw unauthorized("Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw unauthorized("Invalid email or password.");
  }

  const token = signToken({ sub: user.id, role: user.role });
  return { token, user: toPublicUser(user) };
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw unauthorized("User not found.");
  }

  return toPublicUser(user);
}
