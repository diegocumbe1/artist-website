"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { site } from "@/data/site";

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const items = site.gallery;

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);
  const prev = useCallback(() => {
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + items.length) % items.length,
    );
  }, [items.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {items.map((img, i) => {
          const span = img.featured
            ? "col-span-2 md:col-span-3 aspect-[16/9]"
            : "aspect-square";
          return (
            <button
              key={img.src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Abrir ${img.alt}`}
              className={`group relative overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] cursor-zoom-in transition-shadow hover:shadow-2xl hover:shadow-amber-500/10 ${span}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={
                  img.featured
                    ? "(max-width: 768px) 100vw, 1200px"
                    : "(max-width: 768px) 50vw, 33vw"
                }
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="rounded-full bg-black/60 backdrop-blur-sm p-3.5 ring-1 ring-white/20">
                  <ZoomIcon className="w-5 h-5 text-white" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 animate-lightbox-fade"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imagen"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar visor"
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 text-white transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Imagen anterior"
            className="absolute left-2 md:left-6 z-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 text-white transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Imagen siguiente"
            className="absolute right-2 md:right-6 z-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 text-white transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>

          <div
            className="relative w-full h-full max-w-6xl max-h-[88vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={active.src}
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              priority
              sizes="100vw"
              className="object-contain w-auto h-auto max-w-full max-h-[88vh] rounded-md animate-lightbox-pop"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-white/60 select-none">
            {(activeIndex! + 1).toString().padStart(2, "0")} /{" "}
            {items.length.toString().padStart(2, "0")}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------- icons ---------------- */

function ZoomIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
