import "./../styles/globals.css";

export const metadata = {
  title: "ESP32 Dashboard",
  description: "Monitoreo de temperatura y humedad - ESP32 + NextJS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
