import type { Metadata } from "next";
import { LocalSeoLanding } from "@/components/LocalSeoLanding";
import { localSeoPages } from "@/data/localSeo";
import { pageMetadata } from "@/lib/seo";

const page = localSeoPages.garzon;

export const metadata: Metadata = pageMetadata({
  title: "Cantante Vallenato en Garzón | Pipe Cumbe Oficial",
  description:
    "Show vallenato en vivo en Garzón, Huila con Pipe Cumbe para eventos, parrandas vallenatas, matrimonios, ferias y celebraciones.",
  path: page.slug,
});

export default function CantanteVallenatoGarzonPage() {
  return <LocalSeoLanding page={page} />;
}
