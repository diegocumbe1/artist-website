import type { Metadata } from "next";
import { LocalSeoLanding } from "@/components/LocalSeoLanding";
import { localSeoPages } from "@/data/localSeo";
import { pageMetadata } from "@/lib/seo";

const page = localSeoPages.eventos;

export const metadata: Metadata = pageMetadata({
  title: "Grupo Vallenato para Eventos | Pipe Cumbe Oficial",
  description:
    "Show y grupo vallenato para eventos en Colombia con Pipe Cumbe: ferias, fiestas, matrimonios, eventos corporativos y parrandas.",
  path: page.slug,
});

export default function GrupoVallenatoParaEventosPage() {
  return <LocalSeoLanding page={page} />;
}
