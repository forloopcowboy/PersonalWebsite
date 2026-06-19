import type { MDXContent } from "mdx/types";

import {
  getAdjacentProjects,
  getProjectBySlug,
  projects,
  type Project,
} from "./projects";

import NSideBody from "../content/projects/n-side.mdx";
import TrisBody from "../content/projects/tris.mdx";
import PayflipBody from "../content/projects/payflip.mdx";
import RecolonizerBody from "../content/projects/recolonizer.mdx";
import GluttonBody from "../content/projects/glutton-for-gluten.mdx";
import CowboyInvestorBody from "../content/projects/cowboy-investor.mdx";

const bodies: Record<string, MDXContent> = {
  "n-side": NSideBody,
  tris: TrisBody,
  payflip: PayflipBody,
  recolonizer: RecolonizerBody,
  "glutton-for-gluten": GluttonBody,
  "cowboy-investor": CowboyInvestorBody,
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
  const Body = bodies[slug];
  if (!metadata || !Body) return undefined;
  const { previous, next } = getAdjacentProjects(slug);
  return { metadata, previous, next };
}

export function getProjectBody(slug: string): MDXContent | undefined {
  return bodies[slug];
}

export function allProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
