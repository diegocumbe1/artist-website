import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <Hero />
        <Bio />
        <Music />
        <FeaturedVideo />
        <Gallery />
        <Social />
        <Booking />
      </main>
      <Footer />
    </>
  );
}

/* -------------------------------- NAVBAR -------------------------------- */

function NavBar() {
  const links = [
    { href: "#sobre", label: "Sobre" },
    { href: "#musica", label: "Música" },
    { href: "#video", label: "Video" },
    { href: "#galeria", label: "Galería" },
    { href: "#contacto", label: "Contacto" },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-[color:var(--border)]">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a
          href="#top"
          className="font-impact text-2xl tracking-wider brand-text-gradient"
        >
          {site.artistName.toUpperCase()}
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm text-[color:var(--muted)]">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href={site.contact.bookingWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-gradient text-black font-semibold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
        >
          Contratar
        </a>
      </div>
    </header>
  );
}

/* --------------------------------- HERO --------------------------------- */

function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden min-h-[88vh] flex items-center"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.18),transparent_55%),radial-gradient(circle_at_75%_75%,rgba(239,68,68,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-24 w-full">
        <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--muted)] mb-4">
          Artista · Vallenato XXI
        </p>
        <h1 className="font-impact text-[clamp(4rem,14vw,12rem)] leading-[0.85] tracking-tight">
          <span className="brand-text-gradient">
            {site.artistName.toUpperCase()}
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg md:text-xl text-[color:var(--muted)]">
          {site.tagline}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={site.contact.bookingWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-gradient text-black font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Contratar por WhatsApp
          </a>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[color:var(--border)] hover:border-foreground text-foreground font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 transition-colors"
          >
            <InstagramIcon className="w-5 h-5" />
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- BIO --------------------------------- */

function Bio() {
  return (
    <section id="sobre" className="py-24 border-t border-[color:var(--border)]">
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

/* -------------------------------- MUSIC --------------------------------- */

function Music() {
  const platforms = [
    {
      name: "Spotify",
      url: site.social.spotify,
      icon: SpotifyIcon,
      color: "from-green-500/20 to-green-500/0",
    },
    {
      name: "YouTube",
      url: site.social.youtube,
      icon: YouTubeIcon,
      color: "from-red-500/20 to-red-500/0",
    },
    {
      name: "Apple Music",
      url: site.social.appleMusic,
      icon: AppleMusicIcon,
      color: "from-pink-500/20 to-pink-500/0",
    },
  ];

  return (
    <section id="musica" className="py-24 border-t border-[color:var(--border)] bg-[color:var(--surface)]/40">
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
                className={`group relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 h-32 flex items-center justify-between transition-all ${
                  disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-foreground/40 hover:-translate-y-0.5"
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
  const { youtubeId, title } = site.featuredVideo;
  return (
    <section id="video" className="py-24 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow="En tarima" title="Video destacado" />
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- GALLERY ------------------------------- */

function Gallery() {
  return (
    <section
      id="galeria"
      className="py-24 border-t border-[color:var(--border)] bg-[color:var(--surface)]/40"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Galería" title="Momentos en vivo" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {site.gallery.map((g, i) => (
            <GalleryItem key={i} index={i + 1} alt={g.alt} />
          ))}
        </div>
        <p className="mt-6 text-sm text-[color:var(--muted)]">
          Reemplaza las imágenes en{" "}
          <code className="text-foreground/80">public/gallery/</code> (1.jpg a 6.jpg).
        </p>
      </div>
    </section>
  );
}

function GalleryItem({
  index,
  alt,
}: {
  index: number;
  alt: string;
}) {
  const hues = [
    "from-amber-500/20 via-amber-700/10",
    "from-red-500/20 via-red-700/10",
    "from-orange-500/20 via-orange-700/10",
    "from-yellow-600/20 via-yellow-800/10",
    "from-rose-500/20 via-rose-700/10",
    "from-amber-600/20 via-red-600/10",
  ];
  const hue = hues[index - 1] ?? hues[0];
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative aspect-square overflow-hidden rounded-xl border border-[color:var(--border)] bg-gradient-to-br ${hue} to-[color:var(--surface)] flex items-center justify-center`}
    >
      <span className="font-impact text-6xl text-foreground/15 tracking-widest">
        {index.toString().padStart(2, "0")}
      </span>
      <span className="absolute bottom-3 left-3 text-xs uppercase tracking-widest text-foreground/40">
        Foto {index}
      </span>
    </div>
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
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[color:var(--border)] text-sm font-medium transition-colors ${
                  disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:border-foreground/60 hover:bg-[color:var(--surface)]"
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
      className="py-24 border-t border-[color:var(--border)] relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.12),transparent_60%)]" />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--accent)] mb-4">
          Contrataciones
        </p>
        <h2 className="font-impact text-5xl md:text-7xl tracking-tight mb-6">
          ¿Quieres a Pipe Cumbe en tu evento?
        </h2>
        <p className="text-lg text-[color:var(--muted)] mb-10">
          Disponible para conciertos, festivales, parrandas privadas y eventos
          corporativos en Colombia y exterior.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={site.contact.bookingWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-gradient text-black font-semibold px-7 py-4 rounded-full hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-lg"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Escribir por WhatsApp
          </a>
          <a
            href={`tel:+57${site.contact.bookingPhone}`}
            className="border border-[color:var(--border)] hover:border-foreground text-foreground font-semibold px-7 py-4 rounded-full inline-flex items-center gap-2 text-lg transition-colors"
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
  return (
    <footer className="border-t border-[color:var(--border)] py-10 text-center text-sm text-[color:var(--muted)]">
      <p>
        © {new Date().getFullYear()} {site.artistName}. Todos los derechos reservados.
      </p>
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

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
