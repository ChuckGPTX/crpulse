import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CR Pulse EYBL Tracker",
  description: "Up-to-date EYBL player and team numbers for the CR Pulse basketball watchlist.",
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
