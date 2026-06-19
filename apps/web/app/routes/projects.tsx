import { useLoaderData, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { SectionHeader, cn, inkPullUnderline } from "@personal/ui";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { projects, type Project } from "../lib/projects";
import i18n from "../i18n/config";
import type { Route } from "./+types/projects";

export function meta({}: Route.MetaArgs) {
  return [
    { title: i18n.t("projects.meta_title") },
    {
      name: "description",
      content: i18n.t("projects.meta_description"),
    },
  ];
}

export function loader() {
  return {
    professional: projects.filter((p) => p.kind === "professional"),
    personal: projects.filter((p) => p.kind === "personal"),
  };
}

export default function ProjectsIndex() {
  const { professional, personal } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto flex max-w-page flex-col px-6 md:px-10 lg:px-gutter">
        <SiteHeader />

        <section className="border-t border-rule pb-16 pt-20 md:pt-28">
          <SectionHeader
            eyebrow={t("projects.eyebrow")}
            href={`/${locale}/projects`}
            title={t("projects.title")}
            lede={t("projects.lede")}
          />
        </section>

        <ProjectGroup
          eyebrow={t("projects.professional_eyebrow")}
          summary={t("projects.professional_summary")}
          items={professional}
          tone="professional"
        />

        <ProjectGroup
          eyebrow={t("projects.personal_eyebrow")}
          summary={t("projects.personal_summary")}
          items={personal}
          tone="personal"
        />

        <SiteFooter />
      </div>
    </main>
  );
}

interface ProjectGroupProps {
  eyebrow: string;
  summary: string;
  items: readonly Project[];
  tone: "professional" | "personal";
}

function ProjectGroup({ eyebrow, summary, items, tone }: ProjectGroupProps) {
  return (
    <section className="border-t border-rule py-20 md:py-24">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
        <div className="md:sticky md:top-12 md:self-start">
          <div className="flex items-center gap-3 text-ink-soft">
            <span aria-hidden className="h-px w-8 bg-rule" />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ember">
              {eyebrow}
            </span>
          </div>
          <p className="mt-4 max-w-[28ch] font-sans text-sm leading-relaxed text-ink-soft">
            {summary}
          </p>
        </div>

        <ol className="flex flex-col divide-y divide-rule">
          {items.map((project, i) => (
            <li
              key={project.slug}
              className="animate-settle-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <ProjectCard project={project} tone={tone} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  tone,
}: {
  project: Project;
  tone: "professional" | "personal";
}) {
  const { t } = useTranslation();
  const { locale } = useParams<{ locale: string }>();

  const heading =
    project.kind === "professional"
      ? t(`projects.items.${project.slug}.company`)
      : t(`projects.items.${project.slug}.title`);

  return (
    <a
      href={`/${locale}/projects/${project.slug}`}
      className="group grid grid-cols-1 gap-x-12 gap-y-3 py-8 md:grid-cols-[1fr_auto] md:items-baseline"
    >
      <div>
        <h3
          className={cn(
            "font-display font-light leading-tight tracking-[-0.015em] text-ink",
            tone === "professional" ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl",
          )}
        >
          <span
            className={cn(
              inkPullUnderline,
              "duration-200 ease-settle group-hover:text-ember",
            )}
          >
            {heading}
          </span>
        </h3>
        <p className="mt-3 max-w-prose font-sans text-base leading-relaxed text-ink-soft">
          {t(`projects.items.${project.slug}.excerpt`)}
        </p>
      </div>
      <div className="flex flex-col gap-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft md:items-end md:text-right">
        <span>{t(`projects.items.${project.slug}.role`)}</span>
        {project.kind === "professional" && (
          <span aria-label={t("projects.field_years")}>{project.years}</span>
        )}
      </div>
    </a>
  );
}
