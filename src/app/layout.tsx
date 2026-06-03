import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nairobi Events",
    template: "%s | Nairobi Events",
  },
  description:
    "Discover live events in Nairobi, browse ticketed experiences, and book tickets with secure checkout.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  keywords: [
    "Nairobi events",
    "Nairobi tickets",
    "events in Nairobi",
    "concerts Nairobi",
    "festivals Nairobi",
    "ticketing Nairobi",
  ],
  openGraph: {
    title: "Nairobi Events",
    description:
      "Discover live events in Nairobi, browse ticketed experiences, and book tickets with secure checkout.",
    type: "website",
    locale: "en_US",
    siteName: "Nairobi Events",
    images: [
      {
        url: "/poster1_converted.webp",
        alt: "Nairobi Events - Discover live events in Nairobi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nairobi Events",
    description:
      "Discover live events in Nairobi, browse ticketed experiences, and book tickets with secure checkout.",
    images: ["/poster1_converted.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex min-h-screen flex-col bg-white text-slate-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
