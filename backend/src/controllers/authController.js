import * as authService from "../services/authService.js";

export async function register(req, res) {
  const { name, email, phone, password, role } = req.body || {};

  if (!name || !email || !phone || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "name, email, phone, password, and role are required.",
    });
  }

  const result = await authService.registerUser({ name, email, phone, password, role });

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    token: result.token,
    user: result.user,
  });
}

export async function login(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const result = await authService.loginUser(email, password);

  res.json({
    success: true,
    message: "Login successful.",
    token: result.token,
    user: result.user,
  });
}

export async function me(req, res) {
  const user = await authService.getCurrentUser(req.user.id);

  res.json({
    success: true,
    user,
  });
}
