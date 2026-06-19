// Datos del plan de promoción de Pipe Cumbe Oficial.
// Alimenta el módulo "Promoción" del backoffice: estrategia, calendario de 30
// días con copies listos y escenarios de presupuesto.
// Estrategia completa en docs/plan-seo-aeo-promocion-pipe-cumbe.md.

export const marketingObjective =
  "Superar en posicionamiento a los grupos vallenatos de la región (incluido el competidor que hoy aparece más por su volumen en redes) ganando frescura, menciones de marca y leads de contratación por WhatsApp.";

// Por qué el competidor aparece más: volumen y constancia de publicaciones.
// Estas metas atacan justamente esa brecha.
export const marketingGoals: {
  label: string;
  target: string;
  how: string;
}[] = [
  {
    label: "Volumen de contenido",
    target: "3 reels + 5 historias por semana",
    how: "Igualar y superar la frecuencia del competidor. Google e Instagram premian las cuentas activas y frescas.",
  },
  {
    label: "Búsquedas de marca",
    target: '+50 búsquedas/mes de "Pipe Cumbe" y "Vallenato XXI"',
    how: "Cada pieza menciona la marca y pide buscar en Google. Más búsquedas de nombre = entidad más fuerte para Google.",
  },
  {
    label: "Leads por WhatsApp",
    target: "15 a 40 conversaciones de contratación/mes",
    how: "Todo CTA lleva a WhatsApp con mensaje prellenado. Medir clics desde bio, reels e historias.",
  },
  {
    label: "Autoridad local (Maps)",
    target: "Perfil de Google Business activo y reseñado",
    how: 'Aparecer en "música en vivo Garzón / Huila" y en Maps. Es la victoria más rápida frente a la competencia local.',
  },
  {
    label: "YouTube",
    target: "1 video nuevo por semana con título SEO",
    how: "YouTube es el 2º buscador y refuerza la autoridad de la marca y los videos del sitio.",
  },
];

// Cómo superar a "Vallenato Sin Límite" y demás grupos locales en la búsqueda y
// en el AI Overview de Google. Aprendido de cómo ellos rankean hoy (jun 2026):
// su nombre y bio en Facebook/Instagram incluyen "Garzón Huila" literal, y la IA
// copia esas descripciones. Pipe Cumbe tiene una ventaja que ellos NO: web oficial.
export const competitiveMoves: {
  move: string;
  action: string;
  why: string;
  priority: "Alta" | "Media";
}[] = [
  {
    move: "Meter 'Garzón, Huila' en el nombre visible",
    action:
      "Cambiar el nombre de perfil (no el @) de Instagram y Facebook a: \"Pipe Cumbe | Vallenato XXI · Garzón, Huila\". Así aparece en búsquedas con ubicación.",
    why: "El competidor gana porque su handle es @vallenatosinlimite_garzonhuila: la IA asocia su marca a Garzón al instante. Hoy @pipecumbe no dice dónde es.",
    priority: "Alta",
  },
  {
    move: "Página de Facebook activa y local",
    action:
      "Tener/activar la página de Facebook como 'Pipe Cumbe - Vallenato XXI Garzón, Huila' con descripción tipo \"La parranda y el parrandón vallenato de Garzón, Huila. Contrataciones: WhatsApp 3142653942\".",
    why: "El AI Overview cita Facebook como fuente #1 y toma la descripción casi literal. El competidor usa 'La mejor parranda de Garzon Huila'. Hay que darle a Google esa misma frase pero con tu marca.",
    priority: "Alta",
  },
  {
    move: "Reclamar la frase de territorio",
    action:
      "Repetir en bios, posts y descripciones de YouTube: \"Vallenato XXI, la parranda de Garzón, Huila\" y \"parrandón vallenato en Garzón\". Misma frase, muchas veces.",
    why: "La IA arma su respuesta con las frases que más se repiten en fuentes oficiales. Si tú repites 'parrandón de Garzón', te pone a ti en esa lista.",
    priority: "Alta",
  },
  {
    move: "Google Business Profile en Garzón",
    action:
      "Crear el perfil de empresa en Google (categoría Músico/Artista, zona Garzón–Huila, fotos, teléfono igual al de la web).",
    why: "Aparece en Maps y en 'música en vivo Garzón'. Es una señal local fuerte que los grupos de solo-redes normalmente NO tienen: ventaja directa para Pipe.",
    priority: "Alta",
  },
  {
    move: "Usar tu ventaja: web oficial",
    action:
      "Enlazar pipecumbeoficial.com desde TODAS las redes (bio IG, Facebook, YouTube). Mencionar 'sitio web oficial' en los posts.",
    why: "Pipe tiene web con datos estructurados; los grupos en solo Instagram/Facebook no. Una web oficial le da a Google una entidad más confiable y completa que la del competidor.",
    priority: "Media",
  },
  {
    move: "Ganar en volumen y prueba social",
    action:
      "Publicar más seguido que ellos (3 reels + historias diarias) y pedir reseñas/testimonios. Su Facebook tiene ~650 seguidores y poco engagement: es superable.",
    why: "Google premia la cuenta más fresca y activa. Más publicaciones recientes + más interacción = la marca se ve más viva y relevante que la del competidor.",
    priority: "Media",
  },
];

export const contentPillars: { name: string; share: string; note: string }[] = [
  { name: "Prueba social", share: "40%", note: "Show en vivo, público, parrandas, energía real de tarima." },
  { name: "Conversión", share: "25%", note: "Habla directo a quien contrata: ferias, matrimonios, eventos." },
  { name: "Autoridad / marca", share: "20%", note: "Vallenato XXI, historia, repertorio, prensa, Garzón-Huila." },
  { name: "Cercanía", share: "15%", note: "Detrás de cámara, equipo, humor, testimonios de clientes." },
];

export const weeklyPlan: {
  week: string;
  theme: string;
  focus: string;
  deliverables: string[];
}[] = [
  {
    week: "Semana 1",
    theme: "Base y consistencia",
    focus: "Activar marca y dejar todo listo para captar leads.",
    deliverables: [
      "Crear/optimizar Google Business Profile (Garzón, Huila).",
      "Actualizar bio de Instagram con CTA y link a pipecumbeoficial.com.",
      "3 reels: 1 en vivo, 1 de público, 1 hablando a quien contrata.",
      "Historias diarias: show, booking, videos, prensa.",
    ],
  },
  {
    week: "Semana 2",
    theme: "Prueba social",
    focus: "Demostrar energía real y testimonios para generar confianza.",
    deliverables: [
      "3 reels con momentos fuertes de parranda y público cantando.",
      "1 carrusel de tipos de evento (ferias, matrimonios, parrandas).",
      "Pedir y publicar 1 testimonio de cliente.",
      "Subir 1 video a YouTube con título SEO.",
    ],
  },
  {
    week: "Semana 3",
    theme: "Autoridad en Google e IA",
    focus: "Reforzar la entidad de marca Vallenato XXI en buscadores.",
    deliverables: [
      "Reel explicando qué es el Vallenato XXI (enlazar /vallenato-xxi).",
      "Carrusel: ciudades donde se ha presentado (Garzón, Neiva, Huila).",
      "Publicar página de prensa y compartirla.",
      "Pedir al público que busque 'Pipe Cumbe' en Google.",
    ],
  },
  {
    week: "Semana 4",
    theme: "Captura de leads",
    focus: "Convertir el alcance en conversaciones de contratación.",
    deliverables: [
      "3 reels con CTA fuerte a WhatsApp y oferta clara.",
      "Historia con encuesta: '¿Para qué evento contratarías vallenato?'.",
      "Responder todos los DMs y comentarios con CTA natural.",
      "Reporte: clics a WhatsApp, leads por ciudad, cierres.",
    ],
  },
];

const baseTags = ["#PipeCumbe", "#VallenatoXXI", "#Vallenato"];
const localTags = ["#Garzon", "#Huila", "#Neiva", "#Colombia"];
const liveTags = ["#VallenatoEnVivo", "#MusicaEnVivo", "#ParrandaVallenata"];
const eventTags = ["#Eventos", "#Matrimonios", "#FeriasYFiestas", "#Parrandon"];

export type CalendarDay = {
  day: number;
  weekday: string;
  channel: string;
  format: string;
  pillar: string;
  idea: string;
  copy: string;
  hashtags: string[];
  cta: string;
};

export const contentCalendar: CalendarDay[] = [
  // ── Semana 1 ──
  {
    day: 1,
    weekday: "Lunes",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Prueba social",
    idea: "Momento más fuerte de un show en vivo (15-20s, corte rápido al subir el ánimo).",
    copy: "Así se vive el Vallenato XXI en vivo 🔥 ¿Listo para que la parranda llegue a tu evento? Escríbenos por WhatsApp.",
    hashtags: [...baseTags, ...liveTags, ...localTags],
    cta: "WhatsApp: contratar para evento",
  },
  {
    day: 2,
    weekday: "Martes",
    channel: "Instagram (Historias)",
    format: "Historia",
    pillar: "Cercanía",
    idea: "Detrás de cámara: montaje, prueba de sonido o el equipo llegando al evento.",
    copy: "Preparando otra parranda 🎶 Disponibles para tu feria, fiesta o matrimonio.",
    hashtags: [...baseTags, ...localTags],
    cta: "Sticker de link a pipecumbeoficial.com",
  },
  {
    day: 3,
    weekday: "Miércoles",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Conversión",
    idea: "Pipe hablando directo a cámara: 'Si estás organizando un evento en el Huila...'.",
    copy: "¿Organizas un evento en Garzón, Neiva o el Huila? Llevamos el show vallenato completo. Cotiza por WhatsApp 👇",
    hashtags: [...baseTags, ...eventTags, ...localTags],
    cta: "WhatsApp: cotizar show",
  },
  {
    day: 4,
    weekday: "Jueves",
    channel: "Instagram + Facebook",
    format: "Carrusel",
    pillar: "Autoridad / marca",
    idea: "5 slides: tipos de evento que cubre Pipe Cumbe (ferias, matrimonios, parrandas, corporativos, festivales).",
    copy: "Un show, todos los eventos. Pipe Cumbe lleva el Vallenato XXI donde tú lo necesites.",
    hashtags: [...baseTags, ...eventTags],
    cta: "Comenta 'INFO' y te escribimos",
  },
  {
    day: 5,
    weekday: "Viernes",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Prueba social",
    idea: "Público cantando/coreando en una parranda. Audio real del momento.",
    copy: "Cuando la gente canta más fuerte que el artista, sabes que la parranda está completa 🙌",
    hashtags: [...baseTags, ...liveTags, "#Parrandon"],
    cta: "WhatsApp: lleva la parranda a tu evento",
  },
  {
    day: 6,
    weekday: "Sábado",
    channel: "Instagram (Historias)",
    format: "Historia",
    pillar: "Prueba social",
    idea: "Cobertura en vivo del show del fin de semana (3-4 clips seguidos).",
    copy: "En vivo 🔴 Vallenato XXI esta noche.",
    hashtags: [...baseTags, ...liveTags],
    cta: "Sticker de ubicación + link",
  },
  {
    day: 7,
    weekday: "Domingo",
    channel: "YouTube",
    format: "Video",
    pillar: "Autoridad / marca",
    idea: "Subir clip en vivo. Título SEO: 'Pipe Cumbe - Parrandón Vallenato en vivo | Garzón, Huila'.",
    copy: "Descripción con bio corta, link al sitio, Instagram y WhatsApp de contratación.",
    hashtags: [...baseTags, ...liveTags, ...localTags],
    cta: "Link a pipecumbeoficial.com en descripción",
  },
  // ── Semana 2 ──
  {
    day: 8,
    weekday: "Lunes",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Prueba social",
    idea: "Mosaico de 3-4 shows distintos en 1 reel rápido al ritmo de la canción.",
    copy: "De feria en feria, de parranda en parranda. Esto es Vallenato XXI 🎺",
    hashtags: [...baseTags, ...liveTags, ...localTags],
    cta: "WhatsApp: consulta disponibilidad",
  },
  {
    day: 9,
    weekday: "Martes",
    channel: "Instagram (Historias)",
    format: "Historia",
    pillar: "Conversión",
    idea: "Encuesta: '¿Qué evento estás organizando?' (Matrimonio / Feria / Cumpleaños / Empresa).",
    copy: "Cuéntanos tu evento y te armamos la propuesta 👇",
    hashtags: [...baseTags],
    cta: "Sticker de pregunta + link WhatsApp",
  },
  {
    day: 10,
    weekday: "Miércoles",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Conversión",
    idea: "'3 razones para contratar vallenato en vivo para tu matrimonio' (texto en pantalla).",
    copy: "Tu matrimonio merece sentimiento de verdad. Vallenato en vivo con Pipe Cumbe ❤️",
    hashtags: [...baseTags, "#Matrimonios", "#BodasColombia", ...localTags],
    cta: "WhatsApp: cotiza tu matrimonio",
  },
  {
    day: 11,
    weekday: "Jueves",
    channel: "Instagram + Facebook",
    format: "Carrusel",
    pillar: "Autoridad / marca",
    idea: "Repertorio: portadas/nombres de las canciones más pedidas en vivo.",
    copy: "Estas son las que no pueden faltar en la parranda. ¿Cuál es tu favorita?",
    hashtags: [...baseTags, ...liveTags],
    cta: "Comenta tu canción favorita",
  },
  {
    day: 12,
    weekday: "Viernes",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Prueba social",
    idea: "Testimonio de un cliente (video corto o texto sobre clip del evento).",
    copy: "Gracias por confiar en nosotros para un día tan especial 🙌 ¿El próximo evento es el tuyo?",
    hashtags: [...baseTags, ...eventTags],
    cta: "WhatsApp: reserva tu fecha",
  },
  {
    day: 13,
    weekday: "Sábado",
    channel: "Instagram (Historias)",
    format: "Historia",
    pillar: "Prueba social",
    idea: "Cobertura en vivo del show + repost de quien etiquete.",
    copy: "Otra noche de Vallenato XXI 🔥",
    hashtags: [...baseTags, ...liveTags],
    cta: "Repostear etiquetas del público",
  },
  {
    day: 14,
    weekday: "Domingo",
    channel: "YouTube",
    format: "Video",
    pillar: "Autoridad / marca",
    idea: "Subir 'Pipe Cumbe - Mosaico Romántico (Live) | Vallenato XXI'.",
    copy: "Descripción optimizada con ciudades, tipos de evento y WhatsApp.",
    hashtags: [...baseTags, ...liveTags],
    cta: "Link al sitio y WhatsApp en descripción",
  },
  // ── Semana 3 ──
  {
    day: 15,
    weekday: "Lunes",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Autoridad / marca",
    idea: "'¿Qué es el Vallenato XXI?' — Pipe lo explica en 20s. Enlazar página /vallenato-xxi.",
    copy: "Vallenato con raíz y energía nueva. Eso es el Vallenato XXI. Conócelo en pipecumbeoficial.com",
    hashtags: [...baseTags, "#Vallenato21", ...localTags],
    cta: "Link en bio: /vallenato-xxi",
  },
  {
    day: 16,
    weekday: "Martes",
    channel: "Instagram (Historias)",
    format: "Historia",
    pillar: "Autoridad / marca",
    idea: "Pedir al público: 'Busca Pipe Cumbe en Google' (screenshot del resultado).",
    copy: "¿Ya nos buscaste en Google? 😎 Busca 'Pipe Cumbe' y mira lo que aparece.",
    hashtags: [...baseTags],
    cta: "Sticker de link a Google/sitio",
  },
  {
    day: 17,
    weekday: "Miércoles",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Conversión",
    idea: "'Parrandón vallenato para tu cumpleaños' — clip de parranda cercana.",
    copy: "Un parrandón vallenato en vivo convierte cualquier cumpleaños en leyenda 🎂🎶",
    hashtags: [...baseTags, "#Parrandon", "#Cumpleaños", ...localTags],
    cta: "WhatsApp: arma tu parrandón",
  },
  {
    day: 18,
    weekday: "Jueves",
    channel: "Instagram + Facebook",
    format: "Carrusel",
    pillar: "Autoridad / marca",
    idea: "Ciudades donde se ha presentado (mapa o lista visual): Garzón, Neiva, Huila, etc.",
    copy: "De Garzón para Colombia. ¿En qué ciudad nos quieres ver?",
    hashtags: [...baseTags, ...localTags],
    cta: "Comenta tu ciudad",
  },
  {
    day: 19,
    weekday: "Viernes",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Prueba social",
    idea: "Antes/después: tarima vacía → tarima encendida con público.",
    copy: "Así transformamos cualquier evento 🔥 Energía de tarima de principio a fin.",
    hashtags: [...baseTags, ...liveTags],
    cta: "WhatsApp: lleva esta energía a tu evento",
  },
  {
    day: 20,
    weekday: "Sábado",
    channel: "Instagram (Historias)",
    format: "Historia",
    pillar: "Prueba social",
    idea: "Cobertura en vivo + destacar historia 'Shows'.",
    copy: "Vallenato XXI en vivo esta noche 🎤",
    hashtags: [...baseTags, ...liveTags],
    cta: "Guardar en destacados 'Shows'",
  },
  {
    day: 21,
    weekday: "Domingo",
    channel: "YouTube + Sitio",
    format: "Video / Prensa",
    pillar: "Autoridad / marca",
    idea: "Publicar/compartir página de prensa y subir 1 video con título SEO local.",
    copy: "Toda la info oficial de Pipe Cumbe en un solo lugar: prensa, fotos y contacto.",
    hashtags: [...baseTags, ...localTags],
    cta: "Link a /prensa y WhatsApp",
  },
  // ── Semana 4 ──
  {
    day: 22,
    weekday: "Lunes",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Conversión",
    idea: "Oferta clara: 'Agenda tu fecha de diciembre/temporada' (urgencia real).",
    copy: "Las mejores fechas se agendan primero 📅 Asegura tu evento con Vallenato XXI.",
    hashtags: [...baseTags, ...eventTags, ...localTags],
    cta: "WhatsApp: aparta tu fecha",
  },
  {
    day: 23,
    weekday: "Martes",
    channel: "Instagram (Historias)",
    format: "Historia",
    pillar: "Conversión",
    idea: "Caja de preguntas: 'Pregúntame lo que sea sobre contratar el show'.",
    copy: "¿Dudas para contratar? Pregúntanos aquí 👇",
    hashtags: [...baseTags],
    cta: "Sticker de preguntas",
  },
  {
    day: 24,
    weekday: "Miércoles",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Prueba social",
    idea: "Compilado de público feliz/abrazos/celebración (cierre emotivo).",
    copy: "Esto es lo que de verdad nos mueve: gente feliz y parranda buena ❤️",
    hashtags: [...baseTags, ...liveTags],
    cta: "WhatsApp: tu evento es el próximo",
  },
  {
    day: 25,
    weekday: "Jueves",
    channel: "Instagram + Facebook",
    format: "Carrusel",
    pillar: "Conversión",
    idea: "'Cómo contratar a Pipe Cumbe en 3 pasos' (fecha → ciudad → WhatsApp).",
    copy: "Contratar es fácil: dinos fecha, ciudad y tipo de evento. Nosotros hacemos el resto.",
    hashtags: [...baseTags, ...eventTags],
    cta: "WhatsApp: empieza aquí",
  },
  {
    day: 26,
    weekday: "Viernes",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Prueba social",
    idea: "Reel rápido de la semana: lo mejor de los shows recientes.",
    copy: "Resumen de la semana 🔥 ¿Quién sigue? Tu evento puede ser el próximo.",
    hashtags: [...baseTags, ...liveTags, ...localTags],
    cta: "WhatsApp: consulta disponibilidad",
  },
  {
    day: 27,
    weekday: "Sábado",
    channel: "Instagram (Historias)",
    format: "Historia",
    pillar: "Prueba social",
    idea: "Cobertura en vivo del show.",
    copy: "En vivo 🔴 cerrando el mes con todo.",
    hashtags: [...baseTags, ...liveTags],
    cta: "Link a WhatsApp",
  },
  {
    day: 28,
    weekday: "Domingo",
    channel: "YouTube",
    format: "Video",
    pillar: "Autoridad / marca",
    idea: "Subir video del mejor show del mes con título SEO.",
    copy: "Descripción con bio, ciudades, tipos de evento y contacto.",
    hashtags: [...baseTags, ...liveTags],
    cta: "Link al sitio y WhatsApp",
  },
  {
    day: 29,
    weekday: "Lunes",
    channel: "Instagram + Facebook",
    format: "Reel",
    pillar: "Conversión",
    idea: "Llamado final del mes: oferta/disponibilidad + recordar marca.",
    copy: "¿Tu evento necesita vallenato de verdad? Vallenato XXI. Escríbenos hoy 👇",
    hashtags: [...baseTags, ...eventTags, ...localTags],
    cta: "WhatsApp: contratar ahora",
  },
  {
    day: 30,
    weekday: "Martes",
    channel: "Interno",
    format: "Reporte",
    pillar: "Medición",
    idea: "Revisar métricas del mes: clics a WhatsApp, leads por ciudad, alcance, cierres.",
    copy: "Cierre del mes: ¿qué contenido trajo más leads? Doblar lo que funcionó.",
    hashtags: [],
    cta: "Definir plan del mes siguiente",
  },
];

export type BudgetTier = {
  name: string;
  range: string;
  when: string;
  items: { label: string; amount: string }[];
  expected: string;
  recommended?: boolean;
};

export const budgetTiers: BudgetTier[] = [
  {
    name: "Orgánico (Mes 1)",
    range: "$0 / mes",
    when: "Empezar aquí. Antes de pagar pauta hay que tener contenido y medición.",
    items: [
      { label: "Contenido grabado con celular", amount: "$0" },
      { label: "Google Business Profile", amount: "$0" },
      { label: "Tiempo de community (propio)", amount: "Incluido" },
    ],
    expected:
      "Base de contenido, primeros leads orgánicos, autoridad inicial y perfil en Maps activo.",
  },
  {
    name: "Arranque",
    range: "$400.000 – $800.000 / mes",
    when: "Cuando ya hay 30 días de contenido y WhatsApp con respuestas listas.",
    recommended: true,
    items: [
      { label: "Pauta Meta — mensajes WhatsApp (~$10.000/día)", amount: "$300.000" },
      { label: "Edición/diseño de reels", amount: "$150.000" },
      { label: "Sesión foto/video mensual (opcional)", amount: "$250.000" },
    ],
    expected:
      "15 a 40 conversaciones de contratación al mes y alcance local fuerte en Garzón, Neiva y Huila.",
  },
  {
    name: "Crecimiento",
    range: "$1.500.000 – $3.000.000 / mes",
    when: "Cuando los leads se cierran bien y se quiere dominar la región.",
    items: [
      { label: "Meta Ads (mensajes + alcance)", amount: "$900.000" },
      { label: "Google Ads búsqueda ('contratar cantante vallenato')", amount: "$600.000" },
      { label: "Producción audiovisual profesional (1 video)", amount: "$700.000" },
      { label: "Herramientas, landing y medición", amount: "$100.000" },
    ],
    expected:
      "Cobertura regional, flujo constante de leads y posicionamiento por encima de la competencia.",
  },
];
