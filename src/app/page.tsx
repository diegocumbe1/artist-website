import Image from "next/image";
import { site } from "@/data/site";
import { BookingForm } from "@/components/BookingForm";
import { FloatingBookingCTA } from "@/components/FloatingBookingCTA";
import { Gallery as GalleryGrid } from "@/components/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { VideoCarousel } from "@/components/VideoCarousel";
import { artistJsonLd, faqJsonLd, imagesJsonLd, videosJsonLd } from "@/lib/seo";

const homeFaqs = site.faqs.slice(0, 4);

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          artistJsonLd(),
          faqJsonLd(homeFaqs),
          ...videosJsonLd(),
          ...imagesJsonLd(),
        ]}
      />
      <main className="flex-1">
        <Hero />
        <Authority />
        <Bio />
        <Presentations />
        <Music />
        <FeaturedVideo />
        <Gallery />
        <Testimonials />
        <LocalSearchSection />
        <FaqSection />
        <Social />
        <Booking />
      </main>
      <FloatingBookingCTA />
      <Footer />
    </>
  );
}

/* --------------------------------- HERO --------------------------------- */

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden min-h-[100svh] flex items-center"
    >
      {/* Background image with slow Ken Burns motion. Drop /public/hero/stage-loop.mp4 to activate the video layer. */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 animate-ken-burns">
          <Image
            src={site.heroImage.src}
            alt={site.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_30%] md:object-[70%_30%]"
          />
        </div>
        {/* <video
          className="absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-screen"
          autoPlay
          muted
          loop
          playsInline
          poster={site.heroImage.src}
          aria-hidden
        >
          <source src="/hero/stage-loop.mp4" type="video/mp4" />
        </video> */}
      </div>

      {/* Dark gradient overlays for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#050505] via-[#050505]/88 md:via-[#090909]/72 to-[#0d0d0d]/35 md:to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050505] via-[#090909]/15 to-[#050505]/45" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,rgba(251,191,36,0.08),transparent_34%,rgba(194,65,12,0.13)_100%)]" />
      <div className="absolute inset-0 -z-10 cinematic-grain opacity-45" />

      {/* Animated stage-light glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-[-10%] h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.38),transparent_60%)] blur-3xl animate-glow-a" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(194,65,12,0.34),transparent_60%)] blur-3xl animate-glow-b" />
        <div className="absolute top-[10%] right-[20%] h-[35vw] w-[35vw] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.14),transparent_65%)] blur-3xl animate-glow-a" />
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-32 w-full">
        <div className="animate-hero-fade-up [animation-delay:80ms]">
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)] mb-4">
            <span className="inline-block w-8 h-px align-middle bg-[color:var(--accent)] mr-3" />
            Vallenato en vivo · Booking profesional
          </p>
        </div>

        <h1 className="animate-hero-fade-up [animation-delay:180ms] font-impact text-[clamp(4rem,14vw,12rem)] leading-[0.85] tracking-tight drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
          <span className="brand-text-gradient">
            {site.artistName.toUpperCase()}
          </span>
        </h1>

        <p className="animate-hero-fade-up [animation-delay:320ms] mt-6 max-w-xl text-lg md:text-xl text-foreground/80">
          {site.bookingHeadline}
        </p>

        <div className="animate-hero-fade-up [animation-delay:460ms] mt-10 flex flex-wrap gap-3">
          <a
            href={site.contact.bookingWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Contratar para evento
          </a>
          <a
            href="#video"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 font-semibold text-foreground backdrop-blur-md transition-colors hover:border-orange-300/40 hover:bg-white/[0.06]"
          >
            <PlayOutlineIcon className="w-5 h-5" />
            Ver show en vivo
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#sobre"
        aria-label="Scroll hacia abajo"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[color:var(--muted)] hover:text-foreground transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="animate-scroll-cue">
          <ChevronDownIcon className="w-5 h-5" />
        </span>
      </a>
    </section>
  );
}

/* ------------------------------- AUTHORITY ------------------------------ */

function Authority() {
  return (
    <section className="border-t border-orange-950/50 bg-[#090909]/70">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-[color:var(--border)] px-6 md:grid-cols-4 md:divide-y-0">
        {site.stats.map((stat) => (
          <div key={stat.label} className="py-8 md:py-10 md:px-6">
            <p className="font-impact text-4xl md:text-5xl tracking-wide brand-text-gradient">
              {stat.value}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- BIO --------------------------------- */

function Bio() {
  return (
    <section id="sobre" className="border-t border-[color:var(--border)] bg-[#050505] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading eyebrow="Sobre el artista" title="La voz del vallenato XXI" />
        <div className="space-y-5 text-lg leading-relaxed text-[color:var(--muted)]">
          {site.bio.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- PRESENTATIONS ---------------------------- */

function Presentations() {
  const photos = site.gallery.slice(0, 4);
  const featuredPhoto = photos[0];
  const secondaryPhotos = photos.slice(1, 4);

  return (
    <section
      id="presentaciones"
      className="relative overflow-hidden border-t border-[color:var(--border)] py-24 md:py-32"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_82%_20%,rgba(245,158,11,0.22),transparent_32%),radial-gradient(circle_at_15%_75%,rgba(194,65,12,0.16),transparent_36%),linear-gradient(120deg,rgba(5,5,5,0.96),rgba(13,13,13,0.78),rgba(5,5,5,0.98))]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
      <div className="absolute left-1/2 top-16 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative z-10">
          <p className="mb-4 inline-flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
            <span className="h-px w-10 bg-[color:var(--accent)]" />
            Presentaciones
          </p>

          <h2 className="font-impact text-5xl leading-[0.95] tracking-tight md:text-7xl">
            Un show vallenato con presencia de tarima
          </h2>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-foreground/70">
            {site.bookingDescription} Una propuesta moderna, emocional y lista
            para eventos privados, festivales, ferias y escenarios de gran formato.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {site.eventTypes.map((type) => (
              <span
                key={type}
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-foreground/80 backdrop-blur-md transition-colors hover:border-amber-300/50 hover:bg-amber-300/10"
              >
                {type}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contacto"
              className="brand-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
            >
              <CalendarIcon className="h-5 w-5" />
              Ver disponibilidad
            </a>
            <a
              href="#video"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-orange-300/40 hover:bg-white/[0.06]"
            >
              <PlayOutlineIcon className="h-5 w-5" />
              Ver videos en vivo
            </a>
          </div>
        </div>

        <div className="relative grid gap-4 sm:grid-cols-2 lg:block lg:min-h-[620px]">
          <div className="pointer-events-none absolute left-0 top-8 h-72 w-56 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-8 right-0 h-72 w-72 rounded-full border border-orange-400/10 bg-orange-700/10 blur-3xl" />

          {featuredPhoto && (
            <div className="group relative overflow-hidden rounded-[1.35rem] border border-white/15 bg-white/[0.05] p-2 shadow-2xl shadow-black/40 backdrop-blur-xl sm:col-span-2 lg:absolute lg:left-0 lg:top-0 lg:w-[58%] lg:rounded-[2rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] lg:rounded-[1.55rem]">
                <Image
                  src={featuredPhoto.src}
                  alt={featuredPhoto.alt}
                  fill
                  sizes="(max-width: 768px) 80vw, 420px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
                    Show en vivo
                  </p>
                  <p className="mt-1 font-impact text-3xl tracking-wide text-white">
                    Tarima & energía
                  </p>
                </div>
              </div>
            </div>
          )}

          {secondaryPhotos.map((photo, index) => {
            const positions = [
              "lg:right-0 lg:top-8 lg:w-[46%] lg:rotate-2",
              "lg:right-8 lg:top-[270px] lg:w-[43%] lg:-rotate-2",
              "lg:left-[28%] lg:bottom-0 lg:w-[48%] lg:rotate-1",
            ];

            return (
              <div
                key={photo.src}
                className={`group relative overflow-hidden rounded-[1.35rem] border border-white/15 bg-white/[0.05] p-2 shadow-2xl shadow-black/35 backdrop-blur-xl transition-transform duration-500 hover:z-20 hover:-translate-y-1 lg:absolute lg:rounded-[1.6rem] lg:hover:-translate-y-2 lg:hover:rotate-0 ${positions[index]}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] sm:aspect-[4/3] lg:rounded-[1.2rem]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 70vw, 320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>
              </div>
            );
          })}

          <div className="rounded-2xl border border-orange-300/20 bg-black/55 px-5 py-4 text-sm text-foreground/80 shadow-xl backdrop-blur-xl sm:col-span-2 lg:absolute lg:bottom-14 lg:left-0">
            <p className="font-semibold text-white">Disponible para contratación</p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">
              Ferias · Festivales · Eventos privados
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- MUSIC --------------------------------- */

function Music() {
  const platforms = [
    {
      name: "Spotify",
      url: site.social.spotify,
      icon: SpotifyIcon,
      color: "from-amber-400/15 to-orange-700/0",
    },
    {
      name: "YouTube",
      url: site.social.youtube,
      icon: YouTubeIcon,
      color: "from-orange-500/20 to-amber-400/0",
    },
    {
      name: "Apple Music",
      url: site.social.appleMusic,
      icon: AppleMusicIcon,
      color: "from-orange-300/15 to-orange-900/0",
    },
  ];

  return (
    <section id="musica" className="border-t border-[color:var(--border)] bg-[#090909]/70 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Escúchame" title="Disponible en todas las plataformas" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((p) => {
            const disabled = !p.url;
            const Icon = p.icon;
            return (
              <a
                key={p.name}
                href={disabled ? undefined : p.url}
                target={disabled ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-disabled={disabled}
                className={`group relative flex h-32 items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all ${
                  disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:-translate-y-0.5 hover:border-orange-300/40 hover:bg-white/[0.06]"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative">
                  <p className="text-xs uppercase tracking-widest text-[color:var(--muted)] mb-1">
                    Escuchar en
                  </p>
                  <p className="font-impact text-3xl tracking-wider">
                    {p.name.toUpperCase()}
                  </p>
                </div>
                <Icon className="relative w-10 h-10 text-foreground/80" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- FEATURED VIDEO ---------------------------- */

function FeaturedVideo() {
  return (
    <section id="video" className="py-24 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="En tarima" title="Videos destacados" />
        <VideoCarousel />
      </div>
    </section>
  );
}

/* -------------------------------- GALLERY ------------------------------- */

function Gallery() {
  return (
    <section
      id="galeria"
      className="border-t border-[color:var(--border)] bg-[#090909]/70 py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Galería" title="Momentos en vivo" />
        <GalleryGrid />
        <p className="mt-6 text-xs text-[color:var(--muted)]">
          Haz click en cualquier imagen para verla en grande.
        </p>
      </div>
    </section>
  );
}

/* ----------------------------- TESTIMONIALS ----------------------------- */

function Testimonials() {
  return (
    <section className="py-24 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Credibilidad" title="Eventos y testimonios" />
        <div className="grid gap-4 md:grid-cols-3">
          {site.testimonials.map((item) => (
            <figure
              key={`${item.author}-${item.location}`}
              className="rounded-lg border border-white/10 bg-white/[0.035] p-6 backdrop-blur-md"
            >
              <blockquote className="text-lg leading-relaxed text-foreground/85">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 text-sm text-[color:var(--muted)]">
                {item.author} · {item.location}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- LOCAL SEO ----------------------------- */

function LocalSearchSection() {
  const services = [
    "Cantante vallenato en Garzón, Huila",
    "Parranda vallenata para eventos privados",
    "Show vallenato en vivo para ferias y fiestas",
    "Grupo vallenato para matrimonios y celebraciones",
    "Artista vallenato para festivales y tarimas",
    "Vallenato en vivo para empresas",
  ];

  const areas = [
    "Garzón",
    "Neiva",
    "Pitalito",
    "Huila",
    "Bogotá",
    "Villavicencio",
    "Medellín",
    "Cali",
    "Toda Colombia",
  ];

  return (
    <section className="relative overflow-hidden border-t border-[color:var(--border)] bg-[#050505] py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(245,158,11,0.14),transparent_34%),radial-gradient(circle_at_85%_80%,rgba(194,65,12,0.16),transparent_36%)]" />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
            Vallenato para eventos
          </p>
          <h2 className="font-impact text-4xl tracking-tight md:text-6xl">
            Cantante vallenato para eventos en Huila, Garzón y Colombia
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-[color:var(--muted)]">
            <p>
              Pipe Cumbe está disponible para shows vallenatos en vivo,
              parrandas vallenatas, ferias, fiestas patronales, matrimonios,
              eventos privados y festivales en Garzón, Huila y diferentes
              ciudades de Colombia.
            </p>
            <p>
              La propuesta combina repertorio vallenato, presencia de tarima y
              coordinación profesional para que organizadores, empresas y
              familias puedan contratar un artista vallenato con una
              presentación clara, energética y lista para el evento.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/contratar-cantante-vallenato"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-orange-300/40 hover:bg-white/[0.06]"
            >
              Contratar cantante vallenato
            </a>
            <a
              href="/eventos"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-orange-300/40 hover:bg-white/[0.06]"
            >
              Eventos vallenatos
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-lg border border-orange-300/15 bg-white/[0.035] p-5 backdrop-blur-md">
            <h3 className="font-impact text-3xl tracking-wide text-white">
              Servicios más buscados
            </h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <p
                  key={service}
                  className="rounded-md border border-white/10 bg-[#0d0d0d]/80 px-4 py-3 text-sm text-foreground/80"
                >
                  {service}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
            <h3 className="font-impact text-3xl tracking-wide text-white">
              Cobertura
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {areas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm text-foreground/75"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- FAQ --------------------------------- */

function FaqSection() {
  return (
    <section className="border-t border-[color:var(--border)] bg-[#090909]/70 py-20">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading eyebrow="Dudas rápidas" title="Contratar show vallenato" />
        <div className="divide-y divide-white/10 rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-md">
          {homeFaqs.map((faq) => (
            <article key={faq.question} className="p-6">
              <h3 className="text-xl font-semibold text-white">{faq.question}</h3>
              <p className="mt-3 leading-relaxed text-[color:var(--muted)]">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <a
            href="/contratar-cantante-vallenato"
            className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-foreground/80 backdrop-blur-md transition-colors hover:border-orange-300/40 hover:bg-white/[0.06] hover:text-white"
          >
            Ver guía completa de contratación
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- SOCIAL -------------------------------- */

function Social() {
  const items = [
    { url: site.social.instagram, label: "Instagram", Icon: InstagramIcon },
    { url: site.social.youtube, label: "YouTube", Icon: YouTubeIcon },
    { url: site.social.tiktok, label: "TikTok", Icon: TikTokIcon },
    { url: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  ];

  return (
    <section className="py-20 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionHeading
          eyebrow="Sígueme"
          title="Redes sociales"
          centered
        />
        <div className="flex flex-wrap justify-center gap-3">
          {items.map(({ url, label, Icon }) => {
            const disabled = !url;
            return (
              <a
                key={label}
                href={disabled ? undefined : url}
                target={disabled ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-disabled={disabled}
                className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium backdrop-blur-md transition-colors ${
                  disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-orange-300/40 hover:bg-white/[0.06]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- BOOKING ------------------------------- */

function Booking() {
  return (
    <section
      id="contacto"
      className="relative overflow-hidden border-t border-[color:var(--border)] bg-[#090909] py-24"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.14),transparent_48%),radial-gradient(circle_at_15%_85%,rgba(194,65,12,0.14),transparent_38%),linear-gradient(180deg,#050505_0%,#090909_42%,#050505_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent" />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
          Contrataciones
        </p>
        <h2 className="font-impact text-5xl md:text-7xl tracking-tight mb-6">
          ¿Quieres a Pipe Cumbe en tu evento?
        </h2>
        <p className="mb-4 text-lg text-[color:var(--muted)]">
          Disponible para conciertos, festivales, parrandas privadas y eventos
          corporativos en Colombia y exterior.
        </p>
        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-foreground/70">
          Cuéntanos la fecha, ciudad, tipo de evento y número de asistentes. Te
          responderemos con disponibilidad y propuesta de presentación.
        </p>
        <div className="mb-8 text-left">
          <BookingForm />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`tel:+57${site.contact.bookingPhone}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-4 text-lg font-semibold text-foreground backdrop-blur-md transition-colors hover:border-orange-300/40 hover:bg-white/[0.06]"
          >
            <PhoneIcon className="w-5 h-5" />
            {site.contact.bookingPhone}
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- FOOTER -------------------------------- */

function Footer() {
  const socials = [
    { url: site.social.instagram, label: "Instagram" },
    { url: site.social.youtube, label: "YouTube" },
    { url: site.social.tiktok, label: "TikTok" },
    { url: site.social.facebook, label: "Facebook" },
    { url: site.social.spotify, label: "Spotify" },
    { url: site.social.appleMusic, label: "Apple Music" },
  ].filter((item) => item.url);

  return (
    <footer className="border-t border-orange-950/50 bg-[#050505] py-12 text-sm text-[color:var(--muted)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-impact text-3xl tracking-wider brand-text-gradient">
            {site.artistName.toUpperCase()}
          </p>
          <p className="mt-3 max-w-md text-foreground/70">
            Vallenato en vivo para eventos, ferias y festivales.
          </p>
          <div className="mt-5 space-y-1 text-xs text-foreground/45">
            <p>
              © {new Date().getFullYear()} {site.artistName}. Todos los derechos reservados.
            </p>
            <p>
              Creative Direction &amp; Development —{" "}
              <a
                href="https://github.com/diegocumbe1"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground/55 transition-colors hover:text-amber-300"
              >
                Diego Cumbe
              </a>
            </p>
          </div>
        </div>

        {socials.length > 0 && (
          <nav aria-label="Redes sociales" className="flex flex-wrap gap-3">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/75 backdrop-blur-md transition-colors hover:border-orange-300/40 hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}

/* ------------------------- SHARED PRESENTATIONAL ------------------------ */

function SectionHeading({
  eyebrow,
  title,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  centered?: boolean;
}) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)] mb-3">
        {eyebrow}
      </p>
      <h2 className="font-impact text-4xl md:text-6xl tracking-tight">
        {title}
      </h2>
    </div>
  );
}

/* --------------------------------- ICONS -------------------------------- */

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 0C5.402 0 .002 5.4 0 12.04c0 2.123.555 4.196 1.61 6.018L0 24l6.083-1.595a12.04 12.04 0 0 0 5.957 1.518h.005c6.638 0 12.038-5.4 12.04-12.04C24.085 5.4 18.683 0 12.04 0zm0 22.05h-.004a10.04 10.04 0 0 1-5.123-1.404l-.367-.218-3.609.946.965-3.519-.239-.379A10.022 10.022 0 0 1 2.022 12.04C2.022 6.504 6.503 2.022 12.04 2.022c2.681 0 5.2 1.045 7.097 2.943a9.974 9.974 0 0 1 2.94 7.097c-.002 5.537-4.483 10.019-10.04 10.019z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.4 2.23.07 1.26.08 1.64.08 4.85s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.4-1.26.07-1.64.08-4.85.08s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.4-2.23C2.2 15.6 2.2 15.21 2.2 12s0-3.6.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.4C8.4 2.2 8.79 2.2 12 2.2zm0-2.2C8.74 0 8.33 0 7.05.07 5.78.13 4.9.33 4.14.63a6.07 6.07 0 0 0-2.2 1.43A6.07 6.07 0 0 0 .5 4.26c-.3.76-.5 1.64-.57 2.91C-.13 8.45-.13 8.86-.13 12s0 3.55.07 4.83c.07 1.27.27 2.15.57 2.91.32.82.74 1.51 1.43 2.2a6.07 6.07 0 0 0 2.2 1.43c.76.3 1.64.5 2.91.57 1.28.07 1.69.07 4.95.07s3.67 0 4.95-.07c1.27-.07 2.15-.27 2.91-.57a6.07 6.07 0 0 0 2.2-1.43 6.07 6.07 0 0 0 1.43-2.2c.3-.76.5-1.64.57-2.91.07-1.28.07-1.69.07-4.95s0-3.67-.07-4.95c-.07-1.27-.27-2.15-.57-2.91a6.07 6.07 0 0 0-1.43-2.2A6.07 6.07 0 0 0 19.74.5c-.76-.3-1.64-.5-2.91-.57C15.55-.13 15.14-.13 12-.13z" />
      <path d="M12 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
      <circle cx="18.41" cy="5.59" r="1.44" />
    </svg>
  );
}

function YouTubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}

function SpotifyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.52 17.34c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.78-.18-.9-.54-.12-.42.18-.78.54-.9 4.56-1.02 8.52-.6 11.64 1.32.42.18.48.66.3 1.02zm1.44-3.3c-.3.42-.84.6-1.26.3-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.02.6-1.14 4.38-1.32 9.84-.66 13.56 1.62.36.18.54.78.18 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.3c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
    </svg>
  );
}

function AppleMusicIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0 0 19.63.122c-.875-.118-1.75-.122-2.628-.122H6.999c-.668 0-1.34.022-2.005.115a4.987 4.987 0 0 0-1.66.515c-.876.43-1.594 1.05-2.116 1.886A6.06 6.06 0 0 0 .35 4.45c-.1.397-.16.81-.21 1.22C.05 6.214 0 6.756 0 7.298v9.404c0 .54.05 1.083.14 1.625.12.74.34 1.45.7 2.12.45.84 1.05 1.5 1.85 1.96.62.36 1.3.6 2.04.7.7.1 1.4.13 2.1.13h9.78c.7 0 1.4-.03 2.1-.13.74-.1 1.42-.34 2.04-.7.8-.46 1.4-1.12 1.85-1.96.36-.67.58-1.38.7-2.12.09-.542.14-1.084.14-1.625V7.298c-.04-.39-.07-.78-.13-1.174zM17.41 14.83c-.13.32-.34.62-.59.86-.27.27-.6.46-.96.58-.39.13-.78.16-1.18.1l-.05-.01c-.34-.06-.66-.21-.94-.42-.27-.21-.49-.49-.65-.81-.16-.32-.25-.69-.25-1.06v-4.85c0-.16.04-.32.13-.46.08-.14.2-.25.34-.34.13-.07.28-.11.43-.11.05 0 .1 0 .15.02l5.05.95v6.13z" />
    </svg>
  );
}

function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
    </svg>
  );
}

function FacebookIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PlayOutlineIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M10 8l6 4-6 4V8z" />
    </svg>
  );
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
