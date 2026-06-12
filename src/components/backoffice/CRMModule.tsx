"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  BackofficeData,
  Lead,
  LeadStage,
  ManagedEvent,
  defaultSettings,
  leadPipeline,
  leadStages,
  stageProbability,
} from "@/data/backoffice";
import {
  ShowFormatKey,
  computePricing,
  eventTypeKeys,
  showFormatKeys,
  showFormats,
} from "./finance";
import {
  CurrencyField,
  EmptyState,
  Field,
  Kpi,
  Panel,
  SelectField,
  createId,
  currency,
} from "./ui";

type SetData = (updater: (current: BackofficeData) => BackofficeData) => void;

const stageTone: Record<LeadStage, string> = {
  Nuevo: "border-white/15 text-orange-100/70",
  Contactado: "border-amber-300/25 text-amber-100",
  Calificado: "border-amber-300/35 text-amber-100",
  Cotizado: "border-orange-300/35 text-orange-200",
  Negociación: "border-orange-400/45 text-orange-200",
  "Anticipo pendiente": "border-yellow-300/45 text-yellow-100",
  Separado: "border-emerald-400/30 text-emerald-300",
  Confirmado: "border-emerald-400/40 text-emerald-300",
  Perdido: "border-red-400/30 text-red-300",
};

function formatLabel(key: string) {
  return showFormats[key as ShowFormatKey]?.label ?? key;
}

const quickScripts = [
  {
    label: "Primer contacto",
    build: (lead: Lead) =>
      `Hola ${lead.name || "[cliente]"}, ¡gracias por escribirnos! Para pasarte la propuesta de Pipe Cumbe y no quedarte mal, cuéntame: ¿qué tipo de evento es, fecha y ciudad, y ponen sonido/tarima o lo llevamos nosotros?`,
  },
  {
    label: "Pedir anticipo",
    build: (lead: Lead) =>
      `${lead.name || "[cliente]"}, para dejar tu fecha bloqueada te paso los datos para el anticipo del 50%. Apenas confirmes te envío el soporte y queda reservado a tu nombre. La fecha la tengo con solicitud, el primero que confirma la asegura.`,
  },
  {
    label: "Seguimiento (se enfrió)",
    build: (lead: Lead) =>
      `Hola ${lead.name || "[cliente]"}, te recuerdo que la fecha ${lead.tentativeDate || "[fecha]"} sigue con solicitud. ¿La aseguramos? Te sostengo el valor hasta que confirmes.`,
  },
  {
    label: "Cierre asumido",
    build: (lead: Lead) =>
      `Perfecto ${lead.name || "[cliente]"}. ¿A nombre de quién dejo la reserva y te paso los datos para el anticipo?`,
  },
];

export function CRMModule({ data, setData }: { data: BackofficeData; setData: SetData }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const leads = data.leads ?? [];
  const active = leads.filter((lead) => lead.stage !== "Perdido");
  const weightedPipeline = active.reduce(
    (sum, lead) => sum + (lead.quotedValue || lead.estimatedBudget) * (lead.closeProbability / 100),
    0,
  );
  const quotedTotal = active.reduce((sum, lead) => sum + lead.quotedValue, 0);
  const confirmed = leads.filter((lead) => lead.stage === "Confirmado");

  function addLead(lead: Lead) {
    setData((current) => ({ ...current, leads: [lead, ...(current.leads ?? [])] }));
  }

  function updateLead(id: string, patch: Partial<Lead>) {
    setData((current) => ({
      ...current,
      leads: (current.leads ?? []).map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)),
    }));
  }

  function removeLead(id: string) {
    setData((current) => ({
      ...current,
      leads: (current.leads ?? []).filter((lead) => lead.id !== id),
    }));
    if (selectedId === id) setSelectedId(null);
  }

  function moveStage(lead: Lead, direction: 1 | -1) {
    const index = leadPipeline.indexOf(lead.stage);
    if (index === -1) return; // Perdido: usar el editor para reactivar
    const nextIndex = Math.min(Math.max(index + direction, 0), leadPipeline.length - 1);
    const nextStage = leadPipeline[nextIndex];
    updateLead(lead.id, { stage: nextStage, closeProbability: stageProbability[nextStage] });
  }

  function convertToEvent(lead: Lead) {
    const settings = data.settings ?? defaultSettings;
    const pricing = computePricing({
      formatKey: (showFormats[lead.format as ShowFormatKey] ? lead.format : "medio") as ShowFormatKey,
      eventType: lead.eventType,
      scope: "local",
      settings,
    });
    const value = lead.quotedValue || pricing.healthy;
    const newEvent: ManagedEvent = {
      id: createId("evt"),
      date: lead.tentativeDate,
      client: lead.name,
      city: lead.city,
      type: lead.eventType,
      status: "Confirmado",
      value,
      operationCosts:
        pricing.breakdown.transport +
        pricing.breakdown.logistics +
        pricing.breakdown.meals +
        pricing.breakdown.lodging,
      singerPay: pricing.breakdown.singer,
      musiciansPay: pricing.breakdown.musicians,
      managerPct: settings.managerPct,
      reinvestPct: settings.reinvestPct,
      contingencyPct: settings.contingencyPct,
      notes: lead.notes,
      format: lead.format,
      coverage: "local",
      suggestedPrice: pricing.healthy,
      negotiatedPrice: value,
    };
    setData((current) => ({
      ...current,
      events: [newEvent, ...current.events],
      leads: (current.leads ?? []).map((item) =>
        item.id === lead.id ? { ...item, convertedEventId: newEvent.id } : item,
      ),
    }));
  }

  const selected = leads.find((lead) => lead.id === selectedId) ?? null;

  return (
    <section className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
        <Kpi label="Leads activos" value={String(active.length)} hint="En el embudo (sin perdidos)" />
        <Kpi label="Pipeline ponderado" value={currency.format(weightedPipeline)} hint="Valor × probabilidad de cierre" tone="good" />
        <Kpi label="Cotizado activo" value={currency.format(quotedTotal)} hint="Suma de valores cotizados" />
        <Kpi label="Confirmados" value={String(confirmed.length)} hint="Listos para convertir en contratación" tone="good" />
      </div>

      <NewLeadForm onAdd={addLead} />

      <PipelineBoard
        leads={leads}
        onSelect={setSelectedId}
        onMove={moveStage}
        selectedId={selectedId}
      />

      {selected && (
        <LeadEditor
          lead={selected}
          onChange={(patch) => updateLead(selected.id, patch)}
          onRemove={() => removeLead(selected.id)}
          onConvert={() => convertToEvent(selected)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}

function NewLeadForm({ onAdd }: { onAdd: (lead: Lead) => void }) {
  const empty: Omit<Lead, "id" | "createdAt"> = {
    name: "",
    phone: "",
    city: "",
    tentativeDate: "",
    eventType: eventTypeKeys[0],
    format: "medio",
    estimatedBudget: 0,
    quotedValue: 0,
    stage: "Nuevo",
    closeProbability: stageProbability.Nuevo,
    owner: "Booking",
    nextAction: "",
    notes: "",
  };
  const [draft, setDraft] = useState(empty);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onAdd({ ...draft, id: createId("lead"), createdAt: new Date().toISOString().slice(0, 10) });
    setDraft(empty);
  }

  return (
    <Panel
      title="Nuevo lead"
      action={<span className="rounded-full border border-orange-300/20 bg-white/[0.03] px-3 py-1 text-xs text-orange-100/70">Captura rápida</span>}
    >
      <form onSubmit={submit} className="grid gap-4">
        <div className="rounded-lg border border-white/10 bg-[#0d0d0d]/75 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.12em] text-orange-100/60">
            Contacto y evento
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="xl:col-span-2">
              <Field label="Cliente" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
            </div>
            <Field label="Teléfono" value={draft.phone} onChange={(value) => setDraft({ ...draft, phone: value })} />
            <Field label="Ciudad" value={draft.city} onChange={(value) => setDraft({ ...draft, city: value })} />
            <Field label="Fecha tentativa" type="date" value={draft.tentativeDate} onChange={(value) => setDraft({ ...draft, tentativeDate: value })} />
            <SelectField label="Tipo de evento" value={draft.eventType} options={eventTypeKeys} onChange={(value) => setDraft({ ...draft, eventType: value })} />
            <SelectField label="Formato sugerido" value={draft.format} options={showFormatKeys.map((key) => ({ value: key, label: showFormats[key].label }))} onChange={(value) => setDraft({ ...draft, format: value })} />
            <CurrencyField label="Presupuesto estimado" value={draft.estimatedBudget} onChange={(value) => setDraft({ ...draft, estimatedBudget: value })} />
          </div>
        </div>

        <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4 md:grid-cols-[1fr_auto] md:items-end">
          <Field label="Responsable" value={draft.owner} onChange={(value) => setDraft({ ...draft, owner: value })} />
          <button type="submit" className="brand-gradient h-11 rounded-md px-6 font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]">
            Agregar lead
          </button>
        </div>
      </form>
    </Panel>
  );
}

function PipelineBoard({
  leads,
  onSelect,
  onMove,
  selectedId,
}: {
  leads: Lead[];
  onSelect: (id: string) => void;
  onMove: (lead: Lead, direction: 1 | -1) => void;
  selectedId: string | null;
}) {
  const byStage = useMemo(() => {
    const map = new Map<LeadStage, Lead[]>();
    leadStages.forEach((stage) => map.set(stage, []));
    leads.forEach((lead) => map.get(lead.stage)?.push(lead));
    return map;
  }, [leads]);

  return (
    <Panel title="Embudo de ventas">
      {leads.length === 0 ? (
        <EmptyState text="Todavía no hay leads. Agrega el primero arriba." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {leadStages.map((stage) => {
            const items = byStage.get(stage) ?? [];
            const total = items.reduce((sum, lead) => sum + (lead.quotedValue || lead.estimatedBudget), 0);
            return (
              <div key={stage} className="min-w-0 rounded-lg border border-white/10 bg-[#090909]/75 p-3">
                <div className={`mb-3 flex items-center justify-between gap-3 rounded-md border bg-white/[0.025] px-3 py-2 ${stageTone[stage]}`}>
                  <span className="min-w-0 truncate text-sm font-semibold">{stage}</span>
                  <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-xs">{items.length}</span>
                </div>
                <div className="mb-3 flex items-end justify-between gap-3 px-1">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--muted)]">Valor etapa</p>
                  <p className="whitespace-nowrap text-xs font-semibold text-orange-100">{currency.format(total)}</p>
                </div>
                <div className="space-y-2">
                  {items.map((lead) => (
                    <article
                      key={lead.id}
                      className={`rounded-lg border bg-white/[0.035] p-3 shadow-[0_0_24px_rgba(0,0,0,0.22)] transition-colors ${
                        selectedId === lead.id ? "border-orange-300/60 bg-orange-300/[0.045]" : "border-white/10 hover:border-orange-300/35 hover:bg-white/[0.05]"
                      }`}
                    >
                      <button type="button" onClick={() => onSelect(lead.id)} className="block w-full text-left">
                        <div className="flex items-start justify-between gap-3">
                          <p className="min-w-0 truncate font-semibold text-foreground">{lead.name}</p>
                          <span className="shrink-0 text-[11px] text-orange-100/70">{lead.closeProbability}%</span>
                        </div>
                        <p className="mt-1 text-xs text-[color:var(--muted)]">
                          {lead.city || "s/ciudad"} · {lead.tentativeDate || "s/fecha"}
                        </p>
                        <p className="mt-1 truncate text-xs text-[color:var(--muted)]">
                          {lead.eventType} · {formatLabel(lead.format)}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-orange-200">
                          {currency.format(lead.quotedValue || lead.estimatedBudget)}
                        </p>
                        {lead.convertedEventId && (
                          <p className="mt-1 text-[11px] text-emerald-300">Convertido en contratación</p>
                        )}
                      </button>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onMove(lead, -1)}
                          className="h-7 w-8 rounded border border-white/15 text-xs text-[color:var(--muted)] transition-colors hover:border-orange-300/40 hover:text-white"
                          aria-label="Etapa anterior"
                        >
                          &lt;
                        </button>
                        {lead.nextAction && (
                          <span className="flex-1 truncate text-[10px] text-[color:var(--muted)]" title={lead.nextAction}>
                            {lead.nextAction}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => onMove(lead, 1)}
                          className="h-7 w-8 rounded border border-white/15 text-xs text-[color:var(--muted)] transition-colors hover:border-orange-300/40 hover:text-white"
                          aria-label="Siguiente etapa"
                        >
                          &gt;
                        </button>
                      </div>
                    </article>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-md border border-dashed border-white/10 bg-white/[0.015] p-4 text-center text-xs text-[color:var(--muted)]">
                      Sin leads en esta etapa
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

function LeadEditor({
  lead,
  onChange,
  onRemove,
  onConvert,
  onClose,
}: {
  lead: Lead;
  onChange: (patch: Partial<Lead>) => void;
  onRemove: () => void;
  onConvert: () => void;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copyScript(label: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  const canConvert = lead.stage === "Confirmado" && !lead.convertedEventId;

  return (
    <Panel
      title={`Lead · ${lead.name}`}
      action={
        <button type="button" onClick={onClose} className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-orange-300/40 hover:text-white">
          Cerrar
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-white/10 bg-[#0d0d0d]/75 p-4">
          <p className="mb-3 text-xs uppercase tracking-[0.12em] text-orange-100/60">
            Datos del lead
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Cliente" value={lead.name} onChange={(value) => onChange({ name: value })} />
            <Field label="Teléfono" value={lead.phone} onChange={(value) => onChange({ phone: value })} />
            <Field label="Ciudad" value={lead.city} onChange={(value) => onChange({ city: value })} />
            <Field label="Fecha tentativa" type="date" value={lead.tentativeDate} onChange={(value) => onChange({ tentativeDate: value })} />
            <SelectField label="Tipo de evento" value={lead.eventType} options={eventTypeKeys} onChange={(value) => onChange({ eventType: value })} />
            <SelectField label="Formato sugerido" value={lead.format} options={showFormatKeys.map((key) => ({ value: key, label: showFormats[key].label }))} onChange={(value) => onChange({ format: value })} />
            <CurrencyField label="Presupuesto estimado" value={lead.estimatedBudget} onChange={(value) => onChange({ estimatedBudget: value })} />
            <CurrencyField label="Valor cotizado" value={lead.quotedValue} onChange={(value) => onChange({ quotedValue: value })} />
            <SelectField label="Estado" value={lead.stage} options={leadStages} onChange={(value) => onChange({ stage: value as LeadStage, closeProbability: stageProbability[value as LeadStage] })} />
            <Field label="% Probabilidad" type="number" value={String(lead.closeProbability)} onChange={(value) => onChange({ closeProbability: Number(value) })} />
            <Field label="Responsable" value={lead.owner} onChange={(value) => onChange({ owner: value })} />
            <Field label="Próxima acción" value={lead.nextAction} onChange={(value) => onChange({ nextAction: value })} />
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">Notas</span>
              <textarea
                value={lead.notes}
                onChange={(event) => onChange({ notes: event.target.value })}
                className="min-h-24 w-full rounded-md border border-white/10 bg-white/[0.035] p-3 text-sm text-foreground outline-none transition-colors focus:border-orange-300/70 focus:bg-white/[0.055]"
              />
            </label>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <h3 className="mb-3 text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">Scripts rápidos</h3>
            <div className="space-y-2">
              {quickScripts.map((script) => (
                <button
                  key={script.label}
                  type="button"
                  onClick={() => copyScript(script.label, script.build(lead))}
                  className="block w-full rounded-md border border-white/10 bg-[#050505]/55 p-2.5 text-left text-xs transition-colors hover:border-orange-300/40 hover:bg-white/[0.05]"
                >
                  <span className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{script.label}</span>
                    <span className="text-[color:var(--muted)]">{copied === script.label ? "¡Copiado!" : "Copiar"}</span>
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[color:var(--muted)]">{script.build(lead)}</span>
                </button>
              ))}
            </div>
          </div>

          {canConvert ? (
            <button
              type="button"
              onClick={onConvert}
              className="brand-gradient h-11 rounded-md font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:opacity-90"
            >
              Convertir en contratación
            </button>
          ) : lead.convertedEventId ? (
            <p className="rounded-md border border-emerald-400/30 bg-emerald-500/10 p-3 text-center text-sm text-emerald-300">
              ✓ Ya convertido en contratación
            </p>
          ) : (
            <p className="rounded-md border border-white/10 bg-white/[0.02] p-3 text-center text-xs text-[color:var(--muted)]">
              Mueve el lead a <span className="text-foreground">Confirmado</span> para convertirlo en contratación.
            </p>
          )}

          <button
            type="button"
            onClick={onRemove}
            className="h-10 rounded-md border border-red-400/30 text-sm text-red-300 transition-colors hover:bg-red-500/10"
          >
            Eliminar lead
          </button>
        </div>
      </div>
    </Panel>
  );
}
