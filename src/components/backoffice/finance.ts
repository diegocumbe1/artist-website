import {
  Expense,
  FinanceSettings,
  ManagedEvent,
  MusicianMultipliers,
  Payment,
  TeamMember,
  defaultMultipliers,
} from "@/data/backoffice";

/** Eventos que ya son un compromiso real (se espera cobrarlos). */
export const committedStatuses = new Set(["Separado", "Confirmado", "Realizado"]);

export type ShowScope = "local" | "foraneo" | "gira";

/** Pago total a los músicos según los estándares (sin contar al cantante). */
export function musiciansBaseFromSettings(settings: FinanceSettings) {
  return settings.musicianPay * settings.musiciansCount;
}

/**
 * Costos de operación según los estándares y el alcance del evento.
 * Foráneo y gira suman transporte mayor + hospedaje por persona.
 */
export function operationCostFromSettings(settings: FinanceSettings, scope: ShowScope) {
  const meals = settings.mealsPerPerson * settings.teamSize;
  if (scope === "local") {
    return settings.transportLocal + meals;
  }
  return settings.transportOutOfTown + meals + settings.lodgingPerPerson * settings.teamSize;
}

export function eventSingerPay(event: ManagedEvent) {
  return event.singerPay ?? 0;
}

export function eventMusiciansPay(event: ManagedEvent) {
  return event.musiciansPay ?? 0;
}

export function eventManager(event: ManagedEvent) {
  return event.value * (event.managerPct ?? 0);
}

export function eventReinvest(event: ManagedEvent) {
  return event.value * (event.reinvestPct ?? 0);
}

export function eventContingency(event: ManagedEvent) {
  return event.value * (event.contingencyPct ?? 0.03);
}

export function eventProfit(event: ManagedEvent) {
  return (
    event.value -
    event.operationCosts -
    eventSingerPay(event) -
    eventMusiciansPay(event) -
    eventManager(event) -
    eventReinvest(event) -
    eventContingency(event)
  );
}

export function eventPaid(eventId: string, payments: Payment[]) {
  return payments
    .filter((payment) => payment.eventId === eventId)
    .reduce((sum, payment) => sum + payment.amount, 0);
}

export function eventBalance(event: ManagedEvent, payments: Payment[]) {
  return Math.max(event.value - eventPaid(event.id, payments), 0);
}

export type Range = { start: string; end: string };

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

export function monthRange(ref = new Date()): Range {
  const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
  return { start: iso(start), end: iso(end) };
}

export function weekRange(ref = new Date()): Range {
  const diffToMonday = (ref.getDay() + 6) % 7; // lunes como inicio de semana
  const start = new Date(ref);
  start.setDate(ref.getDate() - diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: iso(start), end: iso(end) };
}

export function inRange(date: string, range: Range) {
  return Boolean(date) && date >= range.start && date <= range.end;
}

export function sumIn<T extends { date: string; amount: number }>(
  items: T[],
  range: Range,
  filter?: (item: T) => boolean,
) {
  return items
    .filter((item) => inRange(item.date, range) && (!filter || filter(item)))
    .reduce((sum, item) => sum + item.amount, 0);
}

/** Total que aún falta por cobrar de todos los eventos comprometidos. */
export function totalReceivable(events: ManagedEvent[], payments: Payment[]) {
  return events
    .filter((event) => committedStatuses.has(event.status))
    .reduce((sum, event) => sum + eventBalance(event, payments), 0);
}

/** Egresos pendientes de pagar (nómina, proveedores, etc.). */
export function totalPayable(expenses: Expense[]) {
  return expenses
    .filter((expense) => expense.status === "Pendiente")
    .reduce((sum, expense) => sum + expense.amount, 0);
}

/* ============================================================================
 * Motor de pricing profesional (management artístico)
 * Flujo: Formato del show → Tipo de evento → Cobertura → Semáforo financiero.
 * Lógica pura y reutilizable (calculadora hoy, lead → contratación a futuro).
 * ==========================================================================*/

export type ShowFormatKey = "parranda" | "medio" | "premium" | "festival";

export type ShowFormatPreset = {
  key: ShowFormatKey;
  label: string;
  description: string;
  productionLevel: string;
  musiciansCount: number; // sin contar al cantante
  teamSize: number; // total de personas que viajan
  baseMusiciansPay: number; // pago por músico en este formato
  singerPay: number;
  transportLocal: number;
  transportForaneo: number;
  logistics: number; // sonido / producción base
};

/** Presets de formato: el formato define la estructura de costos, no el usuario. */
export const showFormats: Record<ShowFormatKey, ShowFormatPreset> = {
  parranda: {
    key: "parranda",
    label: "Parranda / Acústico",
    description: "Formato íntimo y cercano. Reemplaza la 'moña' con dignidad, sin llevar full band.",
    productionLevel: "Básica",
    musiciansCount: 4,
    teamSize: 6,
    baseMusiciansPay: 100000,
    singerPay: 150000,
    transportLocal: 150000,
    transportForaneo: 450000,
    logistics: 50000,
  },
  medio: {
    key: "medio",
    label: "Discoteca / Show medio",
    description: "Formato estándar para discotecas y eventos sociales medianos.",
    productionLevel: "Media",
    musiciansCount: 6,
    teamSize: 8,
    baseMusiciansPay: 110000,
    singerPay: 180000,
    transportLocal: 250000,
    transportForaneo: 600000,
    logistics: 120000,
  },
  premium: {
    key: "premium",
    label: "Show Premium",
    description: "Producción cuidada para matrimonios, corporativos y clientes exigentes.",
    productionLevel: "Alta",
    musiciansCount: 8,
    teamSize: 10,
    baseMusiciansPay: 130000,
    singerPay: 250000,
    transportLocal: 300000,
    transportForaneo: 700000,
    logistics: 250000,
  },
  festival: {
    key: "festival",
    label: "Festival / Full Band",
    description: "Agrupación completa para tarima, ferias y festivales. Máxima producción.",
    productionLevel: "Full / tarima",
    musiciansCount: 9,
    teamSize: 12,
    baseMusiciansPay: 150000,
    singerPay: 300000,
    transportLocal: 400000,
    transportForaneo: 900000,
    logistics: 450000,
  },
};

export const showFormatKeys = Object.keys(showFormats) as ShowFormatKey[];

export type EventTypeProfile = {
  label: string;
  targetProfitPct: number; // utilidad objetivo "saludable" (0-1)
  logisticsFactor: number; // exigencia logística sobre la producción del formato
  perception: string;
};

/**
 * El tipo de evento NO cambia los músicos; cambia margen, exigencia y posicionamiento.
 */
export const eventTypeProfiles: Record<string, EventTypeProfile> = {
  Discoteca: { label: "Discoteca", targetProfitPct: 0.3, logisticsFactor: 1.0, perception: "Vitrina recurrente · margen medio" },
  Matrimonio: { label: "Matrimonio", targetProfitPct: 0.45, logisticsFactor: 1.1, perception: "Alta disposición a pagar · margen alto" },
  "Evento privado": { label: "Evento privado", targetProfitPct: 0.34, logisticsFactor: 1.0, perception: "Paga experiencia · margen medio" },
  Parranda: { label: "Parranda", targetProfitPct: 0.25, logisticsFactor: 0.9, perception: "Cercano y flexible · margen menor" },
  "Feria municipal": { label: "Feria municipal", targetProfitPct: 0.4, logisticsFactor: 1.2, perception: "Masivo · margen premium" },
  Festival: { label: "Festival", targetProfitPct: 0.5, logisticsFactor: 1.3, perception: "Vitrina + marca · margen premium alto" },
  "Evento corporativo": { label: "Evento corporativo", targetProfitPct: 0.48, logisticsFactor: 1.2, perception: "Presupuesto alto, formal · margen premium" },
  "Tarima pública": { label: "Tarima pública", targetProfitPct: 0.45, logisticsFactor: 1.2, perception: "Gran público · constructor de marca" },
  "Evento político": { label: "Evento político", targetProfitPct: 0.55, logisticsFactor: 1.2, perception: "Prima de riesgo · 100% anticipado" },
};

export const eventTypeKeys = Object.keys(eventTypeProfiles);

export type ScopeProfile = {
  label: string;
  lodgingNights: number;
  viaticDays: number;
  foraneo: boolean;
  transportMultiplier: number;
  note: string;
};

export const scopeProfiles: Record<ShowScope, ScopeProfile> = {
  local: { label: "Local (misma ciudad)", lodgingNights: 0, viaticDays: 1, foraneo: false, transportMultiplier: 1, note: "Sin hospedaje." },
  foraneo: { label: "Foráneo (otra ciudad)", lodgingNights: 1, viaticDays: 2, foraneo: true, transportMultiplier: 1, note: "Transporte mayor + 1 noche de hospedaje." },
  gira: { label: "Gira (varias fechas)", lodgingNights: 2, viaticDays: 3, foraneo: true, transportMultiplier: 1.4, note: "Logística extendida + 2 noches de hospedaje." },
};

export const scopeKeys = Object.keys(scopeProfiles) as ShowScope[];

export type PricingStatusKey = "no-rentable" | "minimo" | "saludable" | "premium";

export type PricingStatus = {
  key: PricingStatusKey;
  label: string;
  emoji: string;
  tone: "bad" | "warn" | "good" | "neutral";
};

export type PricingResult = {
  format: ShowFormatPreset;
  eventProfile: EventTypeProfile;
  scopeProfile: ScopeProfile;
  breakdown: {
    musicians: number;
    singer: number;
    transport: number;
    logistics: number;
    meals: number;
    lodging: number;
  };
  directCosts: number;
  fixedPct: number;
  managerPct: number;
  reinvestPct: number;
  contingencyPct: number;
  targetProfitPct: number;
  breakEven: number;
  minimum: number;
  healthy: number;
  premium: number;
};

function roundUp(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

export function computePricing(params: {
  formatKey: ShowFormatKey;
  eventType: string;
  scope: ShowScope;
  settings: FinanceSettings;
  targetProfitPct?: number;
  managerPct?: number;
  reinvestPct?: number;
  contingencyPct?: number;
  musiciansPayOverride?: number; // nómina dinámica calculada por músico
  singerPayOverride?: number;
}): PricingResult {
  const format = showFormats[params.formatKey];
  const eventProfile = eventTypeProfiles[params.eventType] ?? eventTypeProfiles[eventTypeKeys[0]];
  const scopeProfile = scopeProfiles[params.scope];

  const managerPct = params.managerPct ?? params.settings.managerPct;
  const reinvestPct = params.reinvestPct ?? params.settings.reinvestPct;
  const contingencyPct = params.contingencyPct ?? params.settings.contingencyPct;
  const targetProfitPct = params.targetProfitPct ?? eventProfile.targetProfitPct;

  const musicians =
    params.musiciansPayOverride ?? format.musiciansCount * format.baseMusiciansPay;
  const singer = params.singerPayOverride ?? format.singerPay;
  const transport = Math.round(
    (scopeProfile.foraneo ? format.transportForaneo : format.transportLocal) *
      scopeProfile.transportMultiplier,
  );
  const logistics = Math.round(format.logistics * eventProfile.logisticsFactor);
  const meals = params.settings.mealsPerPerson * format.teamSize * scopeProfile.viaticDays;
  const lodging = params.settings.lodgingPerPerson * format.teamSize * scopeProfile.lodgingNights;

  const directCosts = musicians + singer + transport + logistics + meals + lodging;
  const fixedPct = managerPct + reinvestPct + contingencyPct;

  const priceForMargin = (netMargin: number) =>
    roundUp(directCosts / Math.max(0.05, 1 - fixedPct - netMargin), 50000);

  const breakEven = roundUp(directCosts / Math.max(0.05, 1 - fixedPct), 50000);
  const minimum = priceForMargin(0.12);
  const healthy = priceForMargin(targetProfitPct);
  const premium = priceForMargin(Math.min(0.6, targetProfitPct + 0.15));

  return {
    format,
    eventProfile,
    scopeProfile,
    breakdown: { musicians, singer, transport, logistics, meals, lodging },
    directCosts,
    fixedPct,
    managerPct,
    reinvestPct,
    contingencyPct,
    targetProfitPct,
    breakEven,
    minimum,
    healthy,
    premium,
  };
}

/** Semáforo financiero: clasifica un precio cotizado contra los tramos del formato. */
export function financialStatus(price: number, result: PricingResult): PricingStatus {
  if (price >= result.premium)
    return { key: "premium", label: "Premium", emoji: "👑", tone: "good" };
  if (price >= result.healthy)
    return { key: "saludable", label: "Saludable", emoji: "🟢", tone: "good" };
  if (price >= result.minimum)
    return { key: "minimo", label: "Piso mínimo", emoji: "🟡", tone: "warn" };
  return { key: "no-rentable", label: "No rentable", emoji: "🔴", tone: "bad" };
}

/* ============================================================================
 * Nómina dinámica híbrida
 * Cada músico: tarifa base + multiplicadores por tipo de evento y cobertura,
 * con override manual y bono. Los multiplicadores se aplican multiplicativamente.
 * ==========================================================================*/

export function memberMultipliers(member: TeamMember): MusicianMultipliers {
  return { ...defaultMultipliers, ...(member.multipliers ?? {}) };
}

/** Qué multiplicador de evento aplica según el tipo de evento del cotizador. */
export function eventMultiplierKey(eventType: string): keyof MusicianMultipliers | null {
  switch (eventType) {
    case "Discoteca":
      return "nightclub";
    case "Matrimonio":
      return "wedding";
    case "Evento corporativo":
      return "corporate";
    case "Festival":
    case "Feria municipal":
    case "Tarima pública":
    case "Evento político":
      return "festival";
    default:
      return null; // Parranda, Evento privado: usa tarifa base
  }
}

const eventMultiplierLabels: Record<keyof MusicianMultipliers, string> = {
  local: "Local",
  outOfTown: "Foráneo",
  nightclub: "Discoteca",
  wedding: "Matrimonio",
  corporate: "Corporativo",
  festival: "Festival",
  premium: "Premium",
};

export type PayFactor = { label: string; factor: number };

export type MusicianPay = {
  base: number;
  factors: PayFactor[];
  totalFactor: number;
  computed: number; // base × multiplicadores (sin bono)
};

/**
 * Calcula el cachet de un músico según el contexto del show.
 * `premiumApplies` cuando el formato es premium o festival (nivel alto).
 */
export function computeMusicianPay(
  base: number,
  multipliers: MusicianMultipliers,
  context: { eventType: string; scope: ShowScope; premiumApplies: boolean },
): MusicianPay {
  const factors: PayFactor[] = [];

  const eventKey = eventMultiplierKey(context.eventType);
  if (eventKey && multipliers[eventKey] !== 1) {
    factors.push({ label: eventMultiplierLabels[eventKey], factor: multipliers[eventKey] });
  }

  const coverageFactor = context.scope === "local" ? multipliers.local : multipliers.outOfTown;
  if (coverageFactor !== 1) {
    factors.push({
      label: context.scope === "gira" ? "Gira" : "Foráneo",
      factor: coverageFactor,
    });
  }

  if (context.premiumApplies && multipliers.premium !== 1) {
    factors.push({ label: "Premium", factor: multipliers.premium });
  }

  const totalFactor = factors.reduce((acc, item) => acc * item.factor, 1);
  return { base, factors, totalFactor, computed: Math.round(base * totalFactor) };
}
