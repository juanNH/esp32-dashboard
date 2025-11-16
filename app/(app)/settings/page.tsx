"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [value, setValue] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadAlertTemp() {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay sesión iniciada");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/alert", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Error al cargar configuración");
      } else {
        setError(null);
        if (typeof json.alertTemp === "number") {
          setValue(json.alertTemp);
        }
      }
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  }

  async function saveAlertTemp() {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay sesión iniciada");
      return;
    }

    setSaving(true);
    setMsg(null);
    setError(null);

    try {
      const res = await fetch("/api/user/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ alertTemp: value }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Error al guardar");
      } else {
        setMsg("Configuración guardada");
      }
    } catch {
      setError("Error de red");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadAlertTemp();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-center">
          Configuración de alerta
        </h1>
        <p className="text-center text-sm text-slate-500 mb-6">
          Ajustá la temperatura a partir de la cual querés que el sistema
          considere un estado de alerta.
        </p>

        {loading ? (
          <p className="text-center text-slate-500">Cargando...</p>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Temperatura de alerta
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-bold">
                  {value}
                </span>
                <span className="text-lg text-slate-500">°C</span>
              </div>

              <input
                type="range"
                min={0}
                max={60}
                step={0.5}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full max-w-md accent-blue-600"
              />
              <div className="flex justify-between w-full max-w-md text-xs text-slate-500">
                <span>0°C</span>
                <span>30°C</span>
                <span>60°C</span>
              </div>
            </div>

            {error && (
              <p className="text-center text-red-600 text-sm">{error}</p>
            )}
            {msg && (
              <p className="text-center text-emerald-600 text-sm">{msg}</p>
            )}

            <button
              onClick={saveAlertTemp}
              disabled={saving}
              className="w-full bg-blue-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {saving ? "Guardando..." : "Guardar configuración"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
