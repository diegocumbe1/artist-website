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

  videos: [
    { youtubeId: "b4Va4Zohs9Q", title: "La Fuga" },
    { youtubeId: "XvXnaZfjbOo", title: "Quiero Que Seas Mi Estrella (Live)" },
    { youtubeId: "pfQeG5PEut4", title: "Parranda, Ron y Mujer (Live)" },
  ],

  gallery: [
    { src: "/gallery/g2.jpg", alt: "Pipe Cumbe en tarima", width: 1600, height: 2000 },
    { src: "/gallery/g3.jpg", alt: "Pipe Cumbe en presentación", width: 1512, height: 2000 },
    { src: "/gallery/g4.jpg", alt: "Pipe Cumbe en concierto", width: 1324, height: 1952 },
    { src: "/gallery/g5.jpg", alt: "Pipe Cumbe cantando en vivo", width: 1600, height: 2000 },
    { src: "/gallery/g6.jpg", alt: "Pipe Cumbe en evento", width: 1600, height: 2000 },
    { src: "/gallery/g7.jpg", alt: "Pipe Cumbe con su agrupación", width: 1499, height: 2000 },
    { src: "/gallery/g1.jpg", alt: "Pipe Cumbe con la banda en vivo", width: 2000, height: 1635, featured: true },
  ] as GalleryItem[],
};

export type GalleryItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  featured?: boolean;
};

export type Site = typeof site;
