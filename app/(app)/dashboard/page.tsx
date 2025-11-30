// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Reading } from "./types";
import { ReadingsTable } from "./ReadingsTable";
import { ReadingsCharts } from "./ReadingsCharts";

type TabKey = "tabla" | "graficos";

export default function DashboardPage() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [msg, setMsg] = useState("");
  const [tab, setTab] = useState<TabKey>("tabla");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMsg("No hay sesión iniciada");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/readings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) setMsg(data.error || "Error");
        else setReadings(data.readings || []);
      } catch (err) {
        console.error(err);
        setMsg("Error de conexión con el servidor");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard de lecturas</h1>

      {msg && <p className="text-red-600">{msg}</p>}

      {!msg && (
        <div className="bg-white rounded-xl shadow p-4">
          {/* Tabs */}
          <div className="mb-4 inline-flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setTab("tabla")}
              className={`px-4 py-2 text-sm ${
                tab === "tabla"
                  ? "bg-slate-200 font-semibold"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              Tabla de lecturas
            </button>
            <button
              onClick={() => setTab("graficos")}
              className={`px-4 py-2 text-sm ${
                tab === "graficos"
                  ? "bg-slate-200 font-semibold"
                  : "bg-white hover:bg-slate-50"
              }`}
            >
              Gráficos Temperatura / Humedad
            </button>
          </div>

          {tab === "tabla" && <ReadingsTable readings={readings} />}
          {tab === "graficos" && <ReadingsCharts readings={readings} />}
        </div>
      )}
    </div>
  );
}
