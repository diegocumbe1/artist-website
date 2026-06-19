import type { Metadata } from "next";
import { LocalSeoLanding } from "@/components/LocalSeoLanding";
import { localSeoPages } from "@/data/localSeo";
import { pageMetadata } from "@/lib/seo";

const page = localSeoPages.parrandon;

export const metadata: Metadata = pageMetadata({
  title: "Parrandón Vallenato en Garzón y Huila | Pipe Cumbe",
  description:
    "Contrata a Pipe Cumbe para un parrandón vallenato en vivo en Garzón, Huila y Colombia: parrandas, cumpleaños, matrimonios y celebraciones privadas.",
  path: page.slug,
});

export default function ParrandonVallenatoPage() {
  return <LocalSeoLanding page={page} />;
}
