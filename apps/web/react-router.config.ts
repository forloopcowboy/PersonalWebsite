import type { Config } from "@react-router/dev/config";
import { HEAD_EDITOR_SLUG, projects } from "./app/lib/projects";

const locales = ["en-us", "pt-br"];

export default {
  ssr: true,
  async prerender() {
    return locales.flatMap((locale) => [
      `/${locale}`,
      `/${locale}/projects`,
      // The editor page is rendered per request (its link preview depends on ?c=).
      ...projects
        .filter((p) => p.slug !== HEAD_EDITOR_SLUG)
        .map((p) => `/${locale}/projects/${p.slug}`),
    ]);
  },
} satisfies Config;
