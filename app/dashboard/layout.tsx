"use client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("deviceId");
    window.location.href = "/login";
  }

  return (
    <div>
      <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">ESP32 Dashboard</h1>

        <button
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Cerrar sesión
        </button>
      </nav>

      <main className="p-4">{children}</main>
    </div>
  );
}
