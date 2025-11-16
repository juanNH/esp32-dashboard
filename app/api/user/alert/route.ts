import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyTokenFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();

  const payload = verifyTokenFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const user = await User.findById(payload.sub).lean();
  console.log("User found:", user);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    alertTemp: user.alertTemp ?? 30,
  });
}

export async function POST(req: NextRequest) {
  await connectDB();

  const payload = verifyTokenFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { alertTemp } = body;

  if (typeof alertTemp !== "number" || Number.isNaN(alertTemp)) {
    return NextResponse.json(
      { error: "alertTemp debe ser numérico" },
      { status: 400 }
    );
  }

  const user = await User.findById(payload.sub);
  console.log("User found for update:", user);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  user.alertTemp = alertTemp;
  await user.save();

  return NextResponse.json({ ok: true, alertTemp: user.alertTemp });
}
