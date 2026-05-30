"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BackofficeAccount,
  BackofficeData,
  BackofficeUser,
  EventStatus,
  ManagedEvent,
  OperatingCost,
  TeamMember,
  backofficeAccounts,
  defaultCosts,
  defaultEvents,
  defaultExpenses,
  defaultGoals,
  defaultPayments,
  defaultTeam,
} from "@/data/backoffice";
import { eventProfit } from "./finance";
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

type Tab =
  | "dashboard"
  | "calendar"
  | "events"
  | "finance"
  | "calculator"
  | "team"
  | "costs";
type StoredData = BackofficeData;

const storageKey = "pipe-cumbe-backoffice-v1";
const sessionKey = "pipe-cumbe-backoffice-session";

const tabs: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Resumen" },
  { id: "calendar", label: "Calendario" },
  { id: "events", label: "Contrataciones" },
  { id: "finance", label: "Finanzas" },
  { id: "calculator", label: "Calculadora" },
  { id: "team", label: "Equipo" },
  { id: "costs", label: "Costos" },
];

// Booking sólo gestiona pipeline comercial; Manager y Admin ven todo.
const bookingTabs = new Set<Tab>(["dashboard", "calendar", "events"]);

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
      // versiones anteriores no rompan al faltarles llaves nuevas (finanzas).
      const parsed = JSON.parse(savedData) as Partial<StoredData>;
      setData({ ...getInitialData(), ...parsed });
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
        {activeTab === "finance" && <FinanceModule data={data} setData={setData} />}
        {activeTab === "calculator" && <Calculator data={data} />}
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
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
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
          <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
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
    <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <Panel title="Nueva contratación">
        <form onSubmit={submit} className="grid gap-3">
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
            <CurrencyField label="Costos operación" value={draft.operationCosts} onChange={(value) => updateDraft({ ...draft, operationCosts: value })} />
            <CurrencyField label="Pago cantante" value={draft.singerPay ?? 0} onChange={(value) => updateDraft({ ...draft, singerPay: value })} />
            <CurrencyField label="Pago músicos" value={draft.musiciansPay} onChange={(value) => updateDraft({ ...draft, musiciansPay: value })} />
            <Field label="% Manager" type="number" value={String(draft.managerPct * 100)} onChange={(value) => updateDraft({ ...draft, managerPct: Number(value) / 100 })} />
            <Field label="% Reinversión" type="number" value={String(draft.reinvestPct * 100)} onChange={(value) => updateDraft({ ...draft, reinvestPct: Number(value) / 100 })} />
            <Field label="% Ahorro imprevistos" type="number" value={String((draft.contingencyPct ?? 0.03) * 100)} onChange={(value) => updateDraft({ ...draft, contingencyPct: Number(value) / 100 })} />
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
            <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Notas</span>
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
    { label: "Operación", value: quote.operationPct },
    { label: "Cantante", value: quote.singerPct },
    { label: "Músicos", value: quote.musiciansPct },
    { label: "Manager", value: quote.managerPct },
    { label: "Reinversión", value: quote.reinvestPct },
    { label: "Imprevistos", value: quote.contingencyPct },
    { label: "Utilidad", value: quote.profitPct },
  ];

  return (
    <div className="rounded-lg border border-orange-300/15 bg-white/[0.03] p-4 backdrop-blur-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-orange-100/60">
            Cotización sugerida
          </p>
          <p className="mt-2 font-impact text-4xl tracking-wide brand-text-gradient">
            {currency.format(quote.recommendedValue)}
          </p>
          <p className="mt-1 text-xs text-[color:var(--muted)]">
            Mínimo sano: {currency.format(quote.minimumValue)} · Margen objetivo:{" "}
            {Math.round(targetProfitPct * 100)}%
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted)]">
            {notes}
          </p>
        </div>
        <button
          type="button"
          onClick={onUseRecommended}
          className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:border-orange-300/40 hover:bg-white/[0.06] hover:text-white"
        >
          {mode === "recommended" ? "Auto activo" : "Usar sugerido"}
        </button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
        {rows.map((row) => (
          <div key={row.label} className="rounded-md border border-white/10 bg-[#0d0d0d]/80 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
              {row.label}
            </p>
            <p className={row.value >= 0 ? "mt-1 font-semibold text-white" : "mt-1 font-semibold text-red-300"}>
              {Math.round(row.value * 100)}%
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-md border border-white/10 bg-white/[0.025] p-3 text-sm">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[color:var(--muted)]">
          <span>Costos directos: {currency.format(quote.directCosts)}</span>
          <span>Cantante: {currency.format(quote.singerPay)}</span>
          <span>Manager: {currency.format(quote.manager)}</span>
          <span>Reinversión: {currency.format(quote.reinvest)}</span>
          <span>Imprevistos: {currency.format(quote.contingency)}</span>
          <span className={quote.profit >= 0 ? "text-emerald-300" : "text-red-300"}>
            Utilidad: {currency.format(quote.profit)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Calculator({ data }: { data: StoredData }) {
  const [eventType, setEventType] = useState(eventTypes[0]);
  const initialPreset = eventPricingPresets[eventTypes[0]];
  const initialValue = quoteFor({
    operationCosts: initialPreset.operationCosts,
    singerPay: initialPreset.singerPay,
    musiciansPay: initialPreset.musiciansPay,
    managerPct: 0.1,
    reinvestPct: 0.05,
    contingencyPct: 0.03,
    targetProfitPct: initialPreset.targetProfitPct,
    value: 0,
  }).recommendedValue;
  const [value, setValue] = useState(initialValue);
  const [operationCosts, setOperationCosts] = useState(initialPreset.operationCosts);
  const [singerPay, setSingerPay] = useState(initialPreset.singerPay);
  const [musiciansPay, setMusiciansPay] = useState(initialPreset.musiciansPay);
  const [managerPct, setManagerPct] = useState(10);
  const [reinvestPct, setReinvestPct] = useState(5);
  const [contingencyPct, setContingencyPct] = useState(3);
  const [targetProfitPct, setTargetProfitPct] = useState(initialPreset.targetProfitPct * 100);
  const [priceMode, setPriceMode] = useState<"recommended" | "manual">("recommended");

  const quote = quoteFor({
    operationCosts,
    singerPay,
    musiciansPay,
    managerPct: managerPct / 100,
    reinvestPct: reinvestPct / 100,
    contingencyPct: contingencyPct / 100,
    targetProfitPct: targetProfitPct / 100,
    value,
  });
  const monthlyCosts = data.costs
    .filter((cost) => cost.frequency === "Mensual")
    .reduce((sum, cost) => sum + cost.amount, 0);

  function syncRecommended(next: {
    operationCosts?: number;
    singerPay?: number;
    musiciansPay?: number;
    managerPct?: number;
    reinvestPct?: number;
    contingencyPct?: number;
    targetProfitPct?: number;
  }) {
    const nextOperationCosts = next.operationCosts ?? operationCosts;
    const nextSingerPay = next.singerPay ?? singerPay;
    const nextMusiciansPay = next.musiciansPay ?? musiciansPay;
    const nextManagerPct = next.managerPct ?? managerPct;
    const nextReinvestPct = next.reinvestPct ?? reinvestPct;
    const nextContingencyPct = next.contingencyPct ?? contingencyPct;
    const nextTargetProfitPct = next.targetProfitPct ?? targetProfitPct;
    const recommendedValue = quoteFor({
      operationCosts: nextOperationCosts,
      singerPay: nextSingerPay,
      musiciansPay: nextMusiciansPay,
      managerPct: nextManagerPct / 100,
      reinvestPct: nextReinvestPct / 100,
      contingencyPct: nextContingencyPct / 100,
      targetProfitPct: nextTargetProfitPct / 100,
      value,
    }).recommendedValue;

    if (priceMode === "recommended") setValue(recommendedValue);
  }

  function applyCalculatorType(type: string) {
    const preset = eventPricingPresets[type] ?? eventPricingPresets[eventTypes[0]];
    const nextTargetProfitPct = preset.targetProfitPct * 100;
    const recommendedValue = quoteFor({
      operationCosts: preset.operationCosts,
      singerPay: preset.singerPay,
      musiciansPay: preset.musiciansPay,
      managerPct: managerPct / 100,
      reinvestPct: reinvestPct / 100,
      contingencyPct: contingencyPct / 100,
      targetProfitPct: preset.targetProfitPct,
      value,
    }).recommendedValue;

    setEventType(type);
    setOperationCosts(preset.operationCosts);
    setSingerPay(preset.singerPay);
    setMusiciansPay(preset.musiciansPay);
    setTargetProfitPct(nextTargetProfitPct);
    setValue(recommendedValue);
    setPriceMode("recommended");
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <Panel title="Calculadora profesional">
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField label="Tipo de evento" value={eventType} options={eventTypes} onChange={applyCalculatorType} />
          <CurrencyField label="Valor a cotizar" value={value} onChange={(next) => {
            setPriceMode("manual");
            setValue(next);
          }} />
          <CurrencyField label="Costos operación" value={operationCosts} onChange={(next) => {
            setOperationCosts(next);
            syncRecommended({ operationCosts: next });
          }} />
          <CurrencyField label="Pago cantante" value={singerPay} onChange={(next) => {
            setSingerPay(next);
            syncRecommended({ singerPay: next });
          }} />
          <CurrencyField label="Pago músicos" value={musiciansPay} onChange={(next) => {
            setMusiciansPay(next);
            syncRecommended({ musiciansPay: next });
          }} />
          <Field label="% Manager" type="number" value={String(managerPct)} onChange={(next) => {
            const valueNumber = Number(next);
            setManagerPct(valueNumber);
            syncRecommended({ managerPct: valueNumber });
          }} />
          <Field label="% Reinversión" type="number" value={String(reinvestPct)} onChange={(next) => {
            const valueNumber = Number(next);
            setReinvestPct(valueNumber);
            syncRecommended({ reinvestPct: valueNumber });
          }} />
          <Field label="% Ahorro imprevistos" type="number" value={String(contingencyPct)} onChange={(next) => {
            const valueNumber = Number(next);
            setContingencyPct(valueNumber);
            syncRecommended({ contingencyPct: valueNumber });
          }} />
          <Field label="% Utilidad deseada" type="number" value={String(targetProfitPct)} onChange={(next) => {
            const valueNumber = Number(next);
            setTargetProfitPct(valueNumber);
            syncRecommended({ targetProfitPct: valueNumber });
          }} />
        </div>
        <div className="mt-4">
          <QuoteSummary
            mode={priceMode}
            quote={quote}
            targetProfitPct={targetProfitPct / 100}
            notes={(eventPricingPresets[eventType] ?? eventPricingPresets[eventTypes[0]]).notes}
            onUseRecommended={() => {
              setPriceMode("recommended");
              setValue(quote.recommendedValue);
            }}
          />
        </div>
      </Panel>
      <Panel title="Resumen financiero">
        <div className="grid gap-3 sm:grid-cols-2">
          <Kpi label="Cantante" value={currency.format(singerPay)} hint="Pago estimado separado del grupo" />
          <Kpi label="Manager" value={currency.format(quote.manager)} hint={`${managerPct}% del valor cotizado`} />
          <Kpi label="Reinversión" value={currency.format(quote.reinvest)} hint={`${reinvestPct}% del valor cotizado`} />
          <Kpi label="Ahorro imprevistos" value={currency.format(quote.contingency)} hint={`${contingencyPct}% del evento`} tone="warn" />
          <Kpi label="Precio mínimo" value={currency.format(quote.minimumValue)} hint="Cubre costos + manager + reinversión" />
          <Kpi label="Costos mensuales" value={currency.format(monthlyCosts)} />
          <div className="sm:col-span-2">
            <Kpi
              label={quote.profit >= 0 ? `Utilidad real (${Math.round(quote.profitPct * 100)}%)` : "Subir precio o reducir costos"}
              value={currency.format(quote.profit)}
              tone={quote.profit >= 0 ? "good" : "bad"}
            />
          </div>
        </div>
      </Panel>
    </section>
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
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-separate border-spacing-0 text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.16em] text-orange-100/60">
          <tr className="border-b border-white/10 bg-white/[0.025]">
            <th className="py-3">Fecha</th>
            <th>Cliente</th>
            <th>Ciudad</th>
            {!compact && <th>Tipo</th>}
            <th>Valor</th>
            <th>Utilidad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-white/10 transition-colors hover:bg-white/[0.025]">
              <td className="py-3">{event.date || "-"}</td>
              <td>{event.client}</td>
              <td>{event.city}</td>
              {!compact && <td>{event.type}</td>}
              <td>{currency.format(event.value)}</td>
              <td className={eventProfit(event) >= 0 ? "text-emerald-300" : "text-red-300"}>
                {currency.format(eventProfit(event))}
              </td>
              <td>
                <StatusBadge status={event.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
