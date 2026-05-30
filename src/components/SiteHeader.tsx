"use client";

import { usePathname } from "next/navigation";
import { site } from "@/data/site";

const links = [
  { href: "/#sobre", label: "Sobre" },
  { href: "/#musica", label: "Música" },
  { href: "/#presentaciones", label: "Presentaciones" },
  { href: "/#video", label: "Video" },
  { href: "/#galeria", label: "Galería" },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteHeader() {
  const pathname = usePathname();

  if (pathname?.startsWith("/backoffice")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-orange-950/50 bg-[#050505]/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="/#top"
          className="font-impact text-2xl tracking-wider brand-text-gradient"
        >
          {site.artistName.toUpperCase()}
        </a>
        <nav className="hidden items-center gap-7 text-sm text-[color:var(--muted)] md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="/#contacto"
          className="brand-gradient rounded-full px-4 py-2 text-sm font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
        >
          Booking
        </a>
      </div>
    </header>
  );
}
