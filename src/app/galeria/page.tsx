import type { Metadata } from "next";
import Link from "next/link";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { Gallery } from "@/components/Gallery";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: site.pages[2].title,
  description: site.pages[2].description,
  path: site.pages[2].slug,
});

export default function GaleriaPage() {
  return (
    <>
      <main className="min-h-screen bg-background px-6 py-24 text-foreground">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm text-[color:var(--muted)] hover:text-foreground">
            Volver al inicio
          </Link>
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
            Galería
          </p>
          <h1 className="mt-4 font-impact text-5xl tracking-tight md:text-7xl">
            Fotos de Pipe Cumbe en tarima y eventos
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[color:var(--muted)]">
            Momentos en vivo, presentaciones, banda, público y estética visual
            de Pipe Cumbe Oficial.
          </p>
          <div className="mt-12">
            <Gallery />
          </div>
        </div>
      </main>
      <FloatingBookingCTA />
    </>
  );
}
