import type { MDXContent } from "mdx/types";

import {
  getAdjacentProjects,
  getProjectBySlug,
  projects,
  type Project,
} from "./projects";

import NSideBodyEn from "../content/projects/en-us/n-side.mdx";
import TrisBodyEn from "../content/projects/en-us/tris.mdx";
import PayflipBodyEn from "../content/projects/en-us/payflip.mdx";
import RecolonizerBodyEn from "../content/projects/en-us/recolonizer.mdx";
import GluttonBodyEn from "../content/projects/en-us/glutton-for-gluten.mdx";
import CowboyInvestorBodyEn from "../content/projects/en-us/cowboy-investor.mdx";

import NSideBodyPt from "../content/projects/pt-br/n-side.mdx";
import TrisBodyPt from "../content/projects/pt-br/tris.mdx";
import PayflipBodyPt from "../content/projects/pt-br/payflip.mdx";
import RecolonizerBodyPt from "../content/projects/pt-br/recolonizer.mdx";
import GluttonBodyPt from "../content/projects/pt-br/glutton-for-gluten.mdx";
import CowboyInvestorBodyPt from "../content/projects/pt-br/cowboy-investor.mdx";

type BodyMap = Record<string, MDXContent>;

const bodies: Record<string, BodyMap> = {
  "en-us": {
    "n-side": NSideBodyEn,
    tris: TrisBodyEn,
    payflip: PayflipBodyEn,
    recolonizer: RecolonizerBodyEn,
    "glutton-for-gluten": GluttonBodyEn,
    "cowboy-investor": CowboyInvestorBodyEn,
  },
  "pt-br": {
    "n-side": NSideBodyPt,
    tris: TrisBodyPt,
    payflip: PayflipBodyPt,
    recolonizer: RecolonizerBodyPt,
    "glutton-for-gluten": GluttonBodyPt,
    "cowboy-investor": CowboyInvestorBodyPt,
  },
};

export interface ProjectPage {
  metadata: Project;
  previous?: Project;
  next?: Project;
}

/**
 * Loader-side: returns only JSON-serializable metadata (slug, prev, next).
 * The MDX component is resolved separately by `getProjectBody` in the
 * rendering component, because React components can't cross the loader →
 * client boundary.
 */
export function getProject(slug: string): ProjectPage | undefined {
  const metadata = getProjectBySlug(slug);
  if (!metadata) return undefined;
  const hasBody = Object.values(bodies).some((m) => slug in m);
  if (!hasBody) return undefined;
  const { previous, next } = getAdjacentProjects(slug);
  return { metadata, previous, next };
}

export function getProjectBody(
  slug: string,
  locale: string = "en-us",
): MDXContent | undefined {
  return bodies[locale]?.[slug] ?? bodies["en-us"]?.[slug];
}

export function allProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
