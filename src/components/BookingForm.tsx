"use client";

import { FormEvent, useMemo, useState } from "react";
import { site } from "@/data/site";

const fields = [
  { name: "name", label: "Nombre", type: "text" },
  { name: "city", label: "Ciudad", type: "text" },
  { name: "eventType", label: "Tipo de evento", type: "text" },
  { name: "date", label: "Fecha", type: "date" },
  { name: "attendees", label: "Asistentes", type: "number" },
] as const;

type FieldName = (typeof fields)[number]["name"];
type FormState = Record<FieldName, string>;

const initialState: FormState = {
  name: "",
  city: "",
  eventType: "",
  date: "",
  attendees: "",
};

export function BookingForm() {
  const [form, setForm] = useState<FormState>(initialState);

  const message = useMemo(() => {
    const lines = [
      "Hola Pipe, quiero cotizar una presentación.",
      `Nombre: ${form.name || "-"}`,
      `Ciudad: ${form.city || "-"}`,
      `Tipo de evento: ${form.eventType || "-"}`,
      `Fecha: ${form.date || "-"}`,
      `Asistentes: ${form.attendees || "-"}`,
    ];

    return encodeURIComponent(lines.join("\n"));
  }, [form]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(`https://wa.me/57${site.contact.bookingPhone}?text=${message}`, "_blank");
  }

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-3 rounded-lg border border-orange-300/15 bg-[#0d0d0d]/75 p-4 shadow-[0_0_40px_rgba(245,158,11,0.10)] backdrop-blur-xl sm:grid-cols-2 md:p-5"
    >
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-orange-100/65">
            {field.label}
          </span>
          <input
            type={field.type}
            required={field.name !== "attendees"}
            min={field.type === "number" ? "1" : undefined}
            value={form[field.name]}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                [field.name]: event.target.value,
              }))
            }
            className="h-12 w-full rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm text-foreground outline-none transition-colors placeholder:text-white/30 focus:border-orange-300/70 focus:bg-white/[0.055]"
          />
        </label>
      ))}
      <button
        type="submit"
        className="brand-gradient mt-2 h-12 rounded-md px-5 font-semibold text-white shadow-[0_0_40px_rgba(245,158,11,0.18)] transition-all hover:scale-[1.01] hover:opacity-90 active:scale-[0.99] sm:col-span-2"
      >
        Solicitar cotización por WhatsApp
      </button>
    </form>
  );
}
