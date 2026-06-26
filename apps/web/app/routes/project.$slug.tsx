import { data, useLoaderData } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from '@personal/ui';
import { SiteFooter, SiteHeader } from '../components/SiteChrome';
import { getProject, getProjectBody } from '../lib/getProject';
import { projectHeading, type Project } from '../lib/projects';
import { getProjectIllustration } from '../lib/project-illustrations';
import { projectMdxComponents } from '../lib/mdx-components';
import i18n from '../i18n/config';
import { useLocale } from '../i18n/LocaleContext';
import type { Route } from './+types/project.$slug';

export function meta({ data: pageData }: Route.MetaArgs) {
  if (!pageData) {
    return [{ title: i18n.t('projects.not_found_title') }];
  }
  const { metadata } = pageData;
  const heading = projectHeading(metadata);
  return [
    { title: i18n.t('projects.detail_meta_title', { heading }) },
    {
      name: 'description',
      content: i18n.t(`projects.items.${metadata.slug}.excerpt`),
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const project = getProject(params.slug);
  if (!project) {
    throw data(i18n.t('projects.not_found'), { status: 404 });
  }
  return project;
}

export default function ProjectPage() {
  const { metadata, previous, next } = useLoaderData<typeof loader>();
  const { locale } = useLocale();
  const Body = getProjectBody(metadata.slug, locale);

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
  const { t } = useTranslation();
  const { localePrefix } = useLocale();
  const heading = projectHeading(project);
  const showYears = project.kind === 'professional' || Boolean(project.years);
  const Illustration = getProjectIllustration(project.slug);

  return (
    <section className="relative flex flex-col gap-10 pb-20 pt-16 md:pt-24">
      {Illustration && (
        <Illustration className="pointer-events-none absolute right-0 top-12 w-40 opacity-30 md:w-64 md:opacity-40" />
      )}
      <div className="flex animate-settle-in items-center gap-3 text-ink-soft">
        <a
          href={`${localePrefix}/projects`}
          className="font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 ease-settle hover:text-teal focus-visible:text-teal focus-visible:outline-none"
        >
          {t('projects.back')}
        </a>
        <span aria-hidden className="h-px w-8 bg-rule" />
        <span className="font-mono text-xs uppercase tracking-[0.18em]">
          {project.kind === 'professional'
            ? t('projects.kind_professional')
            : t('projects.kind_personal')}
        </span>
      </div>

      <h1
        className="text-gradient max-w-[18ch] animate-settle-in font-display text-5xl font-light leading-[1.02] tracking-[-0.025em] text-ink [text-wrap:balance] md:text-6xl"
        style={{ animationDelay: '80ms' }}
      >
        {heading}
      </h1>

      <dl
        className="grid animate-settle-in grid-cols-1 gap-6 border-t border-rule pt-8 md:grid-cols-3"
        style={{ animationDelay: '160ms' }}
      >
        <HeroField
          label={t('projects.field_role')}
          value={t(`projects.items.${project.slug}.role`)}
        />
        {showYears && (
          <HeroField
            label={t('projects.field_years')}
            value={project.years ?? '—'}
            mono
          />
        )}
        <HeroField
          label={t('projects.field_link')}
          value={
            <Link href={project.link.href} className="text-base">
              {t(`projects.items.${project.slug}.link_label`)}
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
          mono ? 'font-mono text-sm text-ink' : 'font-sans text-base text-ink'
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
  direction: 'previous' | 'next';
}) {
  const { t } = useTranslation();
  const { localePrefix } = useLocale();
  const alignRight = direction === 'next';
  const label =
    direction === 'previous'
      ? t('projects.nav_previous')
      : t('projects.nav_next');

  if (!project) {
    return (
      <div
        className={`flex min-h-[8rem] flex-col justify-center bg-paper-raised p-8 ${
          alignRight ? 'items-end text-right' : 'items-start text-left'
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
      href={`${localePrefix}/projects/${project.slug}`}
      className={`group flex min-h-[8rem] flex-col justify-center gap-2 bg-paper-raised p-8 transition-colors duration-200 hover:bg-teal/[0.06] ${
        alignRight ? 'items-end text-right' : 'items-start text-left'
      }`}
    >
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft group-hover:text-teal">
        {direction === 'previous'
          ? t('projects.nav_previous_label')
          : t('projects.nav_next_label')}
      </span>
      <span className="font-display text-2xl font-normal leading-tight tracking-[-0.01em] text-ink">
        {heading}
      </span>
      <span className="max-w-[36ch] font-sans text-sm leading-relaxed text-ink-soft">
        {t(`projects.items.${project.slug}.excerpt`)}
      </span>
    </a>
  );
}
