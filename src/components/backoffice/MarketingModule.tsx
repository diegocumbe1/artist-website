"use client";

import { useMemo, useState } from "react";
import {
  budgetTiers,
  competitiveMoves,
  contentCalendar,
  contentPillars,
  marketingGoals,
  marketingObjective,
  weeklyPlan,
  type CalendarDay,
} from "@/data/marketing";
import { EmptyState, Panel } from "./ui";

const pillarStyles: Record<string, string> = {
  "Prueba social": "border-emerald-400/30 text-emerald-300",
  Conversión: "border-orange-300/40 text-orange-200",
  "Autoridad / marca": "border-yellow-300/40 text-yellow-200",
  Cercanía: "border-sky-400/30 text-sky-300",
  Medición: "border-white/20 text-foreground/70",
};

function PillarBadge({ pillar }: { pillar: string }) {
  const className = pillarStyles[pillar] ?? "border-white/15 text-foreground/70";
  return (
    <span className={`inline-flex shrink-0 rounded-full border bg-white/[0.025] px-3 py-1 text-xs ${className}`}>
      {pillar}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-orange-300/40 hover:bg-white/[0.07] hover:text-white"
    >
      {copied ? "✓ Copiado" : "Copiar copy"}
    </button>
  );
}

function DayCard({ day }: { day: CalendarDay }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.02]">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-orange-300/20 bg-white/[0.03] font-impact text-2xl tracking-wide brand-text-gradient">
          {day.day}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{day.idea}</p>
          <p className="mt-1 truncate text-xs text-[color:var(--muted)]">
            {day.weekday} · {day.channel} · {day.format}
          </p>
        </div>
        <PillarBadge pillar={day.pillar} />
      </button>

      {open && (
        <div className="border-t border-white/5 px-3 pb-3 pt-3">
          <div className="rounded-md border border-white/10 bg-[#050505]/60 p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted)]">Copy listo</p>
              {day.copy && <CopyButton text={day.copy} />}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{day.copy}</p>
          </div>

          {day.hashtags.length > 0 && (
            <div className="mt-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted)]">Hashtags</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {day.hashtags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-foreground/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2 rounded-md border border-orange-300/15 bg-[linear-gradient(135deg,rgba(251,191,36,0.06),rgba(234,88,12,0.04))] px-3 py-2">
            <span className="text-xs uppercase tracking-[0.12em] text-orange-100/60">CTA</span>
            <span className="text-sm text-foreground/90">{day.cta}</span>
          </div>
        </div>
      )}
    </article>
  );
}

export function MarketingModule() {
  const [weekFilter, setWeekFilter] = useState<number>(0); // 0 = todas

  const weeks = useMemo(() => {
    const map = new Map<number, CalendarDay[]>();
    for (const day of contentCalendar) {
      const week = Math.ceil(day.day / 7);
      map.set(week, [...(map.get(week) ?? []), day]);
    }
    return map;
  }, []);

  const visibleDays = useMemo(
    () =>
      weekFilter === 0
        ? contentCalendar
        : contentCalendar.filter((day) => Math.ceil(day.day / 7) === weekFilter),
    [weekFilter],
  );

  const weekButtons = [
    { id: 0, label: "Todo el mes" },
    { id: 1, label: "Semana 1" },
    { id: 2, label: "Semana 2" },
    { id: 3, label: "Semana 3" },
    { id: 4, label: "Semana 4" },
  ];

  return (
    <section className="grid gap-5">
      {/* Objetivo */}
      <Panel title="Objetivo de la promoción">
        <p className="max-w-4xl text-sm leading-relaxed text-foreground/80">{marketingObjective}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {contentPillars.map((pillar) => (
            <div key={pillar.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-white">{pillar.name}</p>
                <span className="font-impact text-2xl tracking-wide brand-text-gradient">{pillar.share}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted)]">{pillar.note}</p>
            </div>
          ))}
        </div>
      </Panel>

      {/* Cómo superar a la competencia local */}
      <Panel title="Cómo superar a Vallenato Sin Límite">
        <p className="mb-5 max-w-4xl text-sm leading-relaxed text-foreground/80">
          La competencia rankea de primero porque su nombre y bio en Facebook/Instagram dicen
          {" "}
          <span className="text-orange-200">&quot;Garzón Huila&quot;</span> literal, y el AI Overview de Google
          copia esas descripciones. No es que sean mejores: es que su perfil grita la ubicación. Esto se ataca así:
        </p>
        <div className="grid gap-3 lg:grid-cols-2">
          {competitiveMoves.map((item) => (
            <article key={item.move} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{item.move}</h3>
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
                    item.priority === "Alta"
                      ? "border-orange-300/40 text-orange-200"
                      : "border-white/15 text-foreground/60"
                  }`}
                >
                  {item.priority}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{item.action}</p>
              <p className="mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed text-[color:var(--muted)]">
                <span className="text-orange-200">Por qué funciona:</span> {item.why}
              </p>
            </article>
          ))}
        </div>
      </Panel>

      {/* Metas: qué lograr y cómo */}
      <Panel title="Qué lograr y cómo">
        <div className="grid gap-3 lg:grid-cols-2">
          {marketingGoals.map((goal) => (
            <article key={goal.label} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-white">{goal.label}</h3>
                <span className="shrink-0 rounded-full border border-orange-300/30 bg-white/[0.025] px-3 py-1 text-xs text-orange-200">
                  {goal.target}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">{goal.how}</p>
            </article>
          ))}
        </div>
      </Panel>

      {/* Estrategia semanal */}
      <Panel title="Estrategia semana a semana">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {weeklyPlan.map((week) => (
            <article key={week.week} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-orange-100/60">{week.week}</p>
              <h3 className="mt-1 font-impact text-2xl tracking-wide text-white">{week.theme}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted)]">{week.focus}</p>
              <ul className="mt-4 space-y-2">
                {week.deliverables.map((item) => (
                  <li key={item} className="flex gap-2 text-xs leading-relaxed text-foreground/80">
                    <span className="mt-0.5 text-orange-300">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Panel>

      {/* Calendario de 30 días */}
      <Panel
        title="Calendario de 30 días"
        action={
          <div className="flex flex-wrap gap-1.5">
            {weekButtons.map((button) => (
              <button
                key={button.id}
                type="button"
                onClick={() => setWeekFilter(button.id)}
                className={`h-8 shrink-0 rounded-full px-3 text-xs transition-colors ${
                  weekFilter === button.id
                    ? "brand-gradient font-semibold text-white"
                    : "border border-white/10 bg-white/[0.03] text-[color:var(--muted)] hover:border-orange-300/40 hover:text-foreground"
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        }
      >
        <p className="mb-4 text-sm text-[color:var(--muted)]">
          Toca cada día para ver el copy listo, los hashtags y el CTA. Copia y pega directo en Instagram y Facebook.
        </p>
        {visibleDays.length === 0 ? (
          <EmptyState text="No hay publicaciones en este filtro." />
        ) : (
          <div className="grid gap-2 lg:grid-cols-2">
            {visibleDays.map((day) => (
              <DayCard key={day.day} day={day} />
            ))}
          </div>
        )}
      </Panel>

      {/* Presupuesto */}
      <Panel title="Presupuesto sugerido">
        <p className="mb-5 text-sm text-[color:var(--muted)]">
          Empezar en orgánico y escalar solo cuando haya contenido, medición y WhatsApp listos. Valores aproximados en pesos colombianos.
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {budgetTiers.map((tier) => (
            <article
              key={tier.name}
              className={`flex flex-col rounded-lg border p-5 ${
                tier.recommended
                  ? "border-orange-300/40 bg-[linear-gradient(135deg,rgba(251,191,36,0.07),rgba(234,88,12,0.04))] shadow-[0_0_40px_rgba(245,158,11,0.10)]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-white">{tier.name}</h3>
                {tier.recommended && (
                  <span className="rounded-full border border-orange-300/40 px-2.5 py-0.5 text-[11px] text-orange-200">
                    Recomendado
                  </span>
                )}
              </div>
              <p className="mt-2 font-impact text-3xl tracking-wide brand-text-gradient">{tier.range}</p>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted)]">{tier.when}</p>

              <div className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
                {tier.items.map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-3 text-xs">
                    <span className="text-[color:var(--muted)]">{item.label}</span>
                    <span className="shrink-0 whitespace-nowrap font-semibold text-foreground/90">{item.amount}</span>
                  </div>
                ))}
              </div>

              <p className="mt-auto pt-4 text-xs leading-relaxed text-foreground/70">
                <span className="text-orange-200">Esperado:</span> {tier.expected}
              </p>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  );
}
