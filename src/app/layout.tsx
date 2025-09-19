import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tiny Prompters Adventure Lab Live",
  description:
    "Join Tiny Prompters for a live webinar on raising confident kid prompt engineers with playful AI literacy tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
