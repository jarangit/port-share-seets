import type { Metadata } from "next";
import { AppShell } from "@/components/templates/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "ไปด้วยกัน",
  description: "หารถที่ไปทางเดียวกัน หรือแชร์ที่ว่างในรถของคุณ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
