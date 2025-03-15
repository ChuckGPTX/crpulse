import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chuck AI - Your AI Agent",
  description: "Chuck is a general AI agent that turns your thoughts into actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
