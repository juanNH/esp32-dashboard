"use client";

import { useState, useMemo } from "react";
import { Reading } from "./types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  readings: Reading[];
}

const avg = (arr?: number[]): number | null => {
  if (!arr || arr.length === 0) return null;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
};

// Tooltip personalizado
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0].payload;

  return (
    <div className="bg-white border rounded shadow p-2 text-sm">
      <div>
        <strong>Fecha:</strong> {new Date(item.rawDate).toLocaleString()}
      </div>
      <div>
        <strong>Valor:</strong> {item.value.toFixed(2)}
      </div>
    </div>
  );
}

export function ReadingsCharts({ readings }: Props) {
  const [limit, setLimit] = useState<10 | 50 | 100 | "todos">(10);

  // Ordenar lecturas más viejas → más nuevas
  const ordered = useMemo(() => {
    return [...readings].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
  }, [readings]);

  // Aplicar límite (10, 50, 100, todos)
  const limited = useMemo(() => {
    if (limit === "todos") return ordered;
    return ordered.slice(-limit);
  }, [ordered, limit]);

  // Datos para gráficos
  const temperatureData = limited
    .map((r, i) => ({
      idx: i + 1,
      value: avg(r.temperature),
      rawDate: r.createdAt,
    }))
    .filter((d) => d.value !== null);

  const humidityData = limited
    .map((r, i) => ({
      idx: i + 1,
      value: avg(r.humidity),
      rawDate: r.createdAt,
    }))
    .filter((d) => d.value !== null);

  if (temperatureData.length === 0 && humidityData.length === 0) {
    return (
      <p className="text-center text-slate-500 mt-4">
        Aún no hay datos suficientes para mostrar los gráficos.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-10">

      {/* Selector de cantidad de envíos */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-700">Mostrar:</span>

        <select
          value={limit}
          onChange={(e) =>
            setLimit(
              e.target.value === "todos"
                ? "todos"
                : (Number(e.target.value) as 10 | 50 | 100)
            )
          }
          className="border rounded px-2 py-1 text-sm"
        >
          <option value={10}>Últimos 10 envíos</option>
          <option value={50}>Últimos 50 envíos</option>
          <option value={100}>Últimos 100 envíos</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      {/* GRÁFICO TEMPERATURA */}
      <div className="w-full h-72">
        <h2 className="text-md font-semibold mb-2">
          Temperatura promedio por envío
        </h2>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={temperatureData}
            margin={{ top: 10, right: 20, bottom: 30, left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="idx"
              label={{ value: "Envíos", position: "insideBottom" }}
            />
            <YAxis
              label={{
                value: "°C",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name="Temperatura"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* GRÁFICO HUMEDAD */}
      <div className="w-full h-72">
        <h2 className="text-md font-semibold mb-2">
          Humedad promedio por envío
        </h2>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={humidityData}
            margin={{ top: 10, right: 20, bottom: 30, left: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="idx"
              label={{ value: "Envíos", position: "insideBottom" }}
            />
            <YAxis
              label={{
                value: "%",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name="Humedad"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
