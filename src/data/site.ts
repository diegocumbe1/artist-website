export const site = {
  artistName: "Pipe Cumbe",
  tagline: "Vallenato XXI · Con todos los poderes",
  shortDescription:
    "Artista colombiano de vallenato. Una voz fresca que conecta la tradición con las nuevas generaciones.",

  bio: [
    "Pipe Cumbe es un artista colombiano que está llevando el vallenato a una nueva generación. Con una propuesta fresca, presencia escénica contundente y un repertorio que mezcla tradición y modernidad, se ha consolidado como una de las voces emergentes del género.",
    "Su música combina la fuerza del vallenato XXI con un estilo personal, energía en tarima y conexión directa con su público. Cada show es una celebración: parranda, sentimiento y poder vocal en partes iguales.",
  ],

  contact: {
    bookingPhone: "3192316934",
    bookingWhatsapp:
      "https://wa.me/573192316934?text=Hola%20Pipe%2C%20me%20interesa%20contratarte%20para%20un%20evento",
    email: "",
  },

  social: {
    instagram: "https://www.instagram.com/pipecumbe/",
    youtube: "https://www.youtube.com/@pipecumbe",
    tiktok: "",
    facebook: "",
    spotify: "",
    appleMusic: "",
  },

  heroImage: {
    src: "/hero/pipe-stage.jpg",
    alt: "Pipe Cumbe cantando en tarima",
  },

  featuredVideo: {
    youtubeId: "b4Va4Zohs9Q",
    title: "Video destacado",
  },

  gallery: [
    { src: "/gallery/1.jpg", alt: "Pipe Cumbe en tarima" },
    { src: "/gallery/2.jpg", alt: "Pipe Cumbe en estudio" },
    { src: "/gallery/3.jpg", alt: "Pipe Cumbe en concierto" },
    { src: "/gallery/4.jpg", alt: "Pipe Cumbe con su agrupación" },
    { src: "/gallery/5.jpg", alt: "Pipe Cumbe presentación" },
    { src: "/gallery/6.jpg", alt: "Pipe Cumbe backstage" },
  ],
};

export type Site = typeof site;
