import type { Metadata } from "next";
import Link from "next/link";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: site.pages[5].title,
  description: site.pages[5].description,
  path: site.pages[5].slug,
});

export default function PrensaPage() {
  const pressItems = [
    "Bio corta y extendida",
    "Fotos oficiales en alta calidad",
    "Videos musicales y presentaciones",
    "Contacto de booking",
    "Repertorio y formato de show",
    "Rider técnico básico",
  ];

  return (
    <>
      <main className="min-h-screen bg-background px-6 py-24 text-foreground">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="text-sm text-[color:var(--muted)] hover:text-foreground">
            Volver al inicio
          </Link>
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
            Prensa
          </p>
          <h1 className="mt-4 font-impact text-5xl tracking-tight md:text-7xl">
            Press kit y media kit de Pipe Cumbe
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[color:var(--muted)]">
            Información oficial para medios, empresas, agencias, alcaldías y
            organizadores de eventos. Esta página queda lista para conectar un
            PDF descargable con fotos, rider técnico y datos de prensa.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {pressItems.map((item) => (
              <div key={item} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                {item}
              </div>
            ))}
          </div>
          <a
            href={site.contact.bookingWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-gradient mt-10 inline-flex rounded-full px-7 py-4 font-semibold text-black"
          >
            Solicitar press kit
          </a>
        </div>
      </main>
      <FloatingBookingCTA />
    </>
  );
}
