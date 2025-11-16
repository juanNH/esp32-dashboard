"use client";

import { useEffect, useState } from "react";

interface TempAlertData {
  deviceId: string;
  avgTemperature: number;
  createdAt: string;
}

export default function AlertListener() {
  const [alert, setAlert] = useState<TempAlertData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const url = `/api/alerts/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.addEventListener("tempAlert", (event) => {
      const data = JSON.parse((event as MessageEvent).data) as TempAlertData;
      setAlert(data);
    });

    es.addEventListener("error", () => {
      // opcional: reconectar manual si se cae
      console.warn("SSE error");
    });

    return () => {
      es.close();
    };
  }, []);

  if (!alert) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
      <div className="bg-red-600 text-white rounded-xl px-4 py-3 shadow-lg flex flex-col gap-1">
        <div className="flex justify-between items-center gap-2">
          <span className="font-semibold text-sm">
            ¡Alerta de temperatura!
          </span>
          <button
            className="text-xs underline"
            onClick={() => setAlert(null)}
          >
            Cerrar
          </button>
        </div>
        <p className="text-xs">
          Dispositivo: <span className="font-mono">{alert.deviceId}</span>
        </p>
        <p className="text-sm">
          Temperatura promedio detectada:{" "}
          <span className="font-semibold">
            {alert.avgTemperature.toFixed(1)}°C
          </span>
        </p>
        <p className="text-[10px] text-red-200">
          {new Date(alert.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
