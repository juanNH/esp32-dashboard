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

  const temperatureArr = temperature.filter((v: number | null) => typeof v === "number" && Number.isFinite(v));

  const avgTemp =
  temperatureArr.length > 0
    ? temperatureArr.reduce((acc: number, v: number) => acc + v, 0) /
      temperatureArr.length
    : null;


  const alertTemp = user.alertTemp ?? 30;
  const isAlert = avgTemp !== null && avgTemp > alertTemp;

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
    avgTemperature: avgTemp,
    readingId: reading._id,
  });
}
