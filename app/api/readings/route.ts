import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reading from "@/models/Reading";
import { verifyTokenFromRequest } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const payload = verifyTokenFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { deviceId } = payload;

  const readings = await Reading.find({ deviceId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ readings });
}
