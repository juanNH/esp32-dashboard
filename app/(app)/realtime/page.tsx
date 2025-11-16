"use client";

import { useEffect, useState } from "react";

interface LatestReading {
  deviceId: string;
  avgHumidity: number;
  avgTemperature: number;
  createdAt: string;
}

export default function RealtimePage() {
  const [data, setData] = useState<LatestReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchLatest() {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay sesión iniciada");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/readings/latest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Error al obtener datos");
        setData(null);
      } else {
        setError(null);
        setData(json);
      }
    } catch {
      setError("Error de red");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLatest();
    const id = setInterval(fetchLatest, 60_000); // cada 1 minuto
    return () => clearInterval(id);
  }, []);

  const lastUpdate =
    data?.createdAt && new Date(data.createdAt).toLocaleString();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
            Último envío
          </h1>
          <p className="text-center text-sm text-slate-500 mb-4">
            Promedio de la última lectura recibida desde el dispositivo
          </p>

          {loading && (
            <p className="text-center text-slate-500">Cargando...</p>
          )}

          {!loading && error && (
            <p className="text-center text-red-600 text-sm">{error}</p>
          )}

          {!loading && data && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Device ID
                </span>
                <span className="font-mono text-xs sm:text-sm break-all">
                  {data.deviceId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-xs uppercase tracking-wide text-slate-500 text-center">
                    Humedad promedio<br />último envío
                  </span>
                  <span className="text-3xl sm:text-4xl font-bold mt-2">
                    {data.avgHumidity.toFixed(1)}
                    <span className="text-lg text-slate-500 ml-1">%</span>
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 flex flex-col items-center">
                  <span className="text-xs uppercase tracking-wide text-slate-500 text-center">
                    Temperatura promedio<br />último envío
                  </span>
                  <span className="text-3xl sm:text-4xl font-bold mt-2">
                    {data.avgTemperature.toFixed(1)}
                    <span className="text-lg text-slate-500 ml-1">°C</span>
                  </span>
                </div>
              </div>

              {lastUpdate && (
                <p className="text-xs text-center text-slate-500">
                  Última actualización: {lastUpdate}
                </p>
              )}

              <button
                onClick={fetchLatest}
                className="w-full mt-2 bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-700 active:scale-[0.99] transition"
              >
                Actualizar ahora
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
