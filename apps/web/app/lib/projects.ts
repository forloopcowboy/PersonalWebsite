/**
 * Source of truth for the projects index. Body content lives next to this file
 * as MDX under `app/content/projects/{locale}/{slug}.mdx`. Keep this file
 * metadata-only — all translatable text lives in `i18n/{locale}.json`.
 */

import i18n from '../i18n/config';

export interface ProjectLink {
  href: string;
}

interface ProjectBase {
  slug: string;
  link: ProjectLink;
}

export interface ProfessionalProject extends ProjectBase {
  kind: 'professional';
  years: string;
}

export interface PersonalProject extends ProjectBase {
  kind: 'personal';
  years?: string;
}

export type Project = ProfessionalProject | PersonalProject;

export const projects: readonly Project[] = [
  {
    slug: 'payflip',
    kind: 'professional',
    years: '2025-present',
    link: { href: 'https://payflip.be/en/' },
  },
  {
    slug: 'tris',
    kind: 'professional',
    years: '2025-2026',
    link: { href: 'https://www.tris.earth/' },
  },
  {
    slug: 'n-side',
    kind: 'professional',
    years: '2020-2024',
    link: {
      href: 'https://cms.n-side.com/files/uploads/2025/07/N-SIDE_Lighthouse_Brochure.pdf',
    },
  },
  {
    slug: 'recolonizer',
    kind: 'personal',
    link: {
      href: 'https://forloopcowboy.itch.io/recolonizer',
    },
  },
  {
    slug: 'glutton-for-gluten',
    kind: 'personal',
    link: {
      href: 'https://forloopcowboy.itch.io/glutton-for-gluten',
    },
  },
  {
    slug: 'cowboy-investor',
    kind: 'personal',
    link: {
      href: 'https://invest.forloopcowboy.com/',
    },
  },
  {
    slug: 'this-website',
    kind: 'personal',
    link: {
      href: 'https://forloopcowboy.com/',
    },
  },
] as const;

export function projectHeading(project: Project): string {
  const key =
    project.kind === 'professional'
      ? `projects.items.${project.slug}.company`
      : `projects.items.${project.slug}.title`;
  return i18n.t(key);
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
