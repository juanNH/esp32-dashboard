import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Reading from "@/models/Reading";
import { verifyTokenFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();

  const payload = verifyTokenFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { deviceId } = payload;

  const last = await Reading.findOne({ deviceId })
    .sort({ createdAt: -1 })
    .lean();

  if (!last) {
    return NextResponse.json(
      { error: "No hay lecturas aún" },
      { status: 404 }
    );
  }

  const humidityArr = last.humidity as number[];
  const tempArr = last.temperature as number[];

  const avgHumidity =
    humidityArr.reduce((acc, v) => acc + v, 0) /
    Math.max(humidityArr.length, 1);

  const avgTemperature =
    tempArr.reduce((acc, v) => acc + v, 0) /
    Math.max(tempArr.length, 1);

  return NextResponse.json({
    deviceId,
    avgHumidity,
    avgTemperature,
    createdAt: last.createdAt,
  });
}
