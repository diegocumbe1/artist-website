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
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  basePay: number;
  phone: string;
  status: "Activo" | "Backup" | "Inactivo";
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

export type BackofficeData = {
  events: ManagedEvent[];
  team: TeamMember[];
  costs: OperatingCost[];
  payments: Payment[];
  expenses: Expense[];
  goals: FinanceGoals;
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
  {
    id: "team-001",
    name: "Pipe Cumbe",
    role: "Cantante",
    basePay: 60000,
    phone: "3142653942",
    status: "Activo",
  },
  {
    id: "team-002",
    name: "Acordeonero",
    role: "Acordeón",
    basePay: 60000,
    phone: "",
    status: "Activo",
  },
  {
    id: "team-003",
    name: "Bajista",
    role: "Bajo",
    basePay: 60000,
    phone: "",
    status: "Activo",
  },
  {
    id: "team-004",
    name: "Percusión",
    role: "Timbal / Guacharaca",
    basePay: 50000,
    phone: "",
    status: "Activo",
  },
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
