import type { UserRole } from "./authStorage";
import { DEMO_USERS, type StoredUser } from "./demoUsers";

const USERS_STORAGE_KEY = "agrivo_registered_users";

function readRegisteredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRegisteredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getAllUsers(): StoredUser[] {
  const registered = readRegisteredUsers();
  const demoEmails = new Set(DEMO_USERS.map((user) => user.email.toLowerCase()));
  const customUsers = registered.filter((user) => !demoEmails.has(user.email.toLowerCase()));
  return [...DEMO_USERS, ...customUsers];
}

export function findUserByEmail(email: string): StoredUser | null {
  const normalized = email.trim().toLowerCase();
  return getAllUsers().find((user) => user.email.toLowerCase() === normalized) ?? null;
}

export function emailExists(email: string): boolean {
  return findUserByEmail(email) !== null;
}

export function createRegisteredUser(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}): StoredUser {
  const registered = readRegisteredUsers();
  const demoEmails = new Set(DEMO_USERS.map((user) => user.email.toLowerCase()));
  const normalizedEmail = input.email.trim().toLowerCase();

  if (demoEmails.has(normalizedEmail)) {
    throw new Error("This email is reserved for demo accounts.");
  }

  if (registered.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const newUser: StoredUser = {
    id: `user_${Date.now()}`,
    name: input.name.trim(),
    email: normalizedEmail,
    phone: input.phone.trim(),
    password: input.password,
    role: input.role,
  };

  writeRegisteredUsers([...registered, newUser]);
  return newUser;
}

export function toAuthUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
}
