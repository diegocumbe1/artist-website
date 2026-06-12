import Image from "next/image";
import Link from "next/link";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { JsonLd } from "@/components/JsonLd";
import type { LocalSeoPage } from "@/data/localSeo";
import { site } from "@/data/site";
import {
  artistJsonLd,
  bookingServiceJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export function LocalSeoLanding({ page }: { page: LocalSeoPage }) {
  return (
    <>
      <JsonLd
        data={[
          websiteJsonLd(),
          organizationJsonLd(),
          artistJsonLd(),
          bookingServiceJsonLd(),
          faqJsonLd(page.faqs),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: page.title, path: page.slug },
          ]),
        ]}
      />
      <main className="min-h-screen bg-background text-foreground">
        <section className="relative overflow-hidden px-6 py-24 md:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_10%,rgba(245,158,11,0.2),transparent_35%),radial-gradient(circle_at_12%_82%,rgba(194,65,12,0.16),transparent_40%)]" />
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-center">
            <div>
              <Link href="/" className="text-sm text-[color:var(--muted)] hover:text-foreground">
                Volver al inicio
              </Link>
              <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
                {page.eyebrow}
              </p>
              <h1 className="mt-4 font-impact text-5xl tracking-tight md:text-7xl">
                {page.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)]">
                {page.lead}
              </p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/70">
                Solicita disponibilidad por WhatsApp indicando fecha, ciudad,
                tipo de evento y número aproximado de asistentes. El equipo
                responde con formato, logística y propuesta de contratación.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={site.contact.bookingWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-gradient inline-flex rounded-full px-6 py-3 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
                >
                  Cotizar show vallenato
                </a>
                <a
                  href="/videos"
                  className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-orange-300/40 hover:bg-white/[0.06]"
                >
                  Ver videos en vivo
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-[color:var(--border)]">
              <Image
                src={site.gallery.find((image) => image.featured)?.src ?? site.heroImage.src}
                alt={`Pipe Cumbe, cantante vallenato para eventos en ${page.area}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-[color:var(--border)] px-6 py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-impact text-4xl tracking-tight md:text-6xl">
                Búsquedas que resuelve esta página
              </h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {page.intentKeywords.map((keyword) => (
                  <p
                    key={keyword}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground/80"
                  >
                    {keyword}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-impact text-4xl tracking-tight md:text-6xl">
                Tipos de eventos
              </h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {page.eventExamples.map((event) => (
                  <p
                    key={event}
                    className="rounded-md border border-white/10 bg-[color:var(--surface)] px-4 py-3 text-sm text-foreground/80"
                  >
                    {event}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[color:var(--border)] px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-impact text-4xl tracking-tight md:text-6xl">
              Preguntas frecuentes
            </h2>
            <div className="mt-10 divide-y divide-[color:var(--border)] rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]">
              {page.faqs.map((faq) => (
                <article key={faq.question} className="p-6">
                  <h3 className="text-xl font-semibold">{faq.question}</h3>
                  <p className="mt-3 leading-relaxed text-[color:var(--muted)]">
                    {faq.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FloatingBookingCTA />
    </>
  );
}
