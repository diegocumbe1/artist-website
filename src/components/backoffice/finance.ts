import { Expense, ManagedEvent, Payment } from "@/data/backoffice";

/** Eventos que ya son un compromiso real (se espera cobrarlos). */
export const committedStatuses = new Set(["Separado", "Confirmado", "Realizado"]);

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
