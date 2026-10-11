import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import { AppShell } from "@/components/templates/app-shell";
import { Providers } from "@/app/providers";
import { copy } from "@/content/copy";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
});

export const metadata: Metadata = {
  title: copy.brand.name,
  description: copy.brand.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" {...{ className: `${notoSansThai.variable} ${inter.variable}` }}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
