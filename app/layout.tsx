import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "HomeRun AI Assistant | Bangalore's Construction Materials in 60 Mins",
  description:
    "AI-powered estimation and material ordering assistant for HomeRun. Experience both In-App and WhatsApp modes with live cart sync, real-time pricing, and 60-minute delivery.",
  keywords: [
    "HomeRun",
    "Bangalore construction materials",
    "cement delivery",
    "UltraTech PPC",
    "Roff adhesive",
    "quick commerce construction",
  ],
  authors: [{ name: "Sujith Thalathoty" }],
  icons: {
    icon: "/homerun-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-slate-100 min-h-screen selection:bg-homerun-yellow/30 selection:text-homerun-green-dark">
        {children}
      </body>
    </html>
  );
}
