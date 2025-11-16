import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET!;

export interface JwtPayload {
  id(id: any): unknown;
  sub: string;
  deviceId: string;
  iat: number;
  exp: number;
}

export function signToken(user: { _id: any; deviceId: string }) {
  const payload = { sub: user._id.toString(), deviceId: user.deviceId };
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

export function verifyTokenFromRequest(req: NextRequest): JwtPayload | null {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch (e) {
    console.error("Error verificando token:", e);
    return null;
  }
}
