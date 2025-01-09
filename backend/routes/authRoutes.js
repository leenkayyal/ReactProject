import express from "express";
import { User } from "../models/User.js";
import {
  hashPassword,
  verifyPassword,
  createSession,
  deleteSession,
  requireAuth,
  verifySession,
} from "../utils/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!password || password.length < 8) {
    return res.status(400).json({ error: "Password too short" });
  }

  try {
    const hashedPassword = hashPassword(password);
    const user = await User.create({ email, password: hashedPassword });

    const token = createSession(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = await createSession(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: "localhost", // Important!
      path: "/",
    });

    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    await deleteSession(req.cookies.token);
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/me", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // Get user ID from session token
    const session = await verifySession(token);
    const user = session.User;

    if (!user) {
      res.clearCookie("token");
      return res.status(401).json({ error: "Invalid session" });
    }

    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as authRoutes };
