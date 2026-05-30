"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  BackofficeData,
  Expense,
  ExpenseKind,
  Payment,
  PaymentMethod,
  PaymentType,
} from "@/data/backoffice";
import {
  Range,
  committedStatuses,
  eventBalance,
  eventContingency,
  eventManager,
  eventPaid,
  eventProfit,
  eventSingerPay,
  monthRange,
  sumIn,
  totalPayable,
  totalReceivable,
  weekRange,
} from "./finance";
import {
  EmptyState,
  CurrencyField,
  Field,
  Kpi,
  Panel,
  ProgressBar,
  SelectField,
  StatusBadge,
  createId,
  currency,
} from "./ui";

const paymentMethods: PaymentMethod[] = [
  "Transferencia",
  "Bancolombia",
  "Nequi",
  "Daviplata",
  "Efectivo",
  "Otro",
];
const paymentTypes: PaymentType[] = ["Anticipo", "Abono", "Saldo final"];
const expenseKinds: ExpenseKind[] = [
  "Nómina",
  "Transporte",
  "Sonido",
  "Manager",
  "Fijo",
  "Variable",
  "Otro",
];

type SetData = (updater: (current: BackofficeData) => BackofficeData) => void;

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("es-CO", { month: "long", year: "numeric" });
}

export function FinanceModule({ data, setData }: { data: BackofficeData; setData: SetData }) {
  const today = useMemo(() => new Date(), []);
  const week = useMemo<Range>(() => weekRange(today), [today]);
  const month = useMemo<Range>(() => monthRange(today), [today]);

  const incomeMonth = sumIn(data.payments, month);
  const incomeWeek = sumIn(data.payments, week);
  const expensesMonthPaid = sumIn(data.expenses, month, (e) => e.status === "Pagado");
  const receivable = totalReceivable(data.events, data.payments);
  const payable = totalPayable(data.expenses);
  const netMonth = incomeMonth - expensesMonthPaid;
  const committedEvents = data.events.filter((event) => committedStatuses.has(event.status));
  const singerEstimated = committedEvents.reduce((sum, event) => sum + eventSingerPay(event), 0);
  const musiciansEstimated = committedEvents.reduce((sum, event) => sum + event.musiciansPay, 0);
  const managerEstimated = committedEvents.reduce((sum, event) => sum + eventManager(event), 0);
  const contingencyEstimated = committedEvents.reduce((sum, event) => sum + eventContingency(event), 0);

  const weeklyProgress = data.goals.weekly > 0 ? incomeWeek / data.goals.weekly : 0;
  const monthlyProgress = data.goals.monthly > 0 ? incomeMonth / data.goals.monthly : 0;

  return (
    <section className="grid gap-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Ingresos del mes" value={currency.format(incomeMonth)} hint="Pagos recibidos este mes" tone="good" />
        <Kpi label="Por cobrar" value={currency.format(receivable)} hint="Saldos de eventos comprometidos" tone="warn" />
        <Kpi label="Egresos del mes" value={currency.format(expensesMonthPaid)} hint={`Pendiente por pagar: ${currency.format(payable)}`} tone="bad" />
        <Kpi label="Utilidad neta del mes" value={currency.format(netMonth)} hint="Ingresos − egresos pagados" tone={netMonth >= 0 ? "good" : "bad"} />
      </div>

      <Panel title="Distribución estimada por eventos comprometidos">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Cantante" value={currency.format(singerEstimated)} hint="Pago estimado separado para Pipe" />
          <Kpi label="Músicos" value={currency.format(musiciansEstimated)} hint="Base para agrupación / instrumentistas" />
          <Kpi label="Manager" value={currency.format(managerEstimated)} hint="Porcentaje comercial de eventos separados" />
          <Kpi label="Ahorro imprevistos" value={currency.format(contingencyEstimated)} hint="Reserva sugerida, 3% por defecto" tone="warn" />
        </div>
      </Panel>

      <GoalsPanel
        data={data}
        setData={setData}
        incomeWeek={incomeWeek}
        incomeMonth={incomeMonth}
        weeklyProgress={weeklyProgress}
        monthlyProgress={monthlyProgress}
      />

      <ReceivablesPanel data={data} setData={setData} />

      <div className="grid gap-5 lg:grid-cols-2">
        <IncomeManager data={data} setData={setData} />
        <ExpenseManager data={data} setData={setData} />
      </div>

      <ProjectionPanel data={data} month={month} />
    </section>
  );
}

function GoalsPanel({
  data,
  setData,
  incomeWeek,
  incomeMonth,
  weeklyProgress,
  monthlyProgress,
}: {
  data: BackofficeData;
  setData: SetData;
  incomeWeek: number;
  incomeMonth: number;
  weeklyProgress: number;
  monthlyProgress: number;
}) {
  function updateGoal(key: "weekly" | "monthly", value: number) {
    setData((current) => ({ ...current, goals: { ...current.goals, [key]: value } }));
  }

  return (
    <Panel title="Metas">
      <div className="grid gap-5 md:grid-cols-2">
        <GoalCard
          label="Meta semanal"
          target={data.goals.weekly}
          achieved={incomeWeek}
          progress={weeklyProgress}
          onChange={(value) => updateGoal("weekly", value)}
        />
        <GoalCard
          label="Meta mensual"
          target={data.goals.monthly}
          achieved={incomeMonth}
          progress={monthlyProgress}
          onChange={(value) => updateGoal("monthly", value)}
        />
      </div>
    </Panel>
  );
}

function GoalCard({
  label,
  target,
  achieved,
  progress,
  onChange,
}: {
  label: string;
  target: number;
  achieved: number;
  progress: number;
  onChange: (value: number) => void;
}) {
  const remaining = Math.max(target - achieved, 0);
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">{label}</p>
        <span className="text-sm font-semibold">{Math.round(progress * 100)}%</span>
      </div>
      <p className="mt-3 font-impact text-3xl tracking-wide">{currency.format(achieved)}</p>
      <p className="text-xs text-[color:var(--muted)]">
        de {currency.format(target)} · faltan {currency.format(remaining)}
      </p>
      <div className="mt-4">
        <ProgressBar value={progress} />
      </div>
      <label className="mt-4 flex items-center gap-2 text-xs text-[color:var(--muted)]">
        Ajustar meta
        <CurrencyInlineInput value={target} onChange={onChange} />
      </label>
    </div>
  );
}

function CurrencyInlineInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={currency.format(value || 0)}
      onChange={(event) => {
        const numericValue = Number(event.target.value.replace(/\D/g, ""));
        onChange(Number.isFinite(numericValue) ? numericValue : 0);
      }}
      className="h-9 w-40 rounded-md border border-white/10 bg-white/[0.035] px-2 text-sm text-foreground outline-none transition-colors focus:border-orange-300/70 focus:bg-white/[0.055]"
    />
  );
}

function ReceivablesPanel({ data, setData }: { data: BackofficeData; setData: SetData }) {
  const rows = useMemo(() => {
    return data.events
      .filter((event) => committedStatuses.has(event.status))
      .map((event) => ({
        event,
        paid: eventPaid(event.id, data.payments),
        balance: eventBalance(event, data.payments),
      }))
      .filter((row) => row.balance > 0)
      .sort((a, b) => a.event.date.localeCompare(b.event.date));
  }, [data.events, data.payments]);

  function registerFullPayment(eventId: string, amount: number) {
    setData((current) => ({
      ...current,
      payments: [
        {
          id: createId("pay"),
          eventId,
          date: new Date().toISOString().slice(0, 10),
          amount,
          method: "Transferencia",
          type: "Saldo final",
          notes: "Saldo cobrado completo.",
        },
        ...current.payments,
      ],
    }));
  }

  return (
    <Panel title="Pendientes por cobrar">
      {rows.length === 0 ? (
        <EmptyState text="No hay saldos pendientes en eventos comprometidos." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.16em] text-orange-100/60">
              <tr className="border-b border-white/10 bg-white/[0.025]">
                <th className="py-3">Fecha</th>
                <th>Cliente</th>
                <th>Valor</th>
                <th>Abonado</th>
                <th>Saldo</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ event, paid, balance }) => (
                <tr key={event.id} className="border-b border-white/10 transition-colors hover:bg-white/[0.025]">
                  <td className="py-3">{event.date || "-"}</td>
                  <td>{event.client}</td>
                  <td>{currency.format(event.value)}</td>
                  <td className="text-emerald-300">{currency.format(paid)}</td>
                  <td className="text-orange-200">{currency.format(balance)}</td>
                  <td>
                    <StatusBadge status={event.status} />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => registerFullPayment(event.id, balance)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-orange-300/40 hover:bg-white/[0.06] hover:text-white"
                    >
                      Cobrar saldo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

function IncomeManager({ data, setData }: { data: BackofficeData; setData: SetData }) {
  const [draft, setDraft] = useState<Omit<Payment, "id">>({
    eventId: "",
    date: new Date().toISOString().slice(0, 10),
    amount: 0,
    method: "Transferencia",
    type: "Abono",
    notes: "",
  });

  const eventOptions = useMemo(
    () => [
      { value: "", label: "Sin evento (ingreso suelto)" },
      ...data.events.map((event) => ({
        value: event.id,
        label: `${event.date || "s/f"} · ${event.client}`,
      })),
    ],
    [data.events],
  );

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.amount <= 0) return;
    setData((current) => ({
      ...current,
      payments: [{ ...draft, id: createId("pay") }, ...current.payments],
    }));
    setDraft((current) => ({ ...current, amount: 0, notes: "" }));
  }

  function remove(id: string) {
    setData((current) => ({
      ...current,
      payments: current.payments.filter((payment) => payment.id !== id),
    }));
  }

  const recent = [...data.payments].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <Panel title="Registrar ingreso">
      <form onSubmit={submit} className="grid gap-3">
        <SelectField
          label="Evento"
          value={draft.eventId}
          options={eventOptions}
          onChange={(value) => setDraft({ ...draft, eventId: value })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Fecha" type="date" value={draft.date} onChange={(value) => setDraft({ ...draft, date: value })} />
          <CurrencyField label="Monto" value={draft.amount} onChange={(value) => setDraft({ ...draft, amount: value })} />
          <SelectField label="Medio" value={draft.method} options={paymentMethods} onChange={(value) => setDraft({ ...draft, method: value as PaymentMethod })} />
          <SelectField label="Tipo" value={draft.type} options={paymentTypes} onChange={(value) => setDraft({ ...draft, type: value as PaymentType })} />
        </div>
        <Field label="Notas" value={draft.notes} onChange={(value) => setDraft({ ...draft, notes: value })} />
        <button type="submit" className="brand-gradient h-11 rounded-md font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]">
          Registrar ingreso
        </button>
      </form>

      <h3 className="mb-3 mt-6 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
        Ingresos recientes
      </h3>
      {recent.length === 0 ? (
        <EmptyState text="Aún no registras ingresos." />
      ) : (
        <ul className="space-y-2">
          {recent.map((payment) => {
            const event = data.events.find((item) => item.id === payment.eventId);
            return (
              <li
                key={payment.id}
                className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.025] p-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-emerald-300">{currency.format(payment.amount)}</p>
                  <p className="text-xs text-[color:var(--muted)]">
                    {payment.date} · {payment.type} · {payment.method}
                    {event ? ` · ${event.client}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(payment.id)}
                  className="text-[color:var(--muted)] hover:text-red-300"
                  aria-label="Eliminar ingreso"
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function ExpenseManager({ data, setData }: { data: BackofficeData; setData: SetData }) {
  const [draft, setDraft] = useState<Omit<Expense, "id">>({
    date: new Date().toISOString().slice(0, 10),
    concept: "",
    kind: "Nómina",
    amount: 0,
    eventId: "",
    payee: "",
    status: "Pendiente",
    period: "Único",
    notes: "",
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.amount <= 0 || !draft.concept.trim()) return;
    setData((current) => ({
      ...current,
      expenses: [{ ...draft, id: createId("exp") }, ...current.expenses],
    }));
    setDraft((current) => ({ ...current, concept: "", amount: 0, payee: "", notes: "" }));
  }

  function toggleStatus(id: string) {
    setData((current) => ({
      ...current,
      expenses: current.expenses.map((expense) =>
        expense.id === id
          ? { ...expense, status: expense.status === "Pagado" ? "Pendiente" : "Pagado" }
          : expense,
      ),
    }));
  }

  function remove(id: string) {
    setData((current) => ({
      ...current,
      expenses: current.expenses.filter((expense) => expense.id !== id),
    }));
  }

  const payeeOptions = useMemo(
    () => ["", ...data.team.map((member) => member.name), "Operación", "Marketing", "Manager"],
    [data.team],
  );

  const recent = [...data.expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <Panel title="Egresos y nómina">
      <form onSubmit={submit} className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Concepto" value={draft.concept} onChange={(value) => setDraft({ ...draft, concept: value })} />
          <CurrencyField label="Monto" value={draft.amount} onChange={(value) => setDraft({ ...draft, amount: value })} />
          <SelectField label="Tipo" value={draft.kind} options={expenseKinds} onChange={(value) => setDraft({ ...draft, kind: value as ExpenseKind })} />
          <SelectField label="Beneficiario" value={draft.payee} options={payeeOptions.map((name) => ({ value: name, label: name || "Sin beneficiario" }))} onChange={(value) => setDraft({ ...draft, payee: value })} />
          <Field label="Fecha" type="date" value={draft.date} onChange={(value) => setDraft({ ...draft, date: value })} />
          <SelectField label="Periodicidad" value={draft.period} options={["Único", "Semanal", "Mensual"]} onChange={(value) => setDraft({ ...draft, period: value as Expense["period"] })} />
          <SelectField label="Estado" value={draft.status} options={["Pendiente", "Pagado"]} onChange={(value) => setDraft({ ...draft, status: value as Expense["status"] })} />
        </div>
        <button type="submit" className="brand-gradient h-11 rounded-md font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]">
          Registrar egreso
        </button>
      </form>

      <h3 className="mb-3 mt-6 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
        Egresos recientes
      </h3>
      {recent.length === 0 ? (
        <EmptyState text="Aún no registras egresos." />
      ) : (
        <ul className="space-y-2">
          {recent.map((expense) => (
            <li
              key={expense.id}
              className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-white/[0.025] p-3 text-sm"
            >
              <div>
                <p className="font-semibold text-red-300">{currency.format(expense.amount)}</p>
                <p className="text-xs text-[color:var(--muted)]">
                  {expense.date} · {expense.kind}
                  {expense.payee ? ` · ${expense.payee}` : ""} · {expense.concept}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleStatus(expense.id)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    expense.status === "Pagado"
                      ? "border-emerald-400/30 text-emerald-300"
                      : "border-orange-300/35 text-orange-200"
                  }`}
                >
                  {expense.status}
                </button>
                <button
                  type="button"
                  onClick={() => remove(expense.id)}
                  className="text-[color:var(--muted)] hover:text-red-300"
                  aria-label="Eliminar egreso"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function ProjectionPanel({ data, month }: { data: BackofficeData; month: Range }) {
  const upcoming = useMemo(() => {
    const start = month.start;
    const grouped = new Map<string, { expected: number; profit: number; count: number }>();

    data.events
      .filter((event) => committedStatuses.has(event.status) && event.date >= start)
      .forEach((event) => {
        const key = event.date.slice(0, 7);
        const current = grouped.get(key) ?? { expected: 0, profit: 0, count: 0 };
        current.expected += eventBalance(event, data.payments);
        current.profit += eventProfit(event);
        current.count += 1;
        grouped.set(key, current);
      });

    return [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [data.events, data.payments, month.start]);

  const totalExpected = upcoming.reduce((sum, [, value]) => sum + value.expected, 0);
  const totalProfit = upcoming.reduce((sum, [, value]) => sum + value.profit, 0);

  return (
    <Panel title="Proyección a futuro">
      {upcoming.length === 0 ? (
        <EmptyState text="No hay eventos comprometidos a futuro para proyectar." />
      ) : (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <Kpi label="Ingreso proyectado" value={currency.format(totalExpected)} hint="Saldos por cobrar de eventos comprometidos" />
            <Kpi label="Utilidad proyectada" value={currency.format(totalProfit)} tone={totalProfit >= 0 ? "good" : "bad"} />
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {upcoming.map(([key, value]) => (
              <article key={key} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <h3 className="font-impact text-2xl capitalize tracking-wide">{monthLabel(key)}</h3>
                <p className="mt-3 text-sm text-[color:var(--muted)]">{value.count} evento(s)</p>
                <p className="mt-1 text-lg font-semibold">{currency.format(value.expected)}</p>
                <p className="text-xs text-emerald-300">Utilidad: {currency.format(value.profit)}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </Panel>
  );
}
