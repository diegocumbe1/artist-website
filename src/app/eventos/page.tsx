import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: site.pages[1].title,
  description: site.pages[1].description,
  path: site.pages[1].slug,
});

export default function EventosPage() {
  return (
    <>
      <main className="min-h-screen bg-background px-6 py-24 text-foreground">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm text-[color:var(--muted)] hover:text-foreground">
            Volver al inicio
          </Link>
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
            Eventos
          </p>
          <h1 className="mt-4 font-impact text-5xl tracking-tight md:text-7xl">
            Vallenato en vivo para ferias, fiestas y eventos privados
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[color:var(--muted)]">
            Un show musical pensado para tarima, celebración y conexión con el
            público. Pipe Cumbe lleva vallenato moderno a eventos sociales,
            corporativos y masivos en Colombia.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {site.eventTypes.map((type) => (
              <div key={type} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                {type}
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {site.gallery.slice(0, 3).map((image) => (
              <div key={image.src} className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[color:var(--border)]">
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </main>
      <FloatingBookingCTA />
    </>
  );
}
