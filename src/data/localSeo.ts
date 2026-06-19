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
  vallenatoXxi: {
    slug: "/vallenato-xxi",
    eyebrow: "Vallenato XXI · Con todos los poderes",
    title: "Vallenato XXI: la propuesta de Pipe Cumbe",
    lead: "Vallenato XXI (también escrito Vallenato 21) es el sello de Pipe Cumbe: vallenato con raíz tradicional y energía de tarima moderna para parrandas, ferias, matrimonios y eventos en vivo.",
    area: "Colombia",
    intentKeywords: [
      "vallenato XXI",
      "vallenato 21",
      "qué es el vallenato XXI",
      "Pipe Cumbe vallenato XXI",
    ],
    eventExamples: [
      "Parrandas vallenatas",
      "Ferias y fiestas",
      "Matrimonios y eventos privados",
      "Conciertos y festivales",
    ],
    faqs: [
      {
        question: "¿Qué es el Vallenato XXI?",
        answer:
          "Vallenato XXI, también escrito Vallenato 21, es la propuesta artística de Pipe Cumbe: un vallenato que conserva la raíz y el sentimiento tradicional, pero con una energía moderna de tarima pensada para parrandas, eventos y shows en vivo.",
      },
      {
        question: "¿Quién canta el Vallenato XXI?",
        answer:
          "El Vallenato XXI es la marca de Pipe Cumbe (Andrés Felipe Cumbe), cantante vallenato colombiano nacido en Garzón, Huila. Su canal oficial es @VALLENATOXXI en YouTube y @pipecumbe en Instagram.",
      },
      {
        question: "¿Cómo contratar el show de Vallenato XXI?",
        answer:
          "Escribe al WhatsApp oficial con fecha, ciudad, tipo de evento y número de asistentes para recibir disponibilidad y propuesta del show Vallenato XXI en vivo.",
      },
    ],
  },
  parrandon: {
    slug: "/parrandon-vallenato",
    eyebrow: "Parrandón vallenato",
    title: "Parrandón vallenato en vivo con Pipe Cumbe",
    lead: "Pipe Cumbe lleva el parrandón vallenato a tu celebración: parranda, sentimiento y energía en vivo para cumpleaños, matrimonios, fiestas y reuniones privadas en Garzón, Huila y Colombia.",
    area: "Garzón, Huila",
    intentKeywords: [
      "parrandón vallenato",
      "parrandón en Garzón",
      "parrandón vallenato Huila",
      "contratar parrandón vallenato",
    ],
    eventExamples: [
      "Parrandas y parrandones privados",
      "Cumpleaños y aniversarios",
      "Matrimonios y despedidas",
      "Reuniones familiares y empresariales",
    ],
    faqs: [
      {
        question: "¿Pipe Cumbe hace parrandones vallenatos privados?",
        answer:
          "Sí. Pipe Cumbe realiza parrandones y parrandas vallenatas en vivo para cumpleaños, matrimonios, fiestas, despedidas y reuniones privadas en Garzón, Huila y otras ciudades de Colombia.",
      },
      {
        question: "¿Cuánto dura un parrandón vallenato?",
        answer:
          "La duración se coordina según el evento. Al cotizar por WhatsApp puedes indicar el horario y las horas de show que deseas, y el equipo confirma el formato del parrandón.",
      },
      {
        question: "¿Cómo reservar un parrandón vallenato?",
        answer:
          "Envía por WhatsApp la fecha, ciudad, lugar y número de asistentes. Con esa información se confirma disponibilidad, propuesta y reserva del parrandón vallenato.",
      },
    ],
  },
  artistasGarzon: {
    slug: "/artistas-garzon-huila",
    eyebrow: "Artistas y música en vivo en el Huila",
    title: "Artistas y música en vivo en Garzón, Huila",
    lead: "¿Buscas artistas o música en vivo en Garzón, Huila? Pipe Cumbe es un artista vallenato de Garzón con show en vivo para ferias, fiestas, matrimonios, parrandas y eventos en todo el Huila.",
    area: "Garzón, Huila",
    intentKeywords: [
      "artistas de Garzón Huila",
      "música en vivo en Garzón",
      "artistas del Huila",
      "cantantes de Garzón Huila",
    ],
    eventExamples: [
      "Ferias y fiestas municipales",
      "Música en vivo para eventos privados",
      "Matrimonios y celebraciones",
      "Tarimas y festivales del Huila",
    ],
    faqs: [
      {
        question: "¿Qué artistas hay para música en vivo en Garzón, Huila?",
        answer:
          "Pipe Cumbe es uno de los artistas vallenatos originarios de Garzón, Huila, con propuesta de música en vivo (Vallenato XXI) para ferias, fiestas, matrimonios, parrandas y eventos privados y corporativos.",
      },
      {
        question: "¿Cómo contratar música en vivo en el Huila?",
        answer:
          "Escribe al WhatsApp oficial de Pipe Cumbe indicando fecha, ciudad, tipo de evento y número de asistentes para recibir disponibilidad y propuesta de show en vivo en el Huila.",
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
