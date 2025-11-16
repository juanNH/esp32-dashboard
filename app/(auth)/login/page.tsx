"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) setMsg(data.error || "Error");
    else {
      localStorage.setItem("token", data.token);
      localStorage.setItem("deviceId", data.deviceId);
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>

        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Usuario"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Contraseña"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Entrar
          </button>
        </form>

        {msg && <p className="mt-3 text-red-600 text-sm">{msg}</p>}

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/register")}
            className="text-blue-600 underline text-sm"
          >
            ¿No tenés cuenta? Registrate
          </button>
        </div>
      </div>
    </div>
  );
}
