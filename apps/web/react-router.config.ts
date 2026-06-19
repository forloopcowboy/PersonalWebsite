import type { Config } from "@react-router/dev/config";
import { projects } from "./app/lib/projects";

const locales = ["en-us", "pt-br"];

export default {
  ssr: true,
  async prerender() {
    return locales.flatMap((locale) => [
      `/${locale}`,
      `/${locale}/projects`,
      ...projects.map((p) => `/${locale}/projects/${p.slug}`),
    ]);
  },
} satisfies Config;
