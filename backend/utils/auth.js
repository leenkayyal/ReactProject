import crypto from "node:crypto";
import express from "express";
import { Op } from "sequelize";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";

const SALT_LEN = 32;
const KEY_LEN = 64;
const ITERATIONS = 310000;
const DIGEST = "sha512";
const ENCODING = "base64url"; // Use base64 for storing binary data in the database

export function hashPassword(password) {
  const normalizedPassword = password.normalize("NFKC");
  const salt = crypto.randomBytes(SALT_LEN);
  const passwordBuffer = Buffer.from(normalizedPassword, "utf8");
  const hash = crypto.pbkdf2Sync(
    passwordBuffer,
    salt,
    ITERATIONS,
    KEY_LEN,
    DIGEST,
  );

  return JSON.stringify({
    salt: salt.toString(ENCODING),
    hash: hash.toString(ENCODING),
    v: 1,
  });
}

export function verifyPassword(password, stored) {
  const normalizedPassword = password.normalize("NFKC");
  const passwordBuffer = Buffer.from(normalizedPassword, "utf8");

  const { salt, hash: storedHash, v } = JSON.parse(stored);
  const saltBuffer = Buffer.from(salt, ENCODING);
  const storedHashBuffer = Buffer.from(storedHash, ENCODING);

  const hash = crypto.pbkdf2Sync(
    passwordBuffer,
    saltBuffer,
    ITERATIONS,
    KEY_LEN,
    DIGEST,
  );

  return crypto.timingSafeEqual(storedHashBuffer, hash);
}

export function generateToken() {
  return crypto.randomBytes(32).toString(ENCODING);
}

export async function createSession(userId) {
  await Session.destroy({
    where: {
      userId,
      expiresAt: { [Op.lt]: new Date() },
    },
  });

  const token = crypto.randomBytes(32).toString(ENCODING);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await Session.create({ token, userId, expiresAt });
  return token;
}

export async function verifySession(token) {
  const session = await Session.findOne({
    where: { token, expiresAt: { [Op.gt]: new Date() } },
    include: [{ model: User, attributes: ["id", "email"] }],
  });

  return session;
}

export async function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const session = await verifySession(token);
    if (!session) {
      res.clearCookie("token");
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    req.user = session.User;
    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
}

export async function deleteSession(token) {
  await Session.destroy({
    where: { token },
  });
}
