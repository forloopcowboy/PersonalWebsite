/**
 * Source of truth for the projects index. Body content lives next to this file
 * as MDX under `app/content/projects/{slug}.mdx`. Keep this file metadata-only.
 */

export interface ProjectLink {
  label: string;
  href: string;
}

interface ProjectBase {
  slug: string;
  role: string;
  excerpt: string;
  link: ProjectLink;
}

export interface ProfessionalProject extends ProjectBase {
  kind: "professional";
  company: string;
  years: string;
}

export interface PersonalProject extends ProjectBase {
  kind: "personal";
  title: string;
  years?: string;
}

export type Project = ProfessionalProject | PersonalProject;

export const projects: readonly Project[] = [
  {
    slug: "n-side",
    kind: "professional",
    company: "N-SIDE",
    role: "Founding-team software engineer, Lighthouse",
    years: "2020-2024",
    excerpt:
      "Founding-team engineer on Lighthouse, modernizing N-SIDE's legacy Java stack into a new clinical trial supply planning platform.",
    link: {
      label: "Lighthouse brochure (PDF)",
      href: "https://cms.n-side.com/files/uploads/2025/07/N-SIDE_Lighthouse_Brochure.pdf",
    },
  },
  {
    slug: "tris",
    kind: "professional",
    company: "TRIS",
    role: "Founding engineer / CTO",
    years: "2025-2026",
    excerpt:
      "Bootstrapped a geospatial analysis tool democratizing carbon-credit access for Brazilian farmers and landowners.",
    link: { label: "tris.earth", href: "https://www.tris.earth/" },
  },
  {
    slug: "payflip",
    kind: "professional",
    company: "Payflip",
    role: "Senior Engineer",
    years: "2025-present",
    excerpt:
      "Building unified card payment infrastructure for Belgian cafeteria-plan benefits and salary transparency.",
    link: { label: "payflip.be", href: "https://payflip.be/en/" },
  },
  {
    slug: "recolonizer",
    kind: "personal",
    title: "Recolonizer",
    role: "Solo dev",
    excerpt: "Tower defense built in Unity.",
    link: {
      label: "Play on itch.io",
      href: "https://forloopcowboy.itch.io/recolonizer",
    },
  },
  {
    slug: "glutton-for-gluten",
    kind: "personal",
    title: "Glutton for Gluten",
    role: "Game jam – Lead programmer",
    excerpt: "Platformer built during a game jam.",
    link: {
      label: "Play on itch.io",
      href: "https://forloopcowboy.itch.io/glutton-for-gluten",
    },
  },
  {
    slug: "cowboy-investor",
    kind: "personal",
    title: "Cowboy Investor",
    role: "Solo build / Vibe coder",
    excerpt:
      "An LLM wrapper offering opinionated, experimental investment advice.",
    link: {
      label: "invest.forloopcowboy.com",
      href: "https://invest.forloopcowboy.com/",
    },
  },
] as const;

export function projectHeading(project: Project): string {
  return project.kind === "professional" ? project.company : project.title;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): {
  previous?: Project;
  next?: Project;
} {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return {
    previous: i > 0 ? projects[i - 1] : undefined,
    next: i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}
