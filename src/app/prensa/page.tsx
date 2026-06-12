import type { Metadata } from "next";
import Link from "next/link";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/data/site";
import {
  artistJsonLd,
  breadcrumbJsonLd,
  organizationJsonLd,
  pageMetadata,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: site.pages[5].title,
  description: site.pages[5].description,
  path: site.pages[5].slug,
});

export default function PrensaPage() {
  const hasPressKitPdf = Boolean(site.pressKit.pdfPath);

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
      <JsonLd
        data={[
          websiteJsonLd(),
          organizationJsonLd(),
          artistJsonLd(),
          breadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Prensa y press kit", path: site.pages[5].slug },
          ]),
        ]}
      />
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
            organizadores de eventos. Solicita el press kit completo por
            WhatsApp o descarga el PDF oficial cuando esté disponible.
          </p>
          <div className="mt-8 grid gap-6 text-base leading-relaxed text-foreground/75 md:grid-cols-2">
            <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
              <h2 className="font-impact text-3xl tracking-wide text-white">
                Bio oficial
              </h2>
              <p className="mt-4">{site.entityDescription}</p>
            </div>
            <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
              <h2 className="font-impact text-3xl tracking-wide text-white">
                Contacto oficial
              </h2>
              <div className="mt-4 space-y-2">
                <p>Booking: +57 {site.contact.bookingPhone}</p>
                <p>
                  Web:{" "}
                  <a href={site.siteUrl} className="text-amber-300 hover:text-amber-200">
                    pipecumbeoficial.com
                  </a>
                </p>
                <p>
                  Instagram:{" "}
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200">
                    @pipecumbe
                  </a>
                </p>
                <p>
                  YouTube:{" "}
                  <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200">
                    @VALLENATOXXI
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {pressItems.map((item) => (
              <div key={item} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
                {item}
              </div>
            ))}
          </div>
          <section className="mt-14 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
            <h2 className="font-impact text-4xl tracking-tight">
              Datos rápidos para medios y buscadores
            </h2>
            <dl className="mt-6 grid gap-4 text-sm text-foreground/75 md:grid-cols-2">
              <div>
                <dt className="font-semibold text-white">Nombre artístico</dt>
                <dd className="mt-1">{site.artistName}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Nombre real</dt>
                <dd className="mt-1">{site.realName}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Marca oficial</dt>
                <dd className="mt-1">{site.legalName}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Lugar de origen</dt>
                <dd className="mt-1">{site.birthPlace}</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Género</dt>
                <dd className="mt-1">Vallenato, música colombiana</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Zona de booking</dt>
                <dd className="mt-1">Huila, Garzón, Neiva y Colombia</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Tipos de evento</dt>
                <dd className="mt-1">
                  Ferias, fiestas, matrimonios, parrandas, festivales y eventos corporativos
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Canales oficiales</dt>
                <dd className="mt-1">Web oficial, Instagram y YouTube</dd>
              </div>
            </dl>
          </section>
          <div className="mt-10 flex flex-wrap gap-3">
            {hasPressKitPdf && (
              <a
                href={site.pressKit.pdfPath}
                download
                className="brand-gradient inline-flex rounded-full px-7 py-4 font-semibold text-black"
              >
                Descargar press kit PDF
              </a>
            )}
            <a
              href={site.pressKit.whatsappMessage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-7 py-4 font-semibold text-foreground backdrop-blur-md transition-colors hover:border-orange-300/40 hover:bg-white/[0.06]"
            >
              Solicitar press kit por WhatsApp
            </a>
          </div>
          {!hasPressKitPdf && (
            <p className="mt-4 text-sm text-foreground/50">
              Para activar la descarga directa, sube el archivo a{" "}
              <code>{site.pressKit.expectedPdfPath}</code> y configura esa ruta
              en <code>src/data/site.ts</code>.
            </p>
          )}
        </div>
      </main>
      <FloatingBookingCTA />
    </>
  );
}
