import type { Metadata } from "next";
import { LocalSeoLanding } from "@/components/LocalSeoLanding";
import { localSeoPages } from "@/data/localSeo";
import { pageMetadata } from "@/lib/seo";

const page = localSeoPages.neiva;

export const metadata: Metadata = pageMetadata({
  title: "Cantante Vallenato en Neiva | Pipe Cumbe Oficial",
  description:
    "Pipe Cumbe ofrece show vallenato en vivo en Neiva para eventos privados, empresas, matrimonios, ferias, fiestas y festivales.",
  path: page.slug,
});

export default function CantanteVallenatoNeivaPage() {
  return <LocalSeoLanding page={page} />;
}
