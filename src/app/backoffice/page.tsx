import type { Metadata } from "next";
import { BackofficeApp } from "@/components/backoffice/BackofficeApp";

export const metadata: Metadata = {
  title: "Backoffice | Pipe Cumbe",
  description: "Panel privado para contrataciones, calendario y operación.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BackofficePage() {
  return <BackofficeApp />;
}
