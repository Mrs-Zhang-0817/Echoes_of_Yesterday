import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "昨日重现 · UI Showcase Demo v1.0",
  description: "Mobile Landscape Scene 01 Main Menu UI validation demo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
