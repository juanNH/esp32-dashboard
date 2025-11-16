import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Alert from "@/models/Alert";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

function sseEvent(event: string, data: any) {
  return encoder.encode(
    `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
  );
}

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("No token", { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return new Response("Token inválido", { status: 401 });
  }

  const userId = payload.sub as string;

  const stream = new ReadableStream({
    async start(controller) {
      // mensaje inicial
      controller.enqueue(
        sseEvent("connected", { ok: true })
      );

      let lastCheck = new Date();

      async function loop() {
        try {
          while (true) {
            const alerts = await Alert.find({
              userId,
              createdAt: { $gt: lastCheck },
            })
              .sort({ createdAt: 1 })
              .lean();

            if (alerts.length > 0) {
              lastCheck = alerts[alerts.length - 1]
                .createdAt as Date;

              for (const alert of alerts) {
                controller.enqueue(
                  sseEvent("tempAlert", {
                    deviceId: alert.deviceId,
                    avgTemperature: alert.avgTemperature,
                    createdAt: alert.createdAt,
                  })
                );
              }
            }

            // dormir 3 segundos
            await new Promise((res) => setTimeout(res, 3000));
          }
        } catch (e) {
          console.error("SSE loop error", e);
          controller.close();
        }
      }

      loop();
    },
    cancel() {
      console.log("SSE connection closed");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
