import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await connectDB();
  const { username, password, deviceId } = await req.json();

  if (!username || !password || !deviceId) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const exists = await User.findOne({ 
    $or: [{ username }, { deviceId }]
  });

  if (exists) {
    return NextResponse.json(
      { error: "Usuario o DeviceID ya utilizado" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    username,
    passwordHash,
    deviceId
  });

  return NextResponse.json({ ok: true });
}
