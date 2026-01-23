// File: src/app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import ReloadToTop from "@/components/ReloadToTop";

export const metadata: Metadata = {
  title: "Calebe's Portfolio",
  description: "Calebe Rodrigues Rolim — one-page portfolio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReloadToTop />
        {children}
      </body>
    </html>
  );
}