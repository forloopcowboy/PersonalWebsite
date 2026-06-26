import { Trans, useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';
import { Button, Link, SectionHeader, HeroDecoration } from '@personal/ui';
import { resolveLocale } from '../i18n/config';
import i18n from '../i18n/config';
import { useLocale } from '../i18n/LocaleContext';
import enUS from '../i18n/en-us.json';
import ptBR from '../i18n/pt-br.json';
import type { Route } from './+types/home';
import { SiteHeader } from '../components/SiteChrome';
import { getProjectIllustration } from '../lib/project-illustrations';

const translations: Record<string, typeof enUS> = {
  'en-us': enUS,
  'pt-br': ptBR,
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: i18n.t('meta.title') },
    {
      name: 'description',
      content: i18n.t('meta.description'),
    },
  ];
}

const pick = (n: number) => Math.floor(Math.random() * n);

export function loader({ params, request }: Route.LoaderArgs) {
  const locale = resolveLocale(params.locale, request);
  const t = translations[locale] ?? enUS;
  return {
    heroIndex: pick(t.hero.headlines.length),
    aboutIndex: pick(t.about.bodies.length),
    workTitleIndex: pick(t.work.titles.length),
  };
}

interface Role {
  key: string;
  href: string;
}

const SELECTED_WORK: Role[] = [
  { key: 'payflip', href: 'https://payflip.be/en/' },
  { key: 'tris', href: 'https://www.tris.earth/' },
  {
    key: 'n-side',
    href: 'https://www.n-side.com/en/life-sciences/cts-digital-twin/lighthouse-easy-and-accurate-clinical-supply-forecasting-planning-solution/',
  },
];

interface SideProject {
  key: string;
  href: string;
}

const SIDE_PROJECTS: SideProject[] = [
  { key: 'recolonizer', href: 'https://forloopcowboy.itch.io/recolonizer' },
  {
    key: 'glutton-for-gluten',
    href: 'https://forloopcowboy.itch.io/glutton-for-gluten',
  },
  { key: 'cowboy-investor', href: 'https://invest.forloopcowboy.com/' },
];

export default function Home() {
  const { heroIndex, aboutIndex, workTitleIndex } =
    useLoaderData<typeof loader>();

  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto flex max-w-page flex-col px-6 md:px-10 lg:px-gutter">
        <SiteHeader />
        <Hero index={heroIndex} />
        <About index={aboutIndex} />
        <SelectedWork titleIndex={workTitleIndex} />
        <SideProjects />
        <ContactCTA />
        <SiteFooter />
      </div>
    </main>
  );
}

function Hero({ index }: { index: number }) {
  const { t } = useTranslation();
  const { localePrefix } = useLocale();

  return (
    <section className="relative flex min-h-[85vh] flex-col gap-12 py-0 pb-16 pt-10 sm:py-8 md:gap-14 md:py-10 lg:py-16">
      <HeroDecoration className="pointer-events-none absolute -bottom-[1.35rem] right-0 w-[35rem] opacity-60 sm:-bottom-[1.25rem] md:-bottom-[1.65rem] lg:md:-bottom-[1.85rem] lg:w-[45rem]" />
      <div className="flex animate-settle-in items-center gap-3 text-ink-soft">
        <span aria-hidden className="h-px w-8 bg-rule" />
        <span className="font-mono text-xs uppercase tracking-[0.18em]">
          <Trans
            i18nKey={`hero.tagline`}
            components={{
              em: <em className="font-normal italic text-teal" />,
              br: <span aria-hidden className="block h-2" />,
            }}
          />
        </span>
      </div>

      <h1
        className="max-w-[22ch] animate-settle-in font-display text-4xl font-light leading-[1.02] tracking-[-0.025em] text-ink [text-wrap:balance] sm:text-5xl md:text-6xl"
        style={{ animationDelay: '80ms' }}
      >
        <Trans
          i18nKey={`hero.headlines.${index}`}
          components={{
            em: <em className="text-gradient font-normal italic" />,
          }}
        />
      </h1>

      <div
        className="flex animate-settle-in flex-wrap items-center gap-3"
        style={{ animationDelay: '160ms' }}
      >
        <a href="#work" className="focus-visible:outline-none">
          <Button variant="primary" size="lg">
            {t('hero.cta_work')}
          </Button>
        </a>
        <a
          href={`${localePrefix}/contact`}
          className="focus-visible:outline-none"
        >
          <Button variant="secondary" size="lg">
            {t('hero.cta_contact')}
          </Button>
        </a>
      </div>
    </section>
  );
}

function About({ index }: { index: number }) {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="rule-gradient scroll-mt-16 border-t border-rule py-16 sm:py-24 md:py-28"
    >
      <SectionHeader
        eyebrow={t('about.eyebrow')}
        href="#about"
        title={t('about.title')}
      />
      <p className="text-md mt-10 max-w-prose font-sans leading-relaxed text-ink-soft [text-wrap:pretty] sm:text-lg">
        <Trans
          i18nKey={`about.bodies.${index}`}
          components={{
            emphasis: <span className="italic text-ink" />,
            br: <span aria-hidden className="block h-4" />,
          }}
        />
      </p>
    </section>
  );
}

function SelectedWork({ titleIndex }: { titleIndex: number }) {
  const { t } = useTranslation();
  const { localePrefix } = useLocale();

  return (
    <section
      id="work"
      className="rule-gradient scroll-mt-16 border-t border-rule py-9 sm:py-24 md:py-28"
    >
      <SectionHeader
        eyebrow={t('work.eyebrow')}
        href="#work"
        title={t(`work.titles.${titleIndex}`)}
        lede={t('work.lede')}
      />

      <ol className="mt-16 flex flex-col divide-y divide-rule">
        {SELECTED_WORK.map((role, i) => {
          const Illustration = getProjectIllustration(role.key);
          return (
            <li
              key={role.key}
              className="group grid animate-settle-in grid-cols-1 gap-x-12 gap-y-4 py-10 md:grid-cols-[16rem_1fr_auto] md:items-baseline lg:py-12"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {Illustration && (
                <Illustration className="pointer-events-none fixed right-2 top-2 w-44 opacity-10 transition-opacity duration-700 group-hover:opacity-60 md:left-2 md:right-auto md:top-8 md:w-52" />
              )}
              <div>
                <Link href={`${localePrefix}/projects/${role.key}`}>
                  <h3 className="font-display text-3xl font-light leading-tight tracking-[-0.015em]">
                    <span>{t(`work.roles.${role.key}.company`)}</span>
                  </h3>
                </Link>
              </div>
              <p className="max-w-prose font-sans text-base leading-relaxed text-ink-soft">
                {t(`work.roles.${role.key}.contribution`)}
              </p>
              <div className="md:self-baseline">
                <Link href={role.href} className="text-sm">
                  {`${t('work.visit')} ${role.href.split('https://')[1].split('/')[0].replace('www.', '')}`}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-12">
        <Link
          href={`${localePrefix}/projects`}
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t('work.view_all')}
        </Link>
      </div>
    </section>
  );
}

function SideProjects() {
  const { t } = useTranslation();
  const { localePrefix } = useLocale();

  return (
    <section
      id="side"
      className="rule-gradient scroll-mt-16 border-t border-rule py-9 sm:py-24 md:py-28"
    >
      <SectionHeader
        eyebrow={t('side.eyebrow')}
        href="#side"
        title={
          <span className="text-gradient">
            <Trans
              i18nKey={`side.title`}
              components={{
                em: <em className="font-normal italic text-teal" />,
              }}
            />
          </span>
        }
        lede={t('side.lede')}
      />

      <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-rule bg-rule md:grid-cols-3">
        {SIDE_PROJECTS.map((project, i) => (
          <article
            key={project.key}
            className="relative flex animate-settle-in flex-col gap-5 overflow-hidden bg-paper-raised p-8"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, ${
                  [
                    'rgb(var(--color-ember))',
                    'rgb(var(--color-peach))',
                    'rgb(var(--color-teal))',
                  ][i]
                } 0%, transparent 100%)`,
                opacity: 0.5,
              }}
            />
            <div className="flex items-center gap-3 text-ink-soft">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
                {t(`side.projects.${project.key}.tag`)}
              </span>
              <span aria-hidden className="h-px w-6 bg-rule" />
            </div>
            <div>
              <Link href={`${localePrefix}/projects/${project.key}`}>
                <h3 className="font-display text-2xl font-normal leading-tight tracking-[-0.01em]">
                  {t(`side.projects.${project.key}.title`)}
                </h3>
              </Link>
            </div>
            <p className="font-sans text-sm leading-relaxed text-ink-soft">
              {t(`side.projects.${project.key}.blurb`)}
            </p>
            <div className="mt-auto pt-2">
              <Link href={project.href} className="text-sm">
                {t('side.play')}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ContactCTA() {
  const { t } = useTranslation();
  const { localePrefix } = useLocale();

  return (
    <section
      id="contact"
      className="rule-gradient scroll-mt-16 border-t border-rule py-28 md:py-32"
    >
      <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[30ch]">
          <div className="flex items-center gap-3 text-ink-soft">
            <span aria-hidden className="h-px w-8 bg-rule" />
            <a
              href="#contact"
              className="font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 ease-settle hover:text-teal focus-visible:text-teal focus-visible:outline-none"
            >
              {t('contact.eyebrow')}
            </a>
          </div>
          <h2 className="mt-6 font-display text-4xl font-light leading-[1.04] tracking-[-0.02em] text-ink [text-wrap:balance] md:text-5xl">
            {t('contact.title')}{' '}
            <em className="text-gradient font-normal italic">
              {t('contact.title_em')}
            </em>
          </h2>
          <p className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-ink-soft">
            {t('contact.body')}
          </p>
        </div>
        <a
          href={`${localePrefix}/contact`}
          className="focus-visible:outline-none"
        >
          <Button variant="primary" size="lg">
            {t('contact.cta')}
          </Button>
        </a>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mt-8 flex flex-col-reverse items-center justify-between gap-6 border-t border-rule py-10 md:flex-row">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
        {t('footer.copyright')}
      </p>
      <div className="flex items-center gap-6 font-sans text-sm">
        <Link href="mailto:leo@forloopcowboy.com">{t('footer.email')}</Link>
        <Link href="https://github.com/forloopcowboy">
          {t('footer.github')}
        </Link>
        <Link href="https://www.linkedin.com/in/leogonsalves">
          {t('footer.linkedin')}
        </Link>
      </div>
    </footer>
  );
}
