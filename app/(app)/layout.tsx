"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AlertListener from "./AlertListener";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("deviceId");
    router.push("/login");
  }

  const isDashboard = pathname === "/dashboard";
  const isRealtime = pathname === "/realtime";
  const isSettings = pathname === "/settings";

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm sm:text-base">
              ESP32 Dashboard
            </span>

            {/* Navegación principal (desktop) */}
            <nav className="hidden sm:flex gap-3 text-sm">
              <Link
                href="/dashboard"
                className={
                  "px-3 py-1.5 rounded-full transition " +
                  (isDashboard
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                }
              >
                Histórico
              </Link>
              <Link
                href="/realtime"
                className={
                  "px-3 py-1.5 rounded-full transition " +
                  (isRealtime
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                }
              >
                Tiempo real
              </Link>
              <Link
                href="/settings"
                className={
                  "px-3 py-1.5 rounded-full transition " +
                  (isSettings
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                }
              >
                Configuración
              </Link>
            </nav>
          </div>

          <button
            onClick={logout}
            className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Navegación móvil */}
        <div className="sm:hidden border-t border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-2 flex gap-2">
            <Link
              href="/dashboard"
              className={
                "flex-1 text-center text-xs py-2 rounded-lg " +
                (isDashboard
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700")
              }
            >
              Histórico
            </Link>
            <Link
              href="/realtime"
              className={
                "flex-1 text-center text-xs py-2 rounded-lg " +
                (isRealtime
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700")
              }
            >
              Tiempo real
            </Link>
            <Link
              href="/settings"
              className={
                "flex-1 text-center text-xs py-2 rounded-lg " +
                (isSettings
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700")
              }
            >
              Configuración
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4">
        {children}
      </main>
      <AlertListener />
    </div>
  );
}
