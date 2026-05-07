import type { Metadata } from "next";
import { Merriweather, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "SYB - Scale Your Business",
  description: "La mayoría de los dueños no tienen un problema de tiempo. Tienen un problema de Arquitectura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`dark ${merriweather.variable} ${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
