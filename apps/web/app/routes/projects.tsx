import { useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SectionHeader, cn, inkPullUnderline } from '@personal/ui';
import { SiteFooter, SiteHeader } from '../components/SiteChrome';
import { projects, type Project } from '../lib/projects';
import { getProjectIllustration } from '../lib/project-illustrations';
import i18n from '../i18n/config';
import { useLocale } from '../i18n/LocaleContext';
import type { Route } from './+types/projects';

export function meta({}: Route.MetaArgs) {
  return [
    { title: i18n.t('projects.meta_title') },
    {
      name: 'description',
      content: i18n.t('projects.meta_description'),
    },
  ];
}

export function loader() {
  return {
    professional: projects.filter((p) => p.kind === 'professional'),
    personal: projects.filter((p) => p.kind === 'personal'),
  };
}

export default function ProjectsIndex() {
  const { professional, personal } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const { localePrefix } = useLocale();

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto flex max-w-page flex-col px-6 md:px-10 lg:px-gutter">
        <SiteHeader />

        <section className="border-t border-rule pb-16 pt-20 md:pt-28">
          <SectionHeader
            href={`${localePrefix}/projects`}
            title={t('projects.title')}
            lede={t('projects.lede')}
          />
        </section>

        <ProjectGroup
          eyebrow={t('projects.professional_eyebrow')}
          summary={t('projects.professional_summary')}
          items={professional}
          tone="professional"
        />

        <ProjectGroup
          eyebrow={t('projects.personal_eyebrow')}
          summary={t('projects.personal_summary')}
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
  tone: 'professional' | 'personal';
}

function ProjectGroup({ eyebrow, summary, items, tone }: ProjectGroupProps) {
  return (
    <section className="border-t border-rule py-10 md:py-20 md:py-24">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
        <div className="md:sticky md:top-12 md:self-start">
          <div className="flex items-center gap-3 text-ink-soft">
            <span aria-hidden className="h-px w-8 bg-rule" />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
              {eyebrow}
            </span>
          </div>
          <p className="mt-4 font-sans text-sm leading-relaxed text-ink-soft md:max-w-[28ch]">
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
  tone: 'professional' | 'personal';
}) {
  const { t } = useTranslation();
  const { localePrefix } = useLocale();
  const Illustration = getProjectIllustration(project.slug);

  const heading =
    project.kind === 'professional'
      ? t(`projects.items.${project.slug}.company`)
      : t(`projects.items.${project.slug}.title`);

  return (
    <a
      href={`${localePrefix}/projects/${project.slug}`}
      className="group grid grid-cols-1 gap-x-12 gap-y-3 py-8 md:grid-cols-[1fr_auto] md:items-stretch"
    >
      <div>
        <h3
          className={cn(
            'font-display font-light leading-tight tracking-[-0.015em] text-ink',
            tone === 'professional'
              ? 'text-3xl md:text-4xl'
              : 'text-2xl md:text-3xl',
          )}
        >
          <span
            className={cn(
              inkPullUnderline,
              'duration-200 ease-settle group-hover:text-teal',
            )}
          >
            {heading}
          </span>
        </h3>
        <div className="my-2 flex flex-col gap-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft/60">
          <span>{t(`projects.items.${project.slug}.role`)}</span>
          {project.kind === 'professional' && (
            <span aria-label={t('projects.field_years')}>{project.years}</span>
          )}
        </div>
        <p className="mt-3 max-w-prose font-sans text-base leading-relaxed text-ink-soft">
          {t(`projects.items.${project.slug}.excerpt`)}
        </p>
      </div>
      {Illustration && (
        <Illustration className="fixed right-2 w-44 opacity-50 transition-opacity duration-200 group-hover:opacity-80 md:w-52 lg:relative" />
      )}
    </a>
  );
}
