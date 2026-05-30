import type { Metadata } from "next";
import Link from "next/link";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { JsonLd } from "@/components/JsonLd";
import { VideoCarousel } from "@/components/VideoCarousel";
import { site } from "@/data/site";
import { pageMetadata, videosJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: site.pages[3].title,
  description: site.pages[3].description,
  path: site.pages[3].slug,
});

export default function VideosPage() {
  return (
    <>
      <JsonLd data={videosJsonLd()} />
      <main className="min-h-screen bg-background px-6 py-24 text-foreground">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm text-[color:var(--muted)] hover:text-foreground">
            Volver al inicio
          </Link>
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
            Videos
          </p>
          <h1 className="mt-4 font-impact text-5xl tracking-tight md:text-7xl">
            Videos musicales y presentaciones en vivo
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[color:var(--muted)]">
            Mira el sonido, la energía y la puesta en escena de Pipe Cumbe en
            sus videos destacados.
          </p>
          <div className="mt-12">
            <VideoCarousel />
          </div>
        </div>
      </main>
      <FloatingBookingCTA />
    </>
  );
}
