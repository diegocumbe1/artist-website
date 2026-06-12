"use client";

import { FormEvent, useMemo, useState } from "react";
import { site } from "@/data/site";

// Tipos de evento alineados con el CRM del backoffice (eventTypeProfiles),
// para que el manager pueda pasar el lead 1:1 sin reinterpretar.
const eventTypeOptions = [
  "Discoteca",
  "Matrimonio",
  "Evento privado",
  "Parranda",
  "Feria municipal",
  "Festival",
  "Evento corporativo",
  "Tarima pública",
  "Otro",
];

// Rangos de presupuesto: califican al cliente y anclan el precio hacia arriba.
const budgetOptions = [
  "Menos de $2.000.000",
  "$2 a $4 millones",
  "$4 a $7 millones",
  "Más de $7 millones",
  "Por definir",
];

const inputClass =
  "h-12 w-full rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm text-foreground outline-none transition-colors placeholder:text-white/30 focus:border-orange-300/70 focus:bg-white/[0.055]";

type FormState = {
  name: string;
  phone: string;
  city: string;
  eventType: string;
  date: string;
  attendees: string;
  budget: string;
  notes: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  city: "",
  eventType: "",
  date: "",
  attendees: "",
  budget: "",
  notes: "",
};

export function BookingForm() {
  const [form, setForm] = useState<FormState>(initialState);

  const message = useMemo(() => {
    const lines = [
      "Hola Pipe, quiero cotizar una presentación.",
      `Nombre: ${form.name || "-"}`,
      `Teléfono: ${form.phone || "-"}`,
      `Ciudad: ${form.city || "-"}`,
      `Tipo de evento: ${form.eventType || "-"}`,
      `Fecha: ${form.date || "-"}`,
      `Asistentes: ${form.attendees || "-"}`,
      `Presupuesto estimado: ${form.budget || "-"}`,
      `Detalles: ${form.notes || "-"}`,
    ];

    return encodeURIComponent(lines.join("\n"));
  }, [form]);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(`https://wa.me/57${site.contact.bookingPhone}?text=${message}`, "_blank");
  }

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-3 rounded-lg border border-orange-300/15 bg-[#0d0d0d]/75 p-4 shadow-[0_0_40px_rgba(245,158,11,0.10)] backdrop-blur-xl sm:grid-cols-2 md:p-5"
    >
      <Label text="Nombre">
        <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} />
      </Label>
      <Label text="Teléfono / WhatsApp">
        <input type="tel" required inputMode="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
      </Label>
      <Label text="Ciudad">
        <input type="text" required value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} />
      </Label>
      <Label text="Tipo de evento">
        <select required value={form.eventType} onChange={(e) => update("eventType", e.target.value)} className={inputClass}>
          <option value="" disabled>
            Selecciona…
          </option>
          {eventTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Label>
      <Label text="Fecha">
        <input type="date" required value={form.date} onChange={(e) => update("date", e.target.value)} className={inputClass} />
      </Label>
      <Label text="Asistentes">
        <input type="number" min="1" value={form.attendees} onChange={(e) => update("attendees", e.target.value)} className={inputClass} />
      </Label>
      <Label text="Presupuesto estimado">
        <select required value={form.budget} onChange={(e) => update("budget", e.target.value)} className={inputClass}>
          <option value="" disabled>
            Selecciona…
          </option>
          {budgetOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Label>
      <Label text="Detalles (opcional)">
        <input type="text" value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Lugar, horas, sonido…" className={inputClass} />
      </Label>
      <button
        type="submit"
        className="brand-gradient mt-2 h-12 rounded-md px-5 font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99] sm:col-span-2"
      >
        Solicitar cotización por WhatsApp
      </button>
    </form>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-orange-100/65">{text}</span>
      {children}
    </label>
  );
}
