"use client";

import { useEffect, useState } from "react";

interface Reading {
  _id: string;
  deviceId: string;
  humidity: number[];
  temperature: number[];
  createdAt: string;
}

export default function DashboardPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("No hay sesión iniciada");
      return;
    }

    const fetchData = async () => {
      const res = await fetch("/api/readings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || "Error");
      else setReadings(data.readings || []);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard de lecturas</h1>
      {msg && <p className="text-red-600">{msg}</p>}
      {!msg && (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-2">Fecha</th>
                <th className="text-left py-2 px-2">Humedad</th>
                <th className="text-left py-2 px-2">Temperatura</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((r) => (
                <tr key={r._id} className="border-b last:border-0">
                  <td className="py-2 px-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-2">
                    {JSON.stringify(r.humidity)}
                  </td>
                  <td className="py-2 px-2">
                    {JSON.stringify(r.temperature)}
                  </td>
                </tr>
              ))}
              {readings.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-500">
                    Aún no hay lecturas para tu dispositivo.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
