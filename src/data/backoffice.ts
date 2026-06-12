export enum BackofficeUser {
  Manager = "manager",
  Admin = "admin",
  Booking = "booking",
}

export type BackofficeRole = "Manager" | "Administrador" | "Booking";

export type BackofficeAccount = {
  user: BackofficeUser;
  label: string;
  role: BackofficeRole;
  password: string;
};

export type EventStatus =
  | "Lead"
  | "Cotizado"
  | "Separado"
  | "Confirmado"
  | "Realizado"
  | "Cancelado";

export type ManagedEvent = {
  id: string;
  date: string;
  client: string;
  city: string;
  type: string;
  status: EventStatus;
  value: number;
  operationCosts: number;
  singerPay: number;
  musiciansPay: number;
  managerPct: number;
  reinvestPct: number;
  contingencyPct: number;
  notes: string;
  // Opcionales: preparan la conversión lead → contratación desde el cotizador.
  format?: string; // ShowFormatKey
  coverage?: string; // ShowScope
  suggestedPrice?: number; // precio saludable recomendado por el cotizador
  negotiatedPrice?: number; // precio realmente cerrado con el cliente
};

/**
 * Multiplicadores de cachet por músico. Se aplican de forma multiplicativa
 * sobre la tarifa base según tipo de evento, cobertura y nivel del show.
 * Ej: base 180.000 × wedding 1.20 × outOfTown 1.10 = 237.600.
 */
export type MusicianMultipliers = {
  local: number; // cobertura local (normalmente 1.0)
  outOfTown: number; // cobertura foránea / gira
  nightclub: number; // Discoteca
  wedding: number; // Matrimonio
  corporate: number; // Evento corporativo
  festival: number; // Festival / feria / tarima
  premium: number; // formato premium o festival (nivel alto)
};

export const defaultMultipliers: MusicianMultipliers = {
  local: 1,
  outOfTown: 1.1,
  nightclub: 1.1,
  wedding: 1.2,
  corporate: 1.25,
  festival: 1.35,
  premium: 1,
};

export type TeamMember = {
  id: string;
  name: string;
  role: string; // instrumento / rol
  basePay: number; // tarifa base
  phone: string;
  status: "Activo" | "Backup" | "Inactivo";
  multipliers?: MusicianMultipliers; // si falta, se usan los defaults
  manualOverrideEnabled?: boolean; // congela la tarifa base sin multiplicadores
};

export type OperatingCost = {
  id: string;
  category: string;
  amount: number;
  frequency: "Por evento" | "Mensual" | "Ocasional";
  owner: string;
  notes: string;
};

export type PaymentMethod =
  | "Transferencia"
  | "Bancolombia"
  | "Nequi"
  | "Daviplata"
  | "Efectivo"
  | "Otro";

export type PaymentType = "Anticipo" | "Abono" | "Saldo final";

export type Payment = {
  id: string;
  eventId: string; // "" = ingreso suelto sin evento asociado
  date: string;
  amount: number;
  method: PaymentMethod;
  type: PaymentType;
  notes: string;
};

export type ExpenseKind =
  | "Nómina"
  | "Transporte"
  | "Sonido"
  | "Manager"
  | "Fijo"
  | "Variable"
  | "Otro";

export type Expense = {
  id: string;
  date: string;
  concept: string;
  kind: ExpenseKind;
  amount: number;
  eventId: string; // "" = gasto general
  payee: string; // músico / proveedor
  status: "Pendiente" | "Pagado";
  period: "Único" | "Semanal" | "Mensual";
  notes: string;
};

export type FinanceGoals = {
  weekly: number;
  monthly: number;
};

/**
 * Variables/estándares editables que alimentan la calculadora.
 * El usuario los ajusta en la sección "Variables" del backoffice.
 */
export type FinanceSettings = {
  musicianPay: number; // pago estándar por músico por show
  musiciansCount: number; // número de músicos (sin contar al cantante)
  singerPay: number; // pago estándar del cantante / figura
  teamSize: number; // total de personas que viajan (para hospedaje y viáticos)
  mealsPerPerson: number; // viáticos de comida por persona
  transportLocal: number; // transporte dentro de la ciudad
  transportOutOfTown: number; // transporte base para evento foráneo
  lodgingPerPerson: number; // hospedaje por persona (por noche)
  managerPct: number; // 0–1
  reinvestPct: number; // 0–1
  contingencyPct: number; // 0–1 (ahorro imprevistos)
  targetProfitPct: number; // 0–1 utilidad deseada por defecto
};

export type LeadStage =
  | "Nuevo"
  | "Contactado"
  | "Calificado"
  | "Cotizado"
  | "Negociación"
  | "Anticipo pendiente"
  | "Separado"
  | "Confirmado"
  | "Perdido";

/** Etapas en orden del embudo (Perdido es terminal, va aparte). */
export const leadPipeline: LeadStage[] = [
  "Nuevo",
  "Contactado",
  "Calificado",
  "Cotizado",
  "Negociación",
  "Anticipo pendiente",
  "Separado",
  "Confirmado",
];

export const leadStages: LeadStage[] = [...leadPipeline, "Perdido"];

/** Probabilidad de cierre sugerida por etapa (editable por lead). */
export const stageProbability: Record<LeadStage, number> = {
  Nuevo: 10,
  Contactado: 20,
  Calificado: 35,
  Cotizado: 50,
  Negociación: 65,
  "Anticipo pendiente": 80,
  Separado: 90,
  Confirmado: 100,
  Perdido: 0,
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  city: string;
  tentativeDate: string;
  eventType: string;
  format: string; // ShowFormatKey sugerido
  estimatedBudget: number;
  quotedValue: number;
  stage: LeadStage;
  closeProbability: number; // 0-100
  owner: string; // responsable
  nextAction: string;
  notes: string;
  createdAt: string;
  convertedEventId?: string; // si ya se convirtió en contratación
};

/** Una línea de nómina dentro de una cotización guardada (historial). */
export type QuoteLine = {
  memberId: string;
  name: string;
  instrument: string;
  base: number;
  multiplier: number; // factor total aplicado
  override: boolean; // valor manual congelado
  bonus: number;
  final: number; // base × multiplier (o manual) + bonus
  note: string;
};

/** Snapshot de una cotización para análisis posterior de costos reales. */
export type QuoteRecord = {
  id: string;
  createdAt: string;
  label: string;
  formatKey: string;
  eventType: string;
  scope: string;
  payroll: QuoteLine[];
  musiciansPay: number;
  singerPay: number;
  operationCosts: number;
  directCosts: number;
  suggestedHealthy: number;
  finalPrice: number;
};

export type BackofficeData = {
  events: ManagedEvent[];
  team: TeamMember[];
  costs: OperatingCost[];
  payments: Payment[];
  expenses: Expense[];
  goals: FinanceGoals;
  settings: FinanceSettings;
  leads: Lead[];
  quotes: QuoteRecord[];
};

export const backofficeAccounts: BackofficeAccount[] = [
  {
    user: BackofficeUser.Manager,
    label: "Manager",
    role: "Manager",
    password: "pipe-manager",
  },
  {
    user: BackofficeUser.Admin,
    label: "Admin",
    role: "Administrador",
    password: "pipe-admin",
  },
  {
    user: BackofficeUser.Booking,
    label: "Booking",
    role: "Booking",
    password: "pipe-booking",
  },
];

export const defaultEvents: ManagedEvent[] = [
  {
    id: "evt-001",
    date: "2026-06-15",
    client: "Evento privado",
    city: "Bogotá",
    type: "Matrimonio",
    status: "Cotizado",
    value: 1200000,
    operationCosts: 120000,
    singerPay: 100000,
    musiciansPay: 325000,
    managerPct: 0.1,
    reinvestPct: 0.05,
    contingencyPct: 0.03,
    notes: "Lead pendiente por confirmar anticipo.",
  },
  {
    id: "evt-002",
    date: "2026-06-28",
    client: "Feria municipal",
    city: "Huila",
    type: "Festival",
    status: "Lead",
    value: 2000000,
    operationCosts: 250000,
    singerPay: 150000,
    musiciansPay: 450000,
    managerPct: 0.1,
    reinvestPct: 0.05,
    contingencyPct: 0.03,
    notes: "Validar sonido, transporte y horario de tarima.",
  },
];

export const defaultTeam: TeamMember[] = [
  { id: "team-001", name: "Pipe Cumbe", role: "Cantante", basePay: 250000, phone: "3142653942", status: "Activo" },
  { id: "team-002", name: "Acordeonero", role: "Acordeón", basePay: 180000, phone: "", status: "Activo" },
  { id: "team-003", name: "Cajero", role: "Caja", basePay: 120000, phone: "", status: "Activo" },
  { id: "team-004", name: "Guacharaquero", role: "Guacharaca", basePay: 120000, phone: "", status: "Activo" },
  { id: "team-005", name: "Timbalero", role: "Timbal", basePay: 130000, phone: "", status: "Activo" },
  { id: "team-006", name: "Bajista", role: "Bajo", basePay: 140000, phone: "", status: "Activo" },
  { id: "team-007", name: "Guitarrista", role: "Guitarra", basePay: 140000, phone: "", status: "Activo" },
  { id: "team-008", name: "Conguero", role: "Congas", basePay: 130000, phone: "", status: "Activo" },
  { id: "team-009", name: "Tecladista", role: "Teclado", basePay: 140000, phone: "", status: "Activo" },
  { id: "team-010", name: "Trompetista", role: "Tuba / Trompeta", basePay: 150000, phone: "", status: "Activo" },
];

export const defaultCosts: OperatingCost[] = [
  {
    id: "cost-001",
    category: "Combustible",
    amount: 10000,
    frequency: "Por evento",
    owner: "Operación",
    notes: "Base tomada de la plantilla.",
  },
  {
    id: "cost-002",
    category: "Alquiler vehículo",
    amount: 20000,
    frequency: "Por evento",
    owner: "Operación",
    notes: "Ajustar según ciudad.",
  },
  {
    id: "cost-003",
    category: "Sonido / cabinas",
    amount: 50000,
    frequency: "Por evento",
    owner: "Producción",
    notes: "Confirmar si lo cubre el cliente.",
  },
  {
    id: "cost-004",
    category: "Publicidad",
    amount: 0,
    frequency: "Mensual",
    owner: "Marketing",
    notes: "Campañas y pauta.",
  },
];

export const defaultPayments: Payment[] = [
  {
    id: "pay-001",
    eventId: "evt-001",
    date: "2026-05-20",
    amount: 400000,
    method: "Transferencia",
    type: "Anticipo",
    notes: "Anticipo para separar la fecha.",
  },
];

export const defaultExpenses: Expense[] = [
  {
    id: "exp-001",
    date: "2026-05-24",
    concept: "Transporte equipo",
    kind: "Transporte",
    amount: 30000,
    eventId: "",
    payee: "Operación",
    status: "Pagado",
    period: "Único",
    notes: "",
  },
  {
    id: "exp-002",
    date: "2026-05-26",
    concept: "Pauta Instagram",
    kind: "Variable",
    amount: 50000,
    eventId: "",
    payee: "Marketing",
    status: "Pagado",
    period: "Mensual",
    notes: "Campaña de captación de eventos medianos.",
  },
];

export const defaultGoals: FinanceGoals = {
  weekly: 800000,
  monthly: 4000000,
};

export const defaultQuotes: QuoteRecord[] = [];

export const defaultLeads: Lead[] = [
  {
    id: "lead-001",
    name: "Andrea Restrepo",
    phone: "3001234567",
    city: "Medellín",
    tentativeDate: "2026-08-15",
    eventType: "Matrimonio",
    format: "premium",
    estimatedBudget: 5000000,
    quotedValue: 5500000,
    stage: "Cotizado",
    closeProbability: 50,
    owner: "Booking",
    nextAction: "Llamar para confirmar recepción de la propuesta.",
    notes: "Boda al aire libre, 200 invitados. Le interesa formato premium.",
    createdAt: "2026-05-26",
  },
  {
    id: "lead-002",
    name: "Discoteca La Tarima",
    phone: "3107654321",
    city: "Montería",
    tentativeDate: "2026-07-05",
    eventType: "Discoteca",
    format: "medio",
    estimatedBudget: 2500000,
    quotedValue: 3200000,
    stage: "Negociación",
    closeProbability: 65,
    owner: "Manager",
    nextAction: "Sostener precio; ofrecer fecha alterna si insisten en bajar.",
    notes: "Quieren descuento. No bajar de piso; ajustar formato si es necesario.",
    createdAt: "2026-05-24",
  },
  {
    id: "lead-003",
    name: "Alcaldía de Sahagún",
    phone: "3209876543",
    city: "Sahagún",
    tentativeDate: "2026-06-29",
    eventType: "Feria municipal",
    format: "festival",
    estimatedBudget: 7000000,
    quotedValue: 0,
    stage: "Calificado",
    closeProbability: 35,
    owner: "Manager",
    nextAction: "Enviar propuesta de tarima full band para fiestas de San Pedro.",
    notes: "Fiestas patronales. Foráneo: incluir transporte + hospedaje.",
    createdAt: "2026-05-28",
  },
];

// Estándares de la etapa de transición (ver docs/estrategia-precios-vallenato.md).
export const defaultSettings: FinanceSettings = {
  musicianPay: 120000,
  musiciansCount: 9,
  singerPay: 200000,
  teamSize: 10,
  mealsPerPerson: 25000,
  transportLocal: 250000,
  transportOutOfTown: 600000,
  lodgingPerPerson: 80000,
  managerPct: 0.1,
  reinvestPct: 0.05,
  contingencyPct: 0.03,
  targetProfitPct: 0.3,
};
