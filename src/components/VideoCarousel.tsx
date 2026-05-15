"use client";

import { useState, useCallback, useEffect } from "react";
import { site } from "@/data/site";

export function VideoCarousel() {
  const videos = site.videos;
  const [index, setIndex] = useState(0);
  const total = videos.length;
  const current = videos[index];

  const next = useCallback(
    () => setIndex((i) => (i + 1) % total),
    [total],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-widest text-[color:var(--muted)] mb-1">
            {(index + 1).toString().padStart(2, "0")} / {total.toString().padStart(2, "0")}
          </p>
          <h3 className="font-impact text-2xl md:text-3xl tracking-wide">
            {current.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Video anterior"
            className="rounded-full border border-[color:var(--border)] hover:border-foreground/60 hover:bg-[color:var(--surface)] p-3 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Video siguiente"
            className="rounded-full border border-[color:var(--border)] hover:border-foreground/60 hover:bg-[color:var(--surface)] p-3 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[color:var(--border)] bg-black shadow-2xl shadow-amber-500/5">
        <iframe
          key={current.youtubeId}
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${current.youtubeId}?rel=0`}
          title={current.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 md:gap-4">
        {videos.map((v, i) => {
          const active = i === index;
          return (
            <button
              key={v.youtubeId}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Reproducir ${v.title}`}
              aria-current={active ? "true" : "false"}
              className={`group relative aspect-video overflow-hidden rounded-lg border transition-all text-left ${
                active
                  ? "border-[color:var(--accent)] ring-2 ring-amber-500/40"
                  : "border-[color:var(--border)] hover:border-foreground/40 opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                alt={v.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className={`rounded-full p-2.5 transition-colors ${
                    active
                      ? "brand-gradient text-black"
                      : "bg-black/60 backdrop-blur-sm text-white group-hover:bg-black/80"
                  }`}
                >
                  <PlayIcon className="w-4 h-4" />
                </span>
              </div>
              <p className="absolute bottom-1.5 left-2 right-2 text-[10px] md:text-xs font-medium text-white line-clamp-2">
                {v.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
