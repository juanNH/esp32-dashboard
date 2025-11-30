"use client";

import { Reading } from "./types";

export function ReadingsTable({ readings }: { readings: Reading[] }) {
  return (
    <div className="overflow-x-auto">
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
              <td className="py-2 px-2">{JSON.stringify(r.humidity)}</td>
              <td className="py-2 px-2">{JSON.stringify(r.temperature)}</td>
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
  );
}
