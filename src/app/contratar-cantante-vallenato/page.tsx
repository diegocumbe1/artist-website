import type { Metadata } from "next";
import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/data/site";
import { artistJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: site.pages[0].title,
  description: site.pages[0].description,
  path: site.pages[0].slug,
});

export default function ContratarCantanteVallenatoPage() {
  return (
    <>
      <JsonLd data={[artistJsonLd(), faqJsonLd()]} />
      <main className="min-h-screen bg-background text-foreground">
        <section className="relative overflow-hidden px-6 py-24 md:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_10%,rgba(245,158,11,0.2),transparent_35%),radial-gradient(circle_at_10%_80%,rgba(20,184,166,0.14),transparent_40%)]" />
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <Link href="/" className="text-sm text-[color:var(--muted)] hover:text-foreground">
                Volver al inicio
              </Link>
              <p className="mt-10 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
                Contrataciones
              </p>
              <h1 className="mt-4 font-impact text-5xl tracking-tight md:text-7xl">
                Contratar cantante vallenato para eventos en Colombia
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--muted)]">
                Pipe Cumbe está disponible para conciertos, ferias, fiestas,
                matrimonios, eventos corporativos, parrandas privadas y
                festivales. Solicita disponibilidad y recibe una cotización
                directa por WhatsApp.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {site.cities.map((city) => (
                  <span
                    key={city}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-foreground/80"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
            <BookingForm />
          </div>
        </section>

        <section className="border-t border-[color:var(--border)] px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-impact text-4xl tracking-tight md:text-6xl">
              Shows vallenatos para cada tipo de evento
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {site.eventTypes.map((type) => (
                <div
                  key={type}
                  className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-lg"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-[color:var(--border)] px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-impact text-4xl tracking-tight md:text-6xl">
              Preguntas frecuentes
            </h2>
            <div className="mt-10 divide-y divide-[color:var(--border)] rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)]">
              {site.faqs.map((faq) => (
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
