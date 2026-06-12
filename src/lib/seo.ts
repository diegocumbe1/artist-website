import type { Metadata } from "next";
import { site } from "@/data/site";

const ogImage = {
  path: "/og/pipe-cumbe-og.webp",
  width: 1200,
  height: 630,
  alt: "Pipe Cumbe cantante vallenato para eventos en Huila y Colombia",
};

export function absoluteUrl(path = "") {
  return new URL(path, site.siteUrl).toString();
}

export function pageMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: site.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "es_CO",
      siteName: site.legalName,
      images: [
        {
          url: absoluteUrl(ogImage.path),
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(ogImage.path)],
    },
  };
}

export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function artistJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Person", "MusicGroup"],
    "@id": absoluteUrl("/#artist"),
    name: site.artistName,
    alternateName: [site.realName, site.legalName],
    birthName: site.realName,
    url: site.siteUrl,
    image: absoluteUrl(site.heroImage.src),
    description: site.entityDescription,
    genre: ["Vallenato", "Música colombiana"],
    areaServed: ["Garzón", "Huila", "Neiva", "Colombia", "Latinoamérica"],
    homeLocation: {
      "@type": "Place",
      name: site.birthPlace,
    },
    birthPlace: {
      "@type": "Place",
      name: site.birthPlace,
    },
    knowsAbout: [
      "cantante vallenato",
      "parranda vallenata",
      "show vallenato en vivo",
      "vallenato para eventos",
      "ferias y fiestas",
    ],
    sameAs: [
      site.social.instagram,
      site.social.youtube,
      site.social.tiktok,
      site.social.facebook,
      site.social.spotify,
      site.social.appleMusic,
    ].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+57${site.contact.bookingPhone}`,
      contactType: "booking",
      areaServed: "CO",
      availableLanguage: ["Spanish"],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: site.legalName,
    alternateName: site.artistName,
    url: site.siteUrl,
    logo: absoluteUrl("/og/pipe-cumbe-og.webp"),
    image: absoluteUrl(site.heroImage.src),
    description: site.entityDescription,
    areaServed: ["Huila", "Garzón", "Neiva", "Colombia"],
    sameAs: [
      site.social.instagram,
      site.social.youtube,
      site.social.tiktok,
      site.social.facebook,
      site.social.spotify,
      site.social.appleMusic,
    ].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: `+57${site.contact.bookingPhone}`,
      contactType: "booking",
      areaServed: "CO",
      availableLanguage: ["es"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.legalName,
    alternateName: site.artistName,
    url: site.siteUrl,
    inLanguage: "es-CO",
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    about: {
      "@id": absoluteUrl("/#artist"),
    },
  };
}

export function bookingServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl("/contratar-cantante-vallenato#service"),
    name: "Show vallenato en vivo de Pipe Cumbe",
    serviceType: "Cantante vallenato para eventos",
    provider: {
      "@id": absoluteUrl("/#artist"),
    },
    areaServed: site.cities,
    audience: {
      "@type": "Audience",
      audienceType:
        "Organizadores de eventos, empresas, alcaldías, familias y parejas",
    },
    description: site.bookingDescription,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: absoluteUrl("/contratar-cantante-vallenato"),
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function imagesJsonLd() {
  return site.gallery.map((image) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: image.alt,
    caption: image.alt,
    contentUrl: absoluteUrl(image.src),
    width: image.width,
    height: image.height,
    representativeOfPage: Boolean(image.featured),
  }));
}

export function videosJsonLd() {
  return site.videos.map((video) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${video.title} - ${site.artistName}`,
    description: `Video oficial de ${site.artistName}: ${video.title}.`,
    thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
  }));
}

export function faqJsonLd(faqs = site.faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
