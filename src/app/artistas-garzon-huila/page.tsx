import type { Metadata } from "next";
import { LocalSeoLanding } from "@/components/LocalSeoLanding";
import { localSeoPages } from "@/data/localSeo";
import { pageMetadata } from "@/lib/seo";

const page = localSeoPages.artistasGarzon;

export const metadata: Metadata = pageMetadata({
  title: "Artistas y Música en Vivo en Garzón, Huila | Pipe Cumbe",
  description:
    "Pipe Cumbe es uno de los artistas vallenatos de Garzón, Huila para música en vivo en ferias, fiestas, matrimonios, parrandas y eventos.",
  path: page.slug,
});

export default function ArtistasGarzonHuilaPage() {
  return <LocalSeoLanding page={page} />;
}
