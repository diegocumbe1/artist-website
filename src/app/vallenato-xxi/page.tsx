import type { Metadata } from "next";
import { LocalSeoLanding } from "@/components/LocalSeoLanding";
import { localSeoPages } from "@/data/localSeo";
import { pageMetadata } from "@/lib/seo";

const page = localSeoPages.vallenatoXxi;

export const metadata: Metadata = pageMetadata({
  title: "Vallenato XXI | La Propuesta de Pipe Cumbe Oficial",
  description:
    "Vallenato XXI (Vallenato 21) es la propuesta de Pipe Cumbe: vallenato tradicional con energía moderna para parrandas, eventos y shows en vivo en Huila y Colombia.",
  path: page.slug,
});

export default function VallenatoXxiPage() {
  return <LocalSeoLanding page={page} />;
}
