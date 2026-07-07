const PUBLIC_USER_FIELDS = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

export function toPublicUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? null,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export { PUBLIC_USER_FIELDS };
