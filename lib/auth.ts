import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key",
);

interface UserPayload {
  userId: number;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: UserPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as UserPayload;
  } catch {
    return null;
  }
}

export async function createUser(
  email: string,
  password: string,
  name?: string,
) {
  const hashedPassword = await hashPassword(password);
  const result = await db.execute({
    sql: "INSERT INTO users (email, password, name) VALUES (?, ?, ?) RETURNING id",
    args: [email, hashedPassword, name || ""],
  });
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await db.execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email],
  });
  return result.rows[0];
}

export async function updateUser(
  userId: number,
  updates: { name?: string; email?: string; password?: string },
) {
  const fields = [];
  const args = [];
  if (updates.name !== undefined) {
    fields.push("name = ?");
    args.push(updates.name);
  }
  if (updates.email !== undefined) {
    fields.push("email = ?");
    args.push(updates.email);
  }
  if (updates.password) {
    const hashed = await hashPassword(updates.password);
    fields.push("password = ?");
    args.push(hashed);
  }
  if (fields.length === 0) return;
  args.push(userId);
  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  await db.execute({ sql, args });
}

export async function initDb() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
