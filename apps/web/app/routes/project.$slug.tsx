import { data, useLoaderData } from "react-router";
import { Link } from "@personal/ui";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { getProject, getProjectBody } from "../lib/getProject";
import {
  projectHeading,
  type Project,
} from "../lib/projects";
import { projectMdxComponents } from "../lib/mdx-components";
import type { Route } from "./+types/project.$slug";

export function meta({ data: pageData }: Route.MetaArgs) {
  if (!pageData) {
    return [{ title: "Project not found — Leo Gonsalves" }];
  }
  const { metadata } = pageData;
  const heading = projectHeading(metadata);
  return [
    { title: `${heading} — Leo Gonsalves` },
    { name: "description", content: metadata.excerpt },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const project = getProject(params.slug);
  if (!project) {
    throw data("Project not found", { status: 404 });
  }
  return project;
}

export default function ProjectPage() {
  const { metadata, previous, next } = useLoaderData<typeof loader>();
  const Body = getProjectBody(metadata.slug);

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto flex max-w-page flex-col px-6 md:px-10 lg:px-gutter">
        <SiteHeader />

        <ProjectHero project={metadata} />

        <section className="border-t border-rule py-20 md:py-24">
          <article className="mx-auto max-w-[44rem]">
            {Body ? <Body components={projectMdxComponents} /> : null}
          </article>
        </section>

        <ProjectNav previous={previous} next={next} />

        <SiteFooter />
      </div>
    </main>
  );
}

function ProjectHero({ project }: { project: Project }) {
  const heading = projectHeading(project);
  const showYears = project.kind === "professional" || Boolean(project.years);

  return (
    <section className="flex flex-col gap-10 pb-20 pt-16 md:pt-24">
      <div className="animate-settle-in flex items-center gap-3 text-ink-soft">
        <a
          href="/projects"
          className="font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 ease-settle hover:text-ember focus-visible:text-ember focus-visible:outline-none"
        >
          ← All projects
        </a>
        <span aria-hidden className="h-px w-8 bg-rule" />
        <span className="font-mono text-xs uppercase tracking-[0.18em]">
          {project.kind === "professional" ? "Professional" : "Personal"}
        </span>
      </div>

      <h1
        className="animate-settle-in max-w-[18ch] font-display text-5xl font-light leading-[1.02] tracking-[-0.025em] text-ink md:text-6xl [text-wrap:balance]"
        style={{ animationDelay: "80ms" }}
      >
        {heading}
      </h1>

      <dl
        className="animate-settle-in grid grid-cols-1 gap-6 border-t border-rule pt-8 md:grid-cols-3"
        style={{ animationDelay: "160ms" }}
      >
        <HeroField label="Role" value={project.role} />
        {showYears && (
          <HeroField label="Years" value={project.years ?? "—"} mono />
        )}
        <HeroField
          label="Link"
          value={
            <Link href={project.link.href} className="text-base">
              {project.link.label}
            </Link>
          }
        />
      </dl>
    </section>
  );
}

function HeroField({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <dt className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </dt>
      <dd
        className={
          mono
            ? "font-mono text-sm text-ink"
            : "font-sans text-base text-ink"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function ProjectNav({
  previous,
  next,
}: {
  previous?: Project;
  next?: Project;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Project pagination"
      className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-rule bg-rule md:grid-cols-2"
    >
      <NavCell project={previous} direction="previous" />
      <NavCell project={next} direction="next" />
    </nav>
  );
}

function NavCell({
  project,
  direction,
}: {
  project: Project | undefined;
  direction: "previous" | "next";
}) {
  const alignRight = direction === "next";
  const label = direction === "previous" ? "Previous" : "Next";

  if (!project) {
    return (
      <div
        className={`flex min-h-[8rem] flex-col justify-center bg-paper-raised p-8 ${
          alignRight ? "items-end text-right" : "items-start text-left"
        }`}
      >
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
          {label}
        </span>
        <span className="mt-2 font-display text-xl font-light text-ink-soft/60">
          —
        </span>
      </div>
    );
  }

  const heading = projectHeading(project);

  return (
    <a
      href={`/projects/${project.slug}`}
      className={`group flex min-h-[8rem] flex-col justify-center gap-2 bg-paper-raised p-8 transition-colors duration-200 hover:bg-ember/[0.04] ${
        alignRight ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft group-hover:text-ember">
        {direction === "previous" ? "← Previous" : "Next →"}
      </span>
      <span className="font-display text-2xl font-normal leading-tight tracking-[-0.01em] text-ink">
        {heading}
      </span>
      <span className="max-w-[36ch] font-sans text-sm leading-relaxed text-ink-soft">
        {project.excerpt}
      </span>
    </a>
  );
}
