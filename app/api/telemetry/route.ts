import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Reading from "@/models/Reading";
import Alert from "@/models/Alert";

// Pequeño GET para probar desde el navegador
export async function GET() {
  return NextResponse.json({ ok: true, message: "telemetry api alive" });
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();
  const { id, humidity, temperature } = body;

  if (!id || !Array.isArray(humidity) || !Array.isArray(temperature)) {
    return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
  }

  const user = await User.findOne({ deviceId: id });
  if (!user) {
    return NextResponse.json(
      { error: "deviceId no registrado" },
      { status: 404 }
    );
  }

  const reading = await Reading.create({
    deviceId: id,
    humidity,
    temperature,
  });

  const avgTemp =
    temperature.reduce((acc: number, v: number) => acc + v, 0) /
    Math.max(temperature.length, 1);

  const alertTemp = user.alertTemp ?? 30;
  const isAlert = avgTemp > alertTemp;

  if (isAlert) {
    await Alert.create({
      userId: user._id,
      deviceId: id,
      avgTemperature: avgTemp,
    });
  }

  return NextResponse.json({
    ok: true,
    isAlert,
    readingId: reading._id,
  });
}
