import type { Metadata } from "next";
import "./globals.css";

import { LanguageProvider } from "@/components/i18n/LanguageProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://gramudyam.gov.in"),
  title: "Gram Udyam Advisor",
  description:
    "AI-driven business advisory and financial planning assistant for rural micro-entrepreneurs.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Gram Udyam Advisor",
    description:
      "AI-driven business advisory and financial planning assistant for rural micro-entrepreneurs.",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Gram Udyam Advisor logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}