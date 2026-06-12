import type { Metadata } from "next";
import { LocalSeoLanding } from "@/components/LocalSeoLanding";
import { localSeoPages } from "@/data/localSeo";
import { pageMetadata } from "@/lib/seo";

const page = localSeoPages.huila;

export const metadata: Metadata = pageMetadata({
  title: "Cantante Vallenato en Huila | Pipe Cumbe Oficial",
  description:
    "Contrata a Pipe Cumbe, cantante vallenato en Huila para ferias, fiestas, parrandas, matrimonios, eventos privados y corporativos.",
  path: page.slug,
});

export default function CantanteVallenatoHuilaPage() {
  return <LocalSeoLanding page={page} />;
}
