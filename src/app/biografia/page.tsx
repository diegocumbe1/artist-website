import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/data/site";
import { artistJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: site.pages[4].title,
  description: site.pages[4].description,
  path: site.pages[4].slug,
});

export default function BiografiaPage() {
  return (
    <>
      <JsonLd data={artistJsonLd()} />
      <main className="min-h-screen bg-background px-6 py-24 text-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[color:var(--border)]">
            <Image src={site.heroImage.src} alt={site.heroImage.alt} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
          </div>
          <div>
            <Link href="/" className="text-sm text-[color:var(--muted)] hover:text-foreground">
              Volver al inicio
            </Link>
            <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
              Biografía
            </p>
            <h1 className="mt-4 font-impact text-5xl tracking-tight md:text-7xl">
              La voz del vallenato XXI
            </h1>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-[color:var(--muted)]">
              {site.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </main>
      <FloatingBookingCTA />
    </>
  );
}
