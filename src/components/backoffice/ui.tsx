"use client";

import { EventStatus } from "@/data/backoffice";

export const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.03] p-4 shadow-[0_0_40px_rgba(245,158,11,0.06)] backdrop-blur-md md:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-impact text-3xl tracking-wide text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Kpi({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "good" | "bad" | "warn";
}) {
  const toneClass =
    tone === "good"
      ? "text-emerald-300"
      : tone === "bad"
        ? "text-red-300"
        : tone === "warn"
          ? "text-orange-200"
          : "brand-text-gradient";

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
      <p className="text-xs uppercase leading-snug tracking-[0.12em] text-[color:var(--muted)]">{label}</p>
      <p className={`mt-3 font-impact text-4xl tracking-wide ${toneClass}`}>{value}</p>
      {hint && <p className="mt-2 text-xs text-[color:var(--muted)]">{hint}</p>}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase leading-snug tracking-[0.12em] text-[color:var(--muted)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm text-foreground outline-none transition-colors focus:border-orange-300/70 focus:bg-white/[0.055]"
      />
    </label>
  );
}

export function CurrencyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase leading-snug tracking-[0.12em] text-[color:var(--muted)]">
        {label}
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={currency.format(value || 0)}
        onChange={(event) => {
          const numericValue = Number(event.target.value.replace(/\D/g, ""));
          onChange(Number.isFinite(numericValue) ? numericValue : 0);
        }}
        className="h-11 w-full rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm text-foreground outline-none transition-colors focus:border-orange-300/70 focus:bg-white/[0.055]"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[] | string[];
  onChange: (value: string) => void;
}) {
  const normalized = options.map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );

  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase leading-snug tracking-[0.12em] text-[color:var(--muted)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm text-foreground outline-none transition-colors focus:border-orange-300/70 focus:bg-white/[0.055]"
      >
        {normalized.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StatusBadge({ status }: { status: EventStatus }) {
  const className =
    status === "Confirmado" || status === "Realizado"
      ? "border-emerald-400/30 text-emerald-300"
      : status === "Cancelado"
        ? "border-red-400/30 text-red-300"
        : "border-orange-300/35 text-orange-200";

  return (
    <span className={`inline-flex rounded-full border bg-white/[0.025] px-3 py-1 text-xs ${className}`}>
      {status}
    </span>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-orange-300/20 bg-white/[0.02] p-8 text-center text-sm text-[color:var(--muted)]">
      {text}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className="brand-gradient h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
