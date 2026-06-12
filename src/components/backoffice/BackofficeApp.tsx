"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BackofficeAccount,
  BackofficeData,
  BackofficeUser,
  EventStatus,
  FinanceSettings,
  ManagedEvent,
  OperatingCost,
  TeamMember,
  backofficeAccounts,
  defaultCosts,
  defaultEvents,
  defaultExpenses,
  defaultGoals,
  defaultLeads,
  defaultPayments,
  defaultQuotes,
  defaultSettings,
  defaultTeam,
} from "@/data/backoffice";
import {
  ShowFormatKey,
  ShowScope,
  computePricing,
  eventProfit,
  eventTypeKeys,
  eventTypeProfiles,
  financialStatus,
  musiciansBaseFromSettings,
  operationCostFromSettings,
  scopeKeys,
  scopeProfiles,
  showFormatKeys,
  showFormats,
} from "./finance";
import {
  EmptyState,
  CurrencyField,
  Field,
  Kpi,
  Panel,
  SelectField,
  StatusBadge,
  createId,
  currency,
} from "./ui";
import { FinanceModule } from "./FinanceModule";
import { CRMModule } from "./CRMModule";
import { PayrollPanel, RosterEntry, buildRoster, rosterTotal } from "./Payroll";

type Tab =
  | "dashboard"
  | "calendar"
  | "events"
  | "crm"
  | "finance"
  | "calculator"
  | "variables"
  | "team"
  | "costs";
type StoredData = BackofficeData;

const storageKey = "pipe-cumbe-backoffice-v1";
const sessionKey = "pipe-cumbe-backoffice-session";

const tabs: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Resumen" },
  { id: "calendar", label: "Calendario" },
  { id: "crm", label: "Leads / CRM" },
  { id: "events", label: "Contrataciones" },
  { id: "finance", label: "Finanzas" },
  { id: "calculator", label: "Calculadora" },
  { id: "variables", label: "Variables" },
  { id: "team", label: "Equipo" },
  { id: "costs", label: "Costos" },
];

// Booking gestiona pipeline comercial: CRM, calendario y contrataciones.
const bookingTabs = new Set<Tab>(["dashboard", "calendar", "crm", "events"]);

function tabsForRole(role: BackofficeAccount["role"]): { id: Tab; label: string }[] {
  if (role === "Booking") return tabs.filter((tab) => bookingTabs.has(tab.id));
  return tabs;
}

const statuses: EventStatus[] = [
  "Lead",
  "Cotizado",
  "Separado",
  "Confirmado",
  "Realizado",
  "Cancelado",
];

const eventTypes = [
  "Matrimonio",
  "Evento privado",
  "Festival",
  "Feria y fiestas",
  "Corporativo",
  "Concierto",
  "Parranda vallenata",
];

const eventPricingPresets: Record<
  string,
  {
    operationCosts: number;
    singerPay: number;
    musiciansPay: number;
    targetProfitPct: number;
    notes: string;
  }
> = {
  Matrimonio: {
    operationCosts: 160000,
    singerPay: 120000,
    musiciansPay: 360000,
    targetProfitPct: 0.32,
    notes: "Evento social con montaje cuidado, repertorio amplio y logística media.",
  },
  "Evento privado": {
    operationCosts: 120000,
    singerPay: 100000,
    musiciansPay: 300000,
    targetProfitPct: 0.3,
    notes: "Celebración privada o familiar con operación compacta.",
  },
  Festival: {
    operationCosts: 350000,
    singerPay: 180000,
    musiciansPay: 480000,
    targetProfitPct: 0.35,
    notes: "Tarima pública, mayor coordinación y margen de negociación.",
  },
  "Feria y fiestas": {
    operationCosts: 300000,
    singerPay: 160000,
    musiciansPay: 460000,
    targetProfitPct: 0.34,
    notes: "Evento municipal o masivo con logística ampliada.",
  },
  Corporativo: {
    operationCosts: 180000,
    singerPay: 140000,
    musiciansPay: 360000,
    targetProfitPct: 0.35,
    notes: "Evento empresarial con estándar alto de puntualidad y producción.",
  },
  Concierto: {
    operationCosts: 400000,
    singerPay: 200000,
    musiciansPay: 540000,
    targetProfitPct: 0.38,
    notes: "Formato de tarima con mayor exigencia técnica y artística.",
  },
  "Parranda vallenata": {
    operationCosts: 90000,
    singerPay: 80000,
    musiciansPay: 260000,
    targetProfitPct: 0.28,
    notes: "Formato cercano, social y flexible para celebraciones.",
  },
};

function roundQuote(value: number) {
  return Math.ceil(value / 50000) * 50000;
}

function quoteFor({
  operationCosts,
  singerPay,
  musiciansPay,
  managerPct,
  reinvestPct,
  contingencyPct,
  targetProfitPct,
  value,
}: {
  operationCosts: number;
  singerPay: number;
  musiciansPay: number;
  managerPct: number;
  reinvestPct: number;
  contingencyPct: number;
  targetProfitPct: number;
  value: number;
}) {
  const directCosts = operationCosts + singerPay + musiciansPay;
  const fixedPct = managerPct + reinvestPct + contingencyPct;
  const minDivisor = Math.max(0.05, 1 - fixedPct);
  const recommendedDivisor = Math.max(0.05, 1 - fixedPct - targetProfitPct);
  const minimumValue = roundQuote(directCosts / minDivisor);
  const recommendedValue = roundQuote(directCosts / recommendedDivisor);
  const manager = value * managerPct;
  const reinvest = value * reinvestPct;
  const contingency = value * contingencyPct;
  const profit = value - directCosts - manager - reinvest - contingency;
  const profitPct = value > 0 ? profit / value : 0;

  return {
    directCosts,
    fixedPct,
    minimumValue,
    recommendedValue,
    singerPay,
    manager,
    reinvest,
    contingency,
    profit,
    profitPct,
    operationPct: value > 0 ? operationCosts / value : 0,
    singerPct: value > 0 ? singerPay / value : 0,
    musiciansPct: value > 0 ? musiciansPay / value : 0,
    managerPct,
    reinvestPct,
    contingencyPct,
  };
}

function draftForType(type: string): Omit<ManagedEvent, "id"> {
  const preset = eventPricingPresets[type] ?? eventPricingPresets[eventTypes[0]];
  const managerPct = 0.1;
  const reinvestPct = 0.05;
  const contingencyPct = 0.03;
  const recommendedValue = quoteFor({
    operationCosts: preset.operationCosts,
    singerPay: preset.singerPay,
    musiciansPay: preset.musiciansPay,
    managerPct,
    reinvestPct,
    contingencyPct,
    targetProfitPct: preset.targetProfitPct,
    value: 0,
  }).recommendedValue;

  return {
    date: "",
    client: "",
    city: "",
    type,
    status: "Lead",
    value: recommendedValue,
    operationCosts: preset.operationCosts,
    singerPay: preset.singerPay,
    musiciansPay: preset.musiciansPay,
    managerPct,
    reinvestPct,
    contingencyPct,
    notes: preset.notes,
  };
}

function getInitialData(): StoredData {
  return {
    events: defaultEvents,
    team: defaultTeam,
    costs: defaultCosts,
    payments: defaultPayments,
    expenses: defaultExpenses,
    goals: defaultGoals,
    settings: defaultSettings,
    leads: defaultLeads,
    quotes: defaultQuotes,
  };
}

export function BackofficeApp() {
  const [account, setAccount] = useState<BackofficeAccount | null>(null);
  const [data, setData] = useState<StoredData>(getInitialData);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  useEffect(() => {
    const savedData = window.localStorage.getItem(storageKey);
    const savedSession = window.localStorage.getItem(sessionKey);

    if (savedData) {
      // Mezclamos con los valores por defecto para que datos guardados de
      // versiones anteriores no rompan al faltarles llaves nuevas (finanzas,
      // settings). Los objetos anidados se mezclan en profundidad.
      const parsed = JSON.parse(savedData) as Partial<StoredData>;
      setData({
        ...getInitialData(),
        ...parsed,
        goals: { ...defaultGoals, ...(parsed.goals ?? {}) },
        settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      });
    }

    if (savedSession) {
      const session = backofficeAccounts.find((item) => item.user === savedSession);
      if (session) setAccount(session);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data]);

  function login(nextAccount: BackofficeAccount) {
    window.localStorage.setItem(sessionKey, nextAccount.user);
    setAccount(nextAccount);
  }

  function logout() {
    window.localStorage.removeItem(sessionKey);
    setAccount(null);
  }

  const visibleTabs = useMemo(
    () => (account ? tabsForRole(account.role) : tabs),
    [account],
  );

  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab]);

  if (!account) return <LoginScreen onLogin={login} />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_0%,rgba(245,158,11,0.12),transparent_32%),radial-gradient(circle_at_85%_16%,rgba(194,65,12,0.12),transparent_34%),linear-gradient(180deg,#050505_0%,#090909_42%,#050505_100%)]" />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 md:px-6">
        <header className="flex flex-col justify-between gap-4 border-b border-orange-950/50 pb-5 md:flex-row md:items-center">
          <div>
            <a href="/" className="text-xs uppercase tracking-[0.24em] text-[color:var(--muted)] hover:text-foreground">
              Pipe Cumbe Oficial
            </a>
            <h1 className="mt-2 font-impact text-4xl tracking-wide md:text-5xl">
              Backoffice Manager
            </h1>
            <p className="mt-1 text-sm text-[color:var(--muted)]">
              Operación, booking y finanzas del show en vivo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-orange-300/15 bg-white/[0.03] px-4 py-2 text-sm text-[color:var(--muted)] backdrop-blur-md">
              {account.label} · {account.role}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-foreground/80 backdrop-blur-md transition-colors hover:border-orange-300/40 hover:bg-white/[0.06] hover:text-white"
            >
              Salir
            </button>
          </div>
        </header>

        <nav className="flex gap-2 overflow-x-auto pb-1">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`h-10 shrink-0 rounded-full px-4 text-sm transition-colors ${
                activeTab === tab.id
                  ? "brand-gradient font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)]"
                  : "border border-white/10 bg-white/[0.03] text-[color:var(--muted)] backdrop-blur-md hover:border-orange-300/40 hover:bg-white/[0.06] hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "dashboard" && <Dashboard data={data} />}
        {activeTab === "calendar" && <CalendarView events={data.events} />}
        {activeTab === "events" && <EventsManager data={data} setData={setData} />}
        {activeTab === "crm" && <CRMModule data={data} setData={setData} />}
        {activeTab === "finance" && <FinanceModule data={data} setData={setData} />}
        {activeTab === "calculator" && <Calculator data={data} setData={setData} />}
        {activeTab === "variables" && <SettingsModule data={data} setData={setData} />}
        {activeTab === "team" && <TeamManager data={data} setData={setData} />}
        {activeTab === "costs" && <CostsManager data={data} setData={setData} />}
      </div>
    </main>
  );
}

function LoginScreen({ onLogin }: { onLogin: (account: BackofficeAccount) => void }) {
  const [user, setUser] = useState<BackofficeUser>(BackofficeUser.Manager);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const account = backofficeAccounts.find(
      (item) => item.user === user && item.password === password,
    );

    if (!account) {
      setError("Usuario o clave incorrecta.");
      return;
    }

    onLogin(account);
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#050505] px-6 text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.18),transparent_34%),radial-gradient(circle_at_12%_85%,rgba(194,65,12,0.14),transparent_36%),linear-gradient(180deg,#050505_0%,#090909_55%,#050505_100%)]" />
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-lg border border-orange-300/15 bg-white/[0.035] p-6 shadow-[0_0_60px_rgba(245,158,11,0.10)] backdrop-blur-xl"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--accent)]">
          Acceso privado
        </p>
        <h1 className="mt-3 font-impact text-5xl tracking-wide">Backoffice</h1>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
          Panel para administrar contrataciones, calendario, equipo y costos
          operativos.
        </p>

        <label className="mt-8 block">
          <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Usuario
          </span>
          <select
            value={user}
            onChange={(event) => setUser(event.target.value as BackofficeUser)}
            className="h-12 w-full rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm text-foreground outline-none transition-colors focus:border-orange-300/70 focus:bg-white/[0.055]"
          >
            {backofficeAccounts.map((account) => (
              <option key={account.user} value={account.user}>
                {account.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">
            Clave
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm text-foreground outline-none transition-colors placeholder:text-white/30 focus:border-orange-300/70 focus:bg-white/[0.055]"
            placeholder="pipe-manager"
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

        <button
          type="submit"
          className="brand-gradient mt-6 h-12 w-full rounded-md font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
        >
          Entrar
        </button>
        <p className="mt-4 text-xs text-[color:var(--muted)]">
          Usuarios de prueba: manager / admin / booking. Claves:
          pipe-manager, pipe-admin, pipe-booking.
        </p>
      </form>
    </main>
  );
}

function Dashboard({ data }: { data: StoredData }) {
  const metrics = useMemo(() => {
    const activeEvents = data.events.filter((event) => event.status !== "Cancelado");
    const confirmed = data.events.filter((event) => event.status === "Confirmado");
    const revenue = activeEvents.reduce((sum, event) => sum + event.value, 0);
    const profit = activeEvents.reduce((sum, event) => sum + eventProfit(event), 0);
    const nextEvent = [...activeEvents].sort((a, b) => a.date.localeCompare(b.date))[0];

    return { activeEvents, confirmed, revenue, profit, nextEvent };
  }, [data.events]);

  return (
    <section className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-4">
        <Kpi label="Pipeline" value={currency.format(metrics.revenue)} />
        <Kpi label="Utilidad estimada" value={currency.format(metrics.profit)} />
        <Kpi label="Eventos activos" value={String(metrics.activeEvents.length)} />
        <Kpi label="Confirmados" value={String(metrics.confirmed.length)} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Próximas contrataciones">
          <EventTable events={metrics.activeEvents.slice(0, 6)} compact />
        </Panel>
        <Panel title="Siguiente fecha">
          {metrics.nextEvent ? (
            <div className="rounded-md border border-white/10 bg-white/[0.03] p-5">
              <p className="font-impact text-4xl tracking-wide">{metrics.nextEvent.date}</p>
              <p className="mt-3 text-xl">{metrics.nextEvent.client}</p>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                {metrics.nextEvent.city} · {metrics.nextEvent.type}
              </p>
              <p className="mt-5 text-2xl font-semibold">
                {currency.format(metrics.nextEvent.value)}
              </p>
            </div>
          ) : (
            <EmptyState text="No hay eventos pendientes." />
          )}
        </Panel>
      </div>
    </section>
  );
}

function CalendarView({ events }: { events: ManagedEvent[] }) {
  const grouped = events.reduce<Record<string, ManagedEvent[]>>((acc, event) => {
    const month = event.date.slice(0, 7) || "Sin fecha";
    acc[month] = [...(acc[month] || []), event];
    return acc;
  }, {});

  return (
    <Panel title="Calendario de eventos">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(grouped).map(([month, items]) => (
          <article key={month} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h2 className="font-impact text-3xl tracking-wide">{month}</h2>
            <div className="mt-4 space-y-3">
              {items
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((event) => (
                  <div key={event.id} className="rounded-md border border-white/10 bg-white/[0.025] p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{event.date}</p>
                      <StatusBadge status={event.status} />
                    </div>
                    <p className="mt-2 text-sm">{event.client}</p>
                    <p className="text-xs text-[color:var(--muted)]">
                      {event.city} · {currency.format(event.value)}
                    </p>
                  </div>
                ))}
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function EventsManager({
  data,
  setData,
}: {
  data: StoredData;
  setData: (updater: (current: StoredData) => StoredData) => void;
}) {
  const [draft, setDraft] = useState<Omit<ManagedEvent, "id">>(() =>
    draftForType(eventTypes[0]),
  );
  const [priceMode, setPriceMode] = useState<"recommended" | "manual">("recommended");
  const preset = eventPricingPresets[draft.type] ?? eventPricingPresets[eventTypes[0]];
  const quote = quoteFor({
    operationCosts: draft.operationCosts,
    singerPay: draft.singerPay ?? 0,
    musiciansPay: draft.musiciansPay,
    managerPct: draft.managerPct,
    reinvestPct: draft.reinvestPct,
    contingencyPct: draft.contingencyPct ?? 0.03,
    targetProfitPct: preset.targetProfitPct,
    value: draft.value,
  });

  function applyType(type: string) {
    setDraft((current) => ({
      ...draftForType(type),
      date: current.date,
      client: current.client,
      city: current.city,
      status: current.status,
    }));
    setPriceMode("recommended");
  }

  function updateDraft(next: Omit<ManagedEvent, "id">, keepRecommended = priceMode === "recommended") {
    if (!keepRecommended) {
      setDraft(next);
      return;
    }

    const nextPreset = eventPricingPresets[next.type] ?? eventPricingPresets[eventTypes[0]];
    const recommendedValue = quoteFor({
      operationCosts: next.operationCosts,
      singerPay: next.singerPay ?? 0,
      musiciansPay: next.musiciansPay,
      managerPct: next.managerPct,
      reinvestPct: next.reinvestPct,
      contingencyPct: next.contingencyPct ?? 0.03,
      targetProfitPct: nextPreset.targetProfitPct,
      value: next.value,
    }).recommendedValue;

    setDraft({ ...next, value: recommendedValue });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setData((current) => ({
      ...current,
      events: [{ ...draft, id: createId("evt") }, ...current.events],
    }));
    setDraft((current) => ({ ...draftForType(current.type), client: "", city: "", date: "" }));
    setPriceMode("recommended");
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(520px,0.95fr)_minmax(0,1.25fr)]">
      <Panel title="Nueva contratación">
        <form onSubmit={submit} className="grid gap-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-orange-100/60">
              Datos del evento
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Fecha" type="date" value={draft.date} onChange={(value) => setDraft({ ...draft, date: value })} />
              <Field label="Cliente" value={draft.client} onChange={(value) => setDraft({ ...draft, client: value })} />
              <Field label="Ciudad" value={draft.city} onChange={(value) => setDraft({ ...draft, city: value })} />
              <SelectField label="Tipo" value={draft.type} options={eventTypes} onChange={applyType} />
              <SelectField label="Estado" value={draft.status} options={statuses} onChange={(value) => setDraft({ ...draft, status: value as EventStatus })} />
              <CurrencyField label="Valor cobrado" value={draft.value} onChange={(value) => {
                setPriceMode("manual");
                setDraft({ ...draft, value });
              }} />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-orange-100/60">
              Costos base
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <CurrencyField label="Costos operación" value={draft.operationCosts} onChange={(value) => updateDraft({ ...draft, operationCosts: value })} />
              <CurrencyField label="Pago cantante" value={draft.singerPay ?? 0} onChange={(value) => updateDraft({ ...draft, singerPay: value })} />
              <CurrencyField label="Pago músicos" value={draft.musiciansPay} onChange={(value) => updateDraft({ ...draft, musiciansPay: value })} />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-orange-100/60">
              Porcentajes
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="% Manager" type="number" value={String(draft.managerPct * 100)} onChange={(value) => updateDraft({ ...draft, managerPct: Number(value) / 100 })} />
              <Field label="% Reinversión" type="number" value={String(draft.reinvestPct * 100)} onChange={(value) => updateDraft({ ...draft, reinvestPct: Number(value) / 100 })} />
              <Field label="% Imprevistos" type="number" value={String((draft.contingencyPct ?? 0.03) * 100)} onChange={(value) => updateDraft({ ...draft, contingencyPct: Number(value) / 100 })} />
            </div>
          </div>
          <QuoteSummary
            mode={priceMode}
            quote={quote}
            targetProfitPct={preset.targetProfitPct}
            notes={preset.notes}
            onUseRecommended={() => {
              setPriceMode("recommended");
              setDraft({ ...draft, value: quote.recommendedValue });
            }}
          />
          <label>
            <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">Notas</span>
            <textarea
              value={draft.notes}
              onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
              className="min-h-24 w-full rounded-md border border-white/10 bg-white/[0.035] p-3 text-sm text-foreground outline-none transition-colors focus:border-orange-300/70 focus:bg-white/[0.055]"
            />
          </label>
          <button type="submit" className="brand-gradient h-11 rounded-md font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]">
            Agregar evento
          </button>
        </form>
      </Panel>
      <Panel title="Control de eventos reales">
        <EventTable events={data.events} />
      </Panel>
    </section>
  );
}

function QuoteSummary({
  mode,
  quote,
  targetProfitPct,
  notes,
  onUseRecommended,
}: {
  mode: "recommended" | "manual";
  quote: ReturnType<typeof quoteFor>;
  targetProfitPct: number;
  notes: string;
  onUseRecommended: () => void;
}) {
  const rows = [
    { label: "Operación", value: quote.operationPct, tone: "neutral" },
    { label: "Cantante", value: quote.singerPct, tone: "neutral" },
    { label: "Músicos", value: quote.musiciansPct, tone: "neutral" },
    { label: "Manager", value: quote.managerPct, tone: "neutral" },
    { label: "Reinversión", value: quote.reinvestPct, tone: "neutral" },
    { label: "Imprevistos", value: quote.contingencyPct, tone: "warn" },
    { label: "Utilidad", value: quote.profitPct, tone: quote.profitPct >= 0 ? "good" : "bad" },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-orange-300/15 bg-[#0d0d0d]/90 shadow-[0_0_40px_rgba(245,158,11,0.08)] backdrop-blur-md">
      <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(251,191,36,0.08),rgba(234,88,12,0.05))] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.12em] text-orange-100/60">
              Cotización sugerida
            </p>
            <p className="mt-2 break-words font-impact text-4xl tracking-wide brand-text-gradient sm:text-5xl">
              {currency.format(quote.recommendedValue)}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[color:var(--muted)]">
              Mínimo sano: <span className="text-foreground/80">{currency.format(quote.minimumValue)}</span> · Margen objetivo:{" "}
              <span className="text-foreground/80">{Math.round(targetProfitPct * 100)}%</span>
            </p>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-[color:var(--muted)]">
              {notes}
            </p>
          </div>
          <button
            type="button"
            onClick={onUseRecommended}
            className="h-10 shrink-0 self-start rounded-full border border-white/10 bg-white/[0.06] px-4 text-xs font-semibold text-foreground/80 transition-colors hover:border-orange-300/40 hover:bg-white/[0.09] hover:text-white"
          >
            {mode === "recommended" ? "Auto activo" : "Usar sugerido"}
          </button>
        </div>
      </div>

      <div className="grid gap-2 p-4 sm:grid-cols-2">
        {rows.map((row) => (
          <QuotePercentRow key={row.label} label={row.label} value={row.value} tone={row.tone} />
        ))}
      </div>

      <div className="border-t border-white/10 bg-white/[0.02] p-4">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <QuoteLine label="Costos directos" value={currency.format(quote.directCosts)} />
          <QuoteLine label="Cantante" value={currency.format(quote.singerPay)} />
          <QuoteLine label="Manager" value={currency.format(quote.manager)} />
          <QuoteLine label="Reinversión" value={currency.format(quote.reinvest)} />
          <QuoteLine label="Imprevistos" value={currency.format(quote.contingency)} />
          <QuoteLine
            label="Utilidad"
            value={currency.format(quote.profit)}
            valueClassName={quote.profit >= 0 ? "text-emerald-300" : "text-red-300"}
          />
        </div>
      </div>
    </div>
  );
}

function QuotePercentRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  const pct = Math.round(value * 100);
  const width = `${Math.max(0, Math.min(100, Math.abs(pct)))}%`;
  const valueClassName =
    tone === "good"
      ? "text-emerald-300"
      : tone === "bad"
        ? "text-red-300"
        : tone === "warn"
          ? "text-orange-200"
          : "text-white";

  return (
    <div className="min-w-0 rounded-md border border-white/10 bg-[#050505]/80 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 truncate text-xs font-medium text-[color:var(--muted)]">{label}</span>
        <span className={`shrink-0 text-sm font-semibold ${valueClassName}`}>{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={tone === "bad" ? "h-full rounded-full bg-red-300" : "brand-gradient h-full rounded-full"}
          style={{ width }}
        />
      </div>
    </div>
  );
}

function QuoteLine({
  label,
  value,
  valueClassName = "text-foreground",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-white/10 bg-[#050505]/60 px-3 py-2">
      <span className="min-w-0 truncate text-[color:var(--muted)]">{label}</span>
      <span className={`shrink-0 whitespace-nowrap font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}

function SettingsModule({
  data,
  setData,
}: {
  data: StoredData;
  setData: (updater: (current: StoredData) => StoredData) => void;
}) {
  const settings = data.settings ?? defaultSettings;

  function update(patch: Partial<FinanceSettings>) {
    setData((current) => ({
      ...current,
      settings: { ...defaultSettings, ...current.settings, ...patch },
    }));
  }

  function reset() {
    setData((current) => ({ ...current, settings: defaultSettings }));
  }

  const musiciansBase = musiciansBaseFromSettings(settings);
  const localCost = operationCostFromSettings(settings, "local") + musiciansBase + settings.singerPay;
  const foraneoCost = operationCostFromSettings(settings, "foraneo") + musiciansBase + settings.singerPay;

  return (
    <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <Panel
        title="Variables y estándares"
        action={
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-white/15 px-3 py-1 text-xs hover:border-orange-300/40"
          >
            Restaurar
          </button>
        }
      >
        <p className="mb-5 text-sm text-[color:var(--muted)]">
          Estos valores alimentan la calculadora. Ajústalos a tu realidad y se usan al
          {" "}
          <span className="text-foreground">Cargar desde variables</span>. Ver la estrategia en
          {" "}
          <code className="text-orange-200">docs/estrategia-precios-vallenato.md</code>.
        </p>

        <h3 className="mb-3 text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">
          Nómina del show
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <CurrencyField label="Pago por músico" value={settings.musicianPay} onChange={(value) => update({ musicianPay: value })} />
          <Field label="N.º de músicos" type="number" value={String(settings.musiciansCount)} onChange={(value) => update({ musiciansCount: Number(value) })} />
          <CurrencyField label="Pago cantante (Pipe)" value={settings.singerPay} onChange={(value) => update({ singerPay: value })} />
          <Field label="Personas que viajan" type="number" value={String(settings.teamSize)} onChange={(value) => update({ teamSize: Number(value) })} />
        </div>

        <h3 className="mb-3 mt-6 text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">
          Logística y viáticos
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <CurrencyField label="Transporte local" value={settings.transportLocal} onChange={(value) => update({ transportLocal: value })} />
          <CurrencyField label="Transporte foráneo" value={settings.transportOutOfTown} onChange={(value) => update({ transportOutOfTown: value })} />
          <CurrencyField label="Hospedaje por persona" value={settings.lodgingPerPerson} onChange={(value) => update({ lodgingPerPerson: value })} />
          <CurrencyField label="Viáticos comida por persona" value={settings.mealsPerPerson} onChange={(value) => update({ mealsPerPerson: value })} />
        </div>

        <h3 className="mb-3 mt-6 text-xs uppercase tracking-[0.12em] text-[color:var(--muted)]">
          Porcentajes
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="% Manager" type="number" value={String(Math.round(settings.managerPct * 100))} onChange={(value) => update({ managerPct: Number(value) / 100 })} />
          <Field label="% Reinversión" type="number" value={String(Math.round(settings.reinvestPct * 100))} onChange={(value) => update({ reinvestPct: Number(value) / 100 })} />
          <Field label="% Imprevistos" type="number" value={String(Math.round(settings.contingencyPct * 100))} onChange={(value) => update({ contingencyPct: Number(value) / 100 })} />
          <Field label="% Utilidad deseada" type="number" value={String(Math.round(settings.targetProfitPct * 100))} onChange={(value) => update({ targetProfitPct: Number(value) / 100 })} />
        </div>
      </Panel>

      <Panel title="Costo directo estimado">
        <p className="mb-5 text-sm text-[color:var(--muted)]">
          Lo que cuesta mover el grupo antes de manager, reinversión y utilidad.
        </p>
        <div className="grid gap-3">
          <Kpi label="Músicos (base)" value={currency.format(musiciansBase)} hint={`${settings.musiciansCount} × ${currency.format(settings.musicianPay)}`} />
          <Kpi label="Costo directo — Local" value={currency.format(localCost)} hint="Músicos + cantante + transporte local + viáticos" tone="warn" />
          <Kpi label="Costo directo — Foráneo" value={currency.format(foraneoCost)} hint="Suma transporte mayor + hospedaje del equipo" tone="bad" />
        </div>
        <p className="mt-5 text-xs text-[color:var(--muted)]">
          Regla: nunca cobrar por debajo del costo directo + 25% de utilidad mínima.
        </p>
      </Panel>
    </section>
  );
}

const statusStyles: Record<
  string,
  { ring: string; chip: string; text: string }
> = {
  "no-rentable": {
    ring: "border-red-400/40 bg-red-500/10",
    chip: "border-red-400/40 text-red-300",
    text: "text-red-300",
  },
  minimo: {
    ring: "border-amber-300/40 bg-amber-400/10",
    chip: "border-amber-300/40 text-amber-200",
    text: "text-amber-200",
  },
  saludable: {
    ring: "border-emerald-400/40 bg-emerald-500/10",
    chip: "border-emerald-400/40 text-emerald-300",
    text: "text-emerald-300",
  },
  premium: {
    ring: "border-yellow-300/50 bg-yellow-400/10",
    chip: "border-yellow-300/50 text-yellow-200",
    text: "text-yellow-200",
  },
};

function Calculator({
  data,
  setData,
}: {
  data: StoredData;
  setData: (updater: (current: StoredData) => StoredData) => void;
}) {
  const settings = data.settings ?? defaultSettings;

  const [formatKey, setFormatKey] = useState<ShowFormatKey>("medio");
  const [eventType, setEventType] = useState(eventTypeKeys[0]);
  const [scope, setScope] = useState<ShowScope>("local");
  const [targetPct, setTargetPct] = useState(
    Math.round(eventTypeProfiles[eventTypeKeys[0]].targetProfitPct * 100),
  );
  const [managerPct, setManagerPct] = useState(Math.round(settings.managerPct * 100));
  const [reinvestPct, setReinvestPct] = useState(Math.round(settings.reinvestPct * 100));
  const [contingencyPct, setContingencyPct] = useState(Math.round(settings.contingencyPct * 100));
  const [price, setPrice] = useState(0);
  const [priceMode, setPriceMode] = useState<"recommended" | "manual">("recommended");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [roster, setRoster] = useState<RosterEntry[]>(() => buildRoster(data.team));
  const [savedToast, setSavedToast] = useState(false);

  const premiumApplies = formatKey === "premium" || formatKey === "festival";
  const payrollContext = useMemo(
    () => ({ eventType, scope, premiumApplies }),
    [eventType, scope, premiumApplies],
  );
  const musiciansPay = useMemo(
    () => rosterTotal(roster, payrollContext),
    [roster, payrollContext],
  );

  const result = useMemo(
    () =>
      computePricing({
        formatKey,
        eventType,
        scope,
        settings,
        targetProfitPct: targetPct / 100,
        managerPct: managerPct / 100,
        reinvestPct: reinvestPct / 100,
        contingencyPct: contingencyPct / 100,
        musiciansPayOverride: musiciansPay,
      }),
    [formatKey, eventType, scope, settings, targetPct, managerPct, reinvestPct, contingencyPct, musiciansPay],
  );

  function saveQuote() {
    const includedRoster = roster.filter((entry) => entry.included);
    const payroll = includedRoster.map((entry) => {
      const total = rosterTotal([entry], payrollContext);
      return {
        memberId: entry.id,
        name: entry.name,
        instrument: entry.instrument,
        base: entry.base,
        multiplier: entry.base > 0 ? Number((total - entry.bonus) / entry.base) : 1,
        override: entry.overrideEnabled,
        bonus: entry.bonus,
        final: total,
        note: entry.note,
      };
    });
    const record = {
      id: createId("quote"),
      createdAt: new Date().toISOString().slice(0, 10),
      label: `${result.format.label} · ${eventType}`,
      formatKey,
      eventType,
      scope,
      payroll,
      musiciansPay,
      singerPay: result.breakdown.singer,
      operationCosts:
        result.breakdown.transport +
        result.breakdown.logistics +
        result.breakdown.meals +
        result.breakdown.lodging,
      directCosts: result.directCosts,
      suggestedHealthy: result.healthy,
      finalPrice: price,
    };
    setData((current) => ({ ...current, quotes: [record, ...(current.quotes ?? [])] }));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1800);
  }

  // En modo "recomendado" el precio sigue al precio saludable del cotizador.
  useEffect(() => {
    if (priceMode === "recommended" && price !== result.healthy) {
      setPrice(result.healthy);
    }
  }, [result.healthy, priceMode, price]);

  function changeEventType(next: string) {
    setEventType(next);
    const profile = eventTypeProfiles[next] ?? eventTypeProfiles[eventTypeKeys[0]];
    setTargetPct(Math.round(profile.targetProfitPct * 100));
  }

  const status = financialStatus(price, result);
  const profitAtPrice = price - result.directCosts - price * result.fixedPct;
  const profitPctAtPrice = price > 0 ? profitAtPrice / price : 0;

  const tiers = [
    { key: "no-rentable", emoji: "🔴", label: "No rentable", desc: "No aceptar", value: `Menos de ${currency.format(result.minimum)}` },
    { key: "minimo", emoji: "🟡", label: "Piso mínimo", desc: "Lo más bajo aceptable", value: currency.format(result.minimum) },
    { key: "saludable", emoji: "🟢", label: "Saludable", desc: "Precio recomendado", value: currency.format(result.healthy) },
    { key: "premium", emoji: "👑", label: "Premium", desc: "Posicionamiento alto", value: `${currency.format(result.premium)}+` },
  ];

  const breakdown = [
    { label: `Músicos (${roster.filter((entry) => entry.included).length})`, value: result.breakdown.musicians },
    { label: "Cantante", value: result.breakdown.singer },
    { label: "Transporte", value: result.breakdown.transport },
    { label: "Logística / producción", value: result.breakdown.logistics },
    { label: "Viáticos", value: result.breakdown.meals },
    { label: "Hospedaje", value: result.breakdown.lodging },
  ];

  return (
    <section className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
      <Panel title="Cotizador profesional">
        {/* Paso 1: Formato del show */}
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
          1 · Formato del show
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {showFormatKeys.map((key) => {
            const format = showFormats[key];
            const active = key === formatKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFormatKey(key)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  active
                    ? "border-orange-300/60 bg-orange-400/10"
                    : "border-white/10 bg-white/[0.02] hover:border-orange-300/30 hover:bg-white/[0.05]"
                }`}
              >
                <p className="font-semibold text-foreground">{format.label}</p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  {format.musiciansCount + 1} en tarima · {format.teamSize} viajan · {format.productionLevel}
                </p>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-[color:var(--muted)]">{result.format.description}</p>

        {/* Paso 2 y 3: Tipo de evento y cobertura */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              2 · Tipo de evento
            </p>
            <SelectField label="" value={eventType} options={eventTypeKeys} onChange={changeEventType} />
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              3 · Cobertura
            </p>
            <SelectField
              label=""
              value={scope}
              options={scopeKeys.map((key) => ({ value: key, label: scopeProfiles[key].label }))}
              onChange={(next) => setScope(next as ShowScope)}
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-[color:var(--muted)]">
          {result.eventProfile.perception} · {result.scopeProfile.note}
        </p>

        {/* Nómina dinámica */}
        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.015] p-3">
          <PayrollPanel roster={roster} setRoster={setRoster} context={payrollContext} />
        </div>

        {/* Paso 4: precio negociado */}
        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <CurrencyField
                label="4 · Precio a negociar"
                value={price}
                onChange={(next) => {
                  setPriceMode("manual");
                  setPrice(next);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => setPriceMode("recommended")}
              className={`h-11 shrink-0 rounded-md border px-3 text-xs font-medium transition-colors ${
                priceMode === "recommended"
                  ? "border-emerald-400/40 text-emerald-300"
                  : "border-orange-300/40 text-foreground hover:bg-white/[0.06]"
              }`}
            >
              Usar recomendado
            </button>
          </div>
          <p className="mt-2 text-xs text-[color:var(--muted)]">
            Recomendado (saludable): {currency.format(result.healthy)}. Negocia hacia arriba, nunca por debajo del piso.
          </p>
        </div>

        {/* Ajustes finos de rentabilidad */}
        <button
          type="button"
          onClick={() => setShowAdvanced((current) => !current)}
          className="mt-4 text-xs text-[color:var(--muted)] underline-offset-4 hover:text-foreground hover:underline"
        >
          {showAdvanced ? "Ocultar" : "Ajustar"} rentabilidad y porcentajes
        </button>
        {showAdvanced && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="% Utilidad deseada" type="number" value={String(targetPct)} onChange={(next) => setTargetPct(Number(next))} />
            <Field label="% Manager" type="number" value={String(managerPct)} onChange={(next) => setManagerPct(Number(next))} />
            <Field label="% Reinversión" type="number" value={String(reinvestPct)} onChange={(next) => setReinvestPct(Number(next))} />
            <Field label="% Imprevistos" type="number" value={String(contingencyPct)} onChange={(next) => setContingencyPct(Number(next))} />
          </div>
        )}
      </Panel>

      <div className="grid gap-5">
        {/* Semáforo financiero */}
        <Panel title="Semáforo financiero">
          <div className={`rounded-lg border p-5 ${statusStyles[status.key].ring}`}>
            <div className="flex items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${statusStyles[status.key].chip}`}>
                <span className="text-lg">{status.emoji}</span> {status.label}
              </span>
              <span className="text-xs text-[color:var(--muted)]">
                {result.format.label} · {result.scopeProfile.label}
              </span>
            </div>
            <p className={`mt-4 font-impact text-5xl tracking-wide ${statusStyles[status.key].text}`}>
              {currency.format(price)}
            </p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Utilidad a este precio:{" "}
              <span className={profitAtPrice >= 0 ? "text-emerald-300" : "text-red-300"}>
                {currency.format(profitAtPrice)} ({Math.round(profitPctAtPrice * 100)}%)
              </span>
            </p>
          </div>

          <div className="mt-4 space-y-2">
            {tiers.map((tier) => {
              const active = tier.key === status.key;
              return (
                <div
                  key={tier.key}
                  className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? statusStyles[tier.key].ring
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{tier.emoji}</span>
                    <span className={active ? "font-semibold" : ""}>{tier.label}</span>
                    <span className="text-xs text-[color:var(--muted)]">· {tier.desc}</span>
                  </span>
                  <span className={active ? `font-semibold ${statusStyles[tier.key].text}` : "text-[color:var(--muted)]"}>
                    {tier.value}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-[color:var(--muted)]">
            Punto de equilibrio (0 utilidad): {currency.format(result.breakEven)}
          </p>
        </Panel>

        {/* Desglose de costo directo */}
        <Panel title="Costo directo del show">
          <div className="space-y-1.5 text-sm">
            {breakdown.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 border-b border-white/5 py-1.5">
                <span className="text-[color:var(--muted)]">{row.label}</span>
                <span>{currency.format(row.value)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="font-semibold">Costo directo total</span>
              <span className="font-impact text-2xl tracking-wide text-orange-200">
                {currency.format(result.directCosts)}
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-[color:var(--muted)]">
            Manager {Math.round(result.managerPct * 100)}% · Reinversión {Math.round(result.reinvestPct * 100)}% · Imprevistos {Math.round(result.contingencyPct * 100)}% · Utilidad objetivo {Math.round(result.targetProfitPct * 100)}%. Ajusta los estándares en Variables.
          </p>
          <button
            type="button"
            onClick={saveQuote}
            className="brand-gradient mt-4 h-11 w-full rounded-md font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:opacity-90"
          >
            {savedToast ? "✓ Cotización guardada" : "Guardar cotización en historial"}
          </button>
        </Panel>

        <QuoteHistory data={data} setData={setData} />
      </div>
    </section>
  );
}

function QuoteHistory({
  data,
  setData,
}: {
  data: StoredData;
  setData: (updater: (current: StoredData) => StoredData) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const quotes = data.quotes ?? [];

  function remove(id: string) {
    setData((current) => ({ ...current, quotes: (current.quotes ?? []).filter((q) => q.id !== id) }));
  }

  if (quotes.length === 0) {
    return (
      <Panel title="Historial de cotizaciones">
        <EmptyState text="Aún no guardas cotizaciones. Cada una registra nómina, multiplicadores y totales para analizar costos reales." />
      </Panel>
    );
  }

  return (
    <Panel title="Historial de cotizaciones">
      <div className="space-y-2">
        {quotes.map((quote) => {
          const open = openId === quote.id;
          return (
            <article key={quote.id} className="rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="flex items-center justify-between gap-3 p-3">
                <button type="button" onClick={() => setOpenId(open ? null : quote.id)} className="flex-1 text-left">
                  <p className="text-sm font-semibold">{quote.label}</p>
                  <p className="text-xs text-[color:var(--muted)]">
                    {quote.createdAt} · {quote.scope} · nómina {currency.format(quote.musiciansPay)} · precio {currency.format(quote.finalPrice)}
                  </p>
                </button>
                <button type="button" onClick={() => remove(quote.id)} className="text-[color:var(--muted)] hover:text-red-300" aria-label="Eliminar">
                  ✕
                </button>
              </div>
              {open && (
                <div className="border-t border-white/5 px-3 pb-3 pt-2">
                  <div className="space-y-1 text-xs">
                    {quote.payroll.map((line) => (
                      <div key={line.memberId} className="flex items-center justify-between gap-2">
                        <span className="text-[color:var(--muted)]">
                          {line.name} · {line.instrument}
                          {line.override ? " (manual)" : ` ×${line.multiplier.toFixed(2)}`}
                          {line.bonus ? ` +bono ${currency.format(line.bonus)}` : ""}
                        </span>
                        <span>{currency.format(line.final)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 border-t border-white/5 pt-2 text-xs">
                    <span className="text-[color:var(--muted)]">Nómina músicos: <span className="text-foreground">{currency.format(quote.musiciansPay)}</span></span>
                    <span className="text-[color:var(--muted)]">Cantante: <span className="text-foreground">{currency.format(quote.singerPay)}</span></span>
                    <span className="text-[color:var(--muted)]">Costo directo: <span className="text-foreground">{currency.format(quote.directCosts)}</span></span>
                    <span className="text-[color:var(--muted)]">Precio final: <span className="text-foreground">{currency.format(quote.finalPrice)}</span></span>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </Panel>
  );
}

function TeamManager({
  data,
  setData,
}: {
  data: StoredData;
  setData: (updater: (current: StoredData) => StoredData) => void;
}) {
  const [draft, setDraft] = useState<Omit<TeamMember, "id">>({
    name: "",
    role: "",
    basePay: 0,
    phone: "",
    status: "Activo",
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setData((current) => ({
      ...current,
      team: [...current.team, { ...draft, id: createId("team") }],
    }));
    setDraft({ name: "", role: "", basePay: 0, phone: "", status: "Activo" });
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Panel title="Agregar integrante">
        <form onSubmit={submit} className="grid gap-3">
          <Field label="Nombre" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
          <Field label="Rol / instrumento" value={draft.role} onChange={(value) => setDraft({ ...draft, role: value })} />
          <CurrencyField label="Pago base" value={draft.basePay} onChange={(value) => setDraft({ ...draft, basePay: value })} />
          <Field label="Teléfono" value={draft.phone} onChange={(value) => setDraft({ ...draft, phone: value })} />
          <SelectField label="Estado" value={draft.status} options={["Activo", "Backup", "Inactivo"]} onChange={(value) => setDraft({ ...draft, status: value as TeamMember["status"] })} />
          <button type="submit" className="brand-gradient h-11 rounded-md font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]">
            Agregar al equipo
          </button>
        </form>
      </Panel>
      <Panel title="Equipo de trabajo">
        <div className="grid gap-3 md:grid-cols-2">
          {data.team.map((member) => (
            <article key={member.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-[color:var(--muted)]">{member.role}</p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs">{member.status}</span>
              </div>
              <p className="mt-4 text-lg font-semibold">{currency.format(member.basePay)}</p>
              <p className="text-sm text-[color:var(--muted)]">{member.phone || "Sin teléfono"}</p>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function CostsManager({
  data,
  setData,
}: {
  data: StoredData;
  setData: (updater: (current: StoredData) => StoredData) => void;
}) {
  const [draft, setDraft] = useState<Omit<OperatingCost, "id">>({
    category: "",
    amount: 0,
    frequency: "Por evento",
    owner: "",
    notes: "",
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setData((current) => ({
      ...current,
      costs: [...current.costs, { ...draft, id: createId("cost") }],
    }));
    setDraft({ category: "", amount: 0, frequency: "Por evento", owner: "", notes: "" });
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Panel title="Agregar costo">
        <form onSubmit={submit} className="grid gap-3">
          <Field label="Categoría" value={draft.category} onChange={(value) => setDraft({ ...draft, category: value })} />
          <CurrencyField label="Valor" value={draft.amount} onChange={(value) => setDraft({ ...draft, amount: value })} />
          <SelectField label="Frecuencia" value={draft.frequency} options={["Por evento", "Mensual", "Ocasional"]} onChange={(value) => setDraft({ ...draft, frequency: value as OperatingCost["frequency"] })} />
          <Field label="Responsable" value={draft.owner} onChange={(value) => setDraft({ ...draft, owner: value })} />
          <Field label="Notas" value={draft.notes} onChange={(value) => setDraft({ ...draft, notes: value })} />
          <button type="submit" className="brand-gradient h-11 rounded-md font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]">
            Agregar costo
          </button>
        </form>
      </Panel>
      <Panel title="Costos operativos">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-orange-100/60">
              <tr className="border-b border-white/10 bg-white/[0.025]">
                <th className="py-3">Categoría</th>
                <th>Valor</th>
                <th>Frecuencia</th>
                <th>Responsable</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {data.costs.map((cost) => (
                <tr key={cost.id} className="border-b border-white/10 transition-colors hover:bg-white/[0.025]">
                  <td className="py-3">{cost.category}</td>
                  <td>{currency.format(cost.amount)}</td>
                  <td>{cost.frequency}</td>
                  <td>{cost.owner}</td>
                  <td className="text-[color:var(--muted)]">{cost.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  );
}

function EventTable({ events, compact = false }: { events: ManagedEvent[]; compact?: boolean }) {
  if (!events.length) return <EmptyState text="Todavía no hay eventos registrados." />;

  return (
    <>
      <div className={`grid gap-2 ${compact ? "2xl:hidden" : ""}`}>
        {events.map((event) => {
          const profit = eventProfit(event);

          return (
            <article key={event.id} className="rounded-lg border border-white/10 bg-[#050505]/65 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{event.client || "Sin cliente"}</p>
                  <p className="mt-1 text-xs text-[color:var(--muted)]">
                    {event.date || "Sin fecha"} · {event.city || "Sin ciudad"}
                    {!compact && ` · ${event.type}`}
                  </p>
                </div>
                <StatusBadge status={event.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted)]">Valor</p>
                  <p className="mt-1 whitespace-nowrap font-semibold">{currency.format(event.value)}</p>
                </div>
                <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted)]">Utilidad</p>
                  <p className={`mt-1 whitespace-nowrap font-semibold ${profit >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                    {currency.format(profit)}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {compact && (
        <div className="hidden overflow-hidden rounded-lg border border-white/10 2xl:block">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
            <thead className="bg-white/[0.025] text-xs uppercase tracking-[0.12em] text-orange-100/60">
              <tr className="border-b border-white/10 bg-white/[0.025]">
                <th className="px-3 py-3">Fecha</th>
                <th className="px-3">Cliente</th>
                <th className="px-3">Ciudad</th>
                <th className="px-3">Valor</th>
                <th className="px-3">Utilidad</th>
                <th className="px-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-white/10 transition-colors hover:bg-white/[0.025]">
                  <td className="truncate px-3 py-3">{event.date || "-"}</td>
                  <td className="truncate px-3">{event.client}</td>
                  <td className="truncate px-3">{event.city}</td>
                  <td className="truncate px-3">{currency.format(event.value)}</td>
                  <td className={eventProfit(event) >= 0 ? "truncate px-3 text-emerald-300" : "truncate px-3 text-red-300"}>
                    {currency.format(eventProfit(event))}
                  </td>
                  <td className="px-3">
                    <StatusBadge status={event.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
