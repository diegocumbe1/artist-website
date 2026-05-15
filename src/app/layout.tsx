import type { Metadata } from "next";
import { Geist, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: `${site.artistName} · ${site.tagline}`,
  description: site.shortDescription,
  metadataBase: new URL("https://pipecumbe.com"),
  openGraph: {
    title: `${site.artistName} · ${site.tagline}`,
    description: site.shortDescription,
    type: "website",
    locale: "es_CO",
    siteName: site.artistName,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.artistName} · ${site.tagline}`,
    description: site.shortDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${bebas.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
