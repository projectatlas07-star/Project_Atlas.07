import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Project Atlas - AI Operating System for Insurance Restoration",
  description: "Turn your restoration company into a closed-loop intelligence system. Atlas transforms claims, documents, supplements, and operational knowledge into actionable company intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}