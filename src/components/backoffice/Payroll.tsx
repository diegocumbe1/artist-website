"use client";

import { useState } from "react";
import { MusicianMultipliers, TeamMember, defaultMultipliers } from "@/data/backoffice";
import { ShowScope, computeMusicianPay, memberMultipliers } from "./finance";
import { CurrencyField, Field, createId, currency } from "./ui";

export type RosterEntry = {
  id: string;
  name: string;
  instrument: string;
  base: number;
  multipliers: MusicianMultipliers;
  included: boolean;
  overrideEnabled: boolean;
  overrideValue: number;
  bonus: number;
  note: string;
  temp: boolean;
};

export type PayrollContext = {
  eventType: string;
  scope: ShowScope;
  premiumApplies: boolean;
};

/** Construye la nómina inicial desde el equipo (excluye al cantante). */
export function buildRoster(team: TeamMember[]): RosterEntry[] {
  return team
    .filter((member) => member.role.toLowerCase() !== "cantante")
    .map((member) => ({
      id: member.id,
      name: member.name,
      instrument: member.role,
      base: member.basePay,
      multipliers: memberMultipliers(member),
      included: member.status === "Activo",
      overrideEnabled: Boolean(member.manualOverrideEnabled),
      overrideValue: member.basePay,
      bonus: 0,
      note: "",
      temp: false,
    }));
}

/** Cachet final de una línea (override manual o cálculo + bono). */
export function entryFinal(entry: RosterEntry, context: PayrollContext) {
  const pay = computeMusicianPay(entry.base, entry.multipliers, context);
  const computed = entry.overrideEnabled ? entry.overrideValue : pay.computed;
  return { ...pay, finalBeforeBonus: computed, final: computed + entry.bonus };
}

export function rosterTotal(roster: RosterEntry[], context: PayrollContext) {
  return roster
    .filter((entry) => entry.included)
    .reduce((sum, entry) => sum + entryFinal(entry, context).final, 0);
}

export function PayrollPanel({
  roster,
  setRoster,
  context,
}: {
  roster: RosterEntry[];
  setRoster: (next: RosterEntry[]) => void;
  context: PayrollContext;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  function patch(id: string, change: Partial<RosterEntry>) {
    setRoster(roster.map((entry) => (entry.id === id ? { ...entry, ...change } : entry)));
  }

  function addTemp() {
    setRoster([
      ...roster,
      {
        id: createId("temp"),
        name: "Músico temporal",
        instrument: "Refuerzo",
        base: 130000,
        multipliers: { ...defaultMultipliers },
        included: true,
        overrideEnabled: true,
        overrideValue: 130000,
        bonus: 0,
        note: "",
        temp: true,
      },
    ]);
  }

  const includedCount = roster.filter((entry) => entry.included).length;
  const total = rosterTotal(roster, context);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          Nómina dinámica · {includedCount} músicos
        </p>
        <button
          type="button"
          onClick={addTemp}
          className="rounded-full border border-orange-300/40 px-3 py-1 text-xs hover:bg-white/[0.06]"
        >
          + Músico temporal
        </button>
      </div>

      <div className="space-y-1.5">
        {roster.map((entry) => {
          const detail = entryFinal(entry, context);
          const diff = detail.final - entry.base;
          const isOpen = expanded === entry.id;
          return (
            <div
              key={entry.id}
              className={`rounded-md border p-2.5 transition-colors ${
                entry.included ? "border-white/10 bg-white/[0.02]" : "border-white/5 bg-transparent opacity-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={entry.included}
                  onChange={(e) => patch(entry.id, { included: e.target.checked })}
                  className="size-4 shrink-0 accent-orange-400"
                  aria-label={`Incluir ${entry.name}`}
                />
                <button type="button" onClick={() => setExpanded(isOpen ? null : entry.id)} className="flex flex-1 items-center justify-between gap-2 text-left">
                  <span>
                    <span className="text-sm font-semibold">{entry.name}</span>
                    <span className="ml-2 text-xs text-[color:var(--muted)]">{entry.instrument}</span>
                    {entry.temp && <span className="ml-2 rounded-full border border-orange-300/30 px-1.5 text-[10px] text-orange-200">temp</span>}
                    {entry.overrideEnabled && <span className="ml-2 rounded-full border border-amber-300/30 px-1.5 text-[10px] text-amber-200">manual</span>}
                    <span className="mt-0.5 block text-[11px] text-[color:var(--muted)]">
                      Base {currency.format(entry.base)}
                      {detail.factors.map((f) => ` · ${f.label} +${Math.round((f.factor - 1) * 100)}%`).join("")}
                      {entry.bonus ? ` · bono ${currency.format(entry.bonus)}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-semibold text-orange-200">{currency.format(detail.final)}</span>
                    {diff !== 0 && (
                      <span className={`block text-[11px] ${diff > 0 ? "text-emerald-300" : "text-red-300"}`}>
                        {diff > 0 ? "+" : ""}
                        {currency.format(diff)}
                      </span>
                    )}
                  </span>
                </button>
              </div>

              {isOpen && (
                <div className="mt-2 grid gap-2 border-t border-white/5 pt-2 sm:grid-cols-2">
                  <label className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
                    <input
                      type="checkbox"
                      checked={entry.overrideEnabled}
                      onChange={(e) => patch(entry.id, { overrideEnabled: e.target.checked })}
                      className="size-4 accent-amber-400"
                    />
                    Congelar valor manual
                  </label>
                  {entry.overrideEnabled ? (
                    <CurrencyField label="Valor manual" value={entry.overrideValue} onChange={(v) => patch(entry.id, { overrideValue: v })} />
                  ) : (
                    <CurrencyField label="Tarifa base" value={entry.base} onChange={(v) => patch(entry.id, { base: v })} />
                  )}
                  <CurrencyField label="Bono extra" value={entry.bonus} onChange={(v) => patch(entry.id, { bonus: v })} />
                  <Field label="Nota" value={entry.note} onChange={(v) => patch(entry.id, { note: v })} />
                  {entry.temp && (
                    <div className="sm:col-span-2">
                      <Field label="Nombre / rol del temporal" value={entry.name} onChange={(v) => patch(entry.id, { name: v })} />
                      <button
                        type="button"
                        onClick={() => setRoster(roster.filter((item) => item.id !== entry.id))}
                        className="mt-2 text-xs text-red-300 hover:underline"
                      >
                        Quitar temporal
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
        <span className="text-sm font-semibold">Nómina músicos</span>
        <span className="font-impact text-2xl tracking-wide text-orange-200">{currency.format(total)}</span>
      </div>
    </div>
  );
}
