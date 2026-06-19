import type { Config } from "@react-router/dev/config";
import { projects } from "./app/lib/projects";

export default {
  ssr: true,
  /**
   * React Router 7 analogue of Next.js `generateStaticParams`. Pre-renders the
   * projects index and one HTML file per project slug at build time.
   */
  async prerender() {
    return [
      "/",
      "/projects",
      ...projects.map((p) => `/projects/${p.slug}`),
    ];
  },
} satisfies Config;
