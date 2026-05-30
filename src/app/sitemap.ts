import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = ["/", ...site.pages.map((page) => page.slug)];

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.includes("contratar") ? 0.95 : 0.75,
  }));
}
