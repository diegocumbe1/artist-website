export type LocalSeoPage = {
  slug: string;
  eyebrow: string;
  title: string;
  lead: string;
  area: string;
  intentKeywords: string[];
  eventExamples: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const localSeoPages = {
  huila: {
    slug: "/cantante-vallenato-huila",
    eyebrow: "Vallenato en Huila",
    title: "Cantante vallenato en Huila para eventos y celebraciones",
    lead: "Pipe Cumbe lleva show vallenato en vivo a ferias, fiestas, matrimonios, parrandas vallenatas, eventos privados y corporativos en Huila.",
    area: "Huila",
    intentKeywords: [
      "cantante vallenato en Huila",
      "grupo vallenato Huila",
      "show vallenato en vivo Huila",
      "parranda vallenata Huila",
    ],
    eventExamples: [
      "Ferias y fiestas municipales",
      "Matrimonios y celebraciones familiares",
      "Eventos empresariales",
      "Parrandas vallenatas privadas",
    ],
    faqs: [
      {
        question: "¿Pipe Cumbe se presenta en Huila?",
        answer:
          "Sí. Pipe Cumbe está disponible para shows vallenatos en vivo en Huila, incluyendo eventos privados, ferias, fiestas, matrimonios y celebraciones corporativas.",
      },
      {
        question: "¿Cómo contratar un cantante vallenato en Huila?",
        answer:
          "Envía por WhatsApp la ciudad, fecha, tipo de evento y número aproximado de asistentes. El equipo confirma disponibilidad, formato del show y propuesta de contratación.",
      },
    ],
  },
  garzon: {
    slug: "/cantante-vallenato-garzon",
    eyebrow: "Vallenato en Garzón",
    title: "Cantante vallenato en Garzón para ferias, parrandas y eventos",
    lead: "Contrata a Pipe Cumbe para show vallenato en vivo en Garzón, Huila: una propuesta de tarima para eventos privados, ferias, fiestas y matrimonios.",
    area: "Garzón, Huila",
    intentKeywords: [
      "cantante vallenato en Garzón",
      "grupo vallenato Garzón Huila",
      "parranda vallenata en Garzón",
      "show vallenato Garzón",
    ],
    eventExamples: [
      "Eventos privados en Garzón",
      "Fiestas patronales",
      "Cumpleaños y parrandas",
      "Tarimas y festivales",
    ],
    faqs: [
      {
        question: "¿Pipe Cumbe canta en eventos en Garzón?",
        answer:
          "Sí. Pipe Cumbe puede presentarse en Garzón para ferias, fiestas, matrimonios, parrandas vallenatas, eventos privados y escenarios públicos.",
      },
      {
        question: "¿Cómo cotizar un show vallenato en Garzón?",
        answer:
          "Escribe al WhatsApp oficial con fecha, lugar, tipo de evento, duración esperada y número de asistentes para recibir disponibilidad y propuesta.",
      },
    ],
  },
  neiva: {
    slug: "/cantante-vallenato-neiva",
    eyebrow: "Vallenato en Neiva",
    title: "Cantante vallenato en Neiva para eventos privados y empresas",
    lead: "Pipe Cumbe ofrece show vallenato en vivo para matrimonios, empresas, parrandas, fiestas y eventos especiales en Neiva y el Huila.",
    area: "Neiva",
    intentKeywords: [
      "cantante vallenato en Neiva",
      "grupo vallenato Neiva",
      "show vallenato para eventos Neiva",
      "parranda vallenata Neiva",
    ],
    eventExamples: [
      "Eventos corporativos",
      "Matrimonios y recepciones",
      "Celebraciones familiares",
      "Ferias y conciertos",
    ],
    faqs: [
      {
        question: "¿Pipe Cumbe está disponible para eventos en Neiva?",
        answer:
          "Sí. La contratación puede coordinarse para eventos en Neiva según disponibilidad de agenda, formato del show y logística del lugar.",
      },
      {
        question: "¿Qué datos se necesitan para cotizar en Neiva?",
        answer:
          "Para cotizar se recomienda enviar fecha, ciudad, lugar, tipo de evento, horario, duración del show y número aproximado de asistentes.",
      },
    ],
  },
  eventos: {
    slug: "/grupo-vallenato-para-eventos",
    eyebrow: "Shows para eventos",
    title: "Grupo vallenato para eventos en Colombia",
    lead: "Pipe Cumbe es una opción de show vallenato en vivo para ferias, fiestas, matrimonios, parrandas, festivales y eventos corporativos en Colombia.",
    area: "Colombia",
    intentKeywords: [
      "grupo vallenato para eventos",
      "contratar grupo vallenato",
      "show vallenato para matrimonios",
      "parranda vallenata para eventos",
    ],
    eventExamples: [
      "Matrimonios",
      "Eventos empresariales",
      "Ferias y fiestas",
      "Parrandas vallenatas",
    ],
    faqs: [
      {
        question: "¿Pipe Cumbe funciona como grupo vallenato para eventos?",
        answer:
          "Sí. Pipe Cumbe ofrece show vallenato en vivo para eventos sociales, privados, corporativos y públicos, con repertorio y formato coordinado según el evento.",
      },
      {
        question: "¿Cómo contratar grupo vallenato para un evento?",
        answer:
          "El primer paso es enviar fecha, ciudad, tipo de evento, duración del show y condiciones del lugar. Con esa información se confirma disponibilidad y propuesta.",
      },
    ],
  },
} satisfies Record<string, LocalSeoPage>;
