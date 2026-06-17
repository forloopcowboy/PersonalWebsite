import { Trans, useTranslation } from "react-i18next";
import { useLoaderData } from "react-router";
import {Button, cn, LanguagePicker, Link, Logo, SectionHeader, inkPullUnderline} from "@personal/ui";
import { supportedLanguages } from "../i18n/config";
import enUS from "../i18n/en-us.json";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Leo Gonsalves — Software engineer" },
    {
      name: "description",
      content:
        "Engineer working in React and C# across clinical trials, geospatial tooling, and Belgian payroll. Available for contract and consulting work.",
    },
  ];
}

const pick = (n: number) => Math.floor(Math.random() * n);

export function loader() {
  return {
    heroIndex: pick(enUS.hero.headlines.length),
    aboutIndex: pick(enUS.about.bodies.length),
    workTitleIndex: pick(enUS.work.titles.length),
  };
}

interface Role {
  key: string;
  href: string;
}

const SELECTED_WORK: Role[] = [
  { key: "nside", href: "https://www.n-side.com/en/life-sciences/cts-digital-twin/lighthouse-easy-and-accurate-clinical-supply-forecasting-planning-solution/" },
  { key: "tris", href: "https://www.tris.earth/" },
  { key: "payflip", href: "https://payflip.be/en/" },
];

interface SideProject {
  key: string;
  href: string;
}

const SIDE_PROJECTS: SideProject[] = [
  { key: "recolonizer", href: "https://forloopcowboy.itch.io/recolonizer" },
  { key: "glutton", href: "https://forloopcowboy.itch.io/glutton-for-gluten" },
  { key: "cowboy_investor", href: "https://invest.forloopcowboy.com/" },
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

function SiteHeader() {
  const { t, i18n } = useTranslation();

  return (
    <header className="flex items-center justify-between py-8">
      <a
        href="/"
        className="group inline-flex items-center gap-3"
        aria-label="forloopcowboy — home"
      >
        <Logo className="h-7 w-7" />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors duration-200 group-hover:text-ink">
          {t("nav.home")}
        </span>
      </a>
      <nav className="flex items-center gap-6">
        <Link
          href="#work"
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t("nav.work")}
        </Link>
        <Link
          href="#side"
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t("nav.side")}
        </Link>
        <Link
          href="/contact"
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t("nav.contact")}
        </Link>
        <LanguagePicker
          value={i18n.language}
          options={supportedLanguages}
          onChange={(code) => i18n.changeLanguage(code)}
        />
      </nav>
    </header>
  );
}

function Hero({ index }: { index: number }) {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col gap-12 pb-32 pt-20 md:gap-14 md:pt-32">
      <div className="animate-settle-in flex items-center gap-3 text-ink-soft">
        <span aria-hidden className="h-px w-8 bg-rule" />
        <span className="font-mono text-xs uppercase tracking-[0.18em]">
          {t("hero.tagline")}
        </span>
      </div>

      <h1
        className="animate-settle-in max-w-[22ch] font-display text-5xl font-light leading-[1.02] tracking-[-0.025em] text-ink md:text-6xl [text-wrap:balance]"
        style={{ animationDelay: "80ms" }}
      >
        <Trans
          i18nKey={`hero.headlines.${index}`}
          components={{
            em: <em className="font-normal italic text-ember" />,
          }}
        />
      </h1>

      <div
        className="animate-settle-in flex flex-wrap items-center gap-3"
        style={{ animationDelay: "160ms" }}
      >
        <a href="#work" className="focus-visible:outline-none">
          <Button variant="primary" size="lg">
            {t("hero.cta_work")}
          </Button>
        </a>
        <a href="/contact" className="focus-visible:outline-none">
          <Button variant="secondary" size="lg">
            {t("hero.cta_contact")}
          </Button>
        </a>
      </div>
    </section>
  );
}

function About({ index }: { index: number }) {
  const { t } = useTranslation();

  return (
    <section id="about" className="border-t border-rule py-24 md:py-28 scroll-mt-16">
      <SectionHeader
        eyebrow={t("about.eyebrow")}
        href="#about"
        title={t("about.title")}
      />
      <p className="mt-10 max-w-prose font-sans text-lg leading-relaxed text-ink-soft [text-wrap:pretty]">
        <Trans
          i18nKey={`about.bodies.${index}`}
          components={{
            emphasis: <span className="text-ink italic" />,
            br: <span aria-hidden className="block h-4" />,
          }}
        />
      </p>
    </section>
  );
}

function SelectedWork({ titleIndex }: { titleIndex: number }) {
  const { t } = useTranslation();

  return (
    <section id="work" className="border-t border-rule py-24 md:py-28 scroll-mt-16">
      <SectionHeader
        eyebrow={t("work.eyebrow")}
        href="#work"
        title={t(`work.titles.${titleIndex}`)}
        lede={t("work.lede")}
      />

      <ol className="mt-16 flex flex-col divide-y divide-rule">
        {SELECTED_WORK.map((role, i) => (
          <li
            key={role.key}
            className="animate-settle-in group grid grid-cols-1 gap-x-12 gap-y-4 py-10 md:grid-cols-[16rem_1fr_auto] md:items-baseline"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <h3 className="font-display text-3xl font-light leading-tight tracking-[-0.015em] text-ink">
              <span className={cn(inkPullUnderline, "duration-200 ease-settle group-hover:text-ember")}>
                {t(`work.roles.${role.key}.company`)}
              </span>
            </h3>
            <p className="max-w-prose font-sans text-base leading-relaxed text-ink-soft">
              {t(`work.roles.${role.key}.contribution`)}
            </p>
            <div className="md:self-baseline">
              <Link href={role.href} className="text-sm">
                {t("work.visit")}
              </Link>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12">
        <Link
          href="/projects"
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          {t("work.view_all")}
        </Link>
      </div>
    </section>
  );
}

function SideProjects() {
  const { t } = useTranslation();

  return (
    <section id="side" className="border-t border-rule py-24 md:py-28 scroll-mt-16">
      <SectionHeader
        eyebrow={t("side.eyebrow")}
        href="#side"
        title={t("side.title")}
        lede={t("side.lede")}
      />

      <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-rule bg-rule md:grid-cols-3">
        {SIDE_PROJECTS.map((project, i) => (
          <article
            key={project.key}
            className="animate-settle-in flex flex-col gap-5 bg-paper-raised p-8"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-3 text-ink-soft">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-ember">
                {t(`side.projects.${project.key}.tag`)}
              </span>
              <span aria-hidden className="h-px w-6 bg-rule" />
            </div>
            <h3 className="font-display text-2xl font-normal leading-tight tracking-[-0.01em] text-ink">
              {t(`side.projects.${project.key}.title`)}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-ink-soft">
              {t(`side.projects.${project.key}.blurb`)}
            </p>
            <div className="mt-auto pt-2">
              <Link href={project.href} className="text-sm">
                {t("side.play")}
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

  return (
    <section id="contact" className="border-t border-rule py-28 md:py-32 scroll-mt-16">
      <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[30ch]">
          <div className="flex items-center gap-3 text-ink-soft">
            <span aria-hidden className="h-px w-8 bg-rule" />
            <a
              href="#contact"
              className="font-mono text-xs uppercase tracking-[0.18em] transition-colors duration-200 ease-settle hover:text-ember focus-visible:text-ember focus-visible:outline-none"
            >
              {t("contact.eyebrow")}
            </a>
          </div>
          <h2 className="mt-6 font-display text-4xl font-light leading-[1.04] tracking-[-0.02em] text-ink md:text-5xl [text-wrap:balance]">
            {t("contact.title")}{" "}
            <em className="font-normal italic text-ember">
              {t("contact.title_em")}
            </em>
          </h2>
          <p className="mt-6 max-w-prose font-sans text-lg leading-relaxed text-ink-soft">
            {t("contact.body")}
          </p>
        </div>
        <a href="/contact" className="focus-visible:outline-none">
          <Button variant="primary" size="lg">
            {t("contact.cta")}
          </Button>
        </a>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mt-8 flex flex-col gap-6 border-t border-rule py-10 md:flex-row md:items-center md:justify-between">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
        {t("footer.copyright")}
      </p>
      <div className="flex items-center gap-6 font-sans text-sm">
        <Link href="mailto:leo@forloopcowboy.com">{t("footer.email")}</Link>
        <Link href="https://github.com/forloopcowboy">{t("footer.github")}</Link>
        <Link href="https://www.linkedin.com/in/leogonsalves">{t("footer.linkedin")}</Link>
      </div>
    </footer>
  );
}
