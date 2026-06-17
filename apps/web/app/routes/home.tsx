import { Button, Link, SectionHeader } from "@personal/ui";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Leo Gonsalves — Software Engineer" },
    {
      name: "description",
      content:
        "Software engineer working across clinical trials, geospatial tooling, and payments infrastructure.",
    },
  ];
}

interface Project {
  name: string;
  role: string;
  period: string;
  blurb: string;
  href?: string;
}

const PROJECTS: Project[] = [
  {
    name: "Payflip",
    role: "Engineer",
    period: "2024 — present",
    blurb:
      "Belgian payments and payroll infrastructure. TypeScript, NestJS, a stack of legacy edge cases nobody warned anyone about.",
    href: "https://payflip.be",
  },
  {
    name: "tris.earth",
    role: "Founder, solo build",
    period: "2022 — 2023",
    blurb:
      "Geospatial carbon-credit tooling for Brazilian farmers and landowners. PostGIS, satellite imagery, and a lot of polygon math.",
    href: "https://tris.earth",
  },
  {
    name: "n-side",
    role: "Founding engineer",
    period: "2019 — 2022",
    blurb:
      "Supply planning platform for clinical trials. Shipped the first version, grew the team, learned what production looks like under audit.",
    href: "https://nside.com",
  },
  {
    name: "Side: Unity, LLM tooling",
    role: "Tinkering",
    period: "ongoing",
    blurb:
      "Tower defense and a jam platformer in Unity (C#), plus a small LLM product that exists mostly to keep me honest about latency.",
  },
];

export default function Home() {
  return (
    <main className="min-h-dvh bg-paper text-ink">
      <div className="mx-auto flex max-w-page flex-col px-6 md:px-10 lg:px-gutter">
        <SiteHeader />
        <Hero />
        <RecentWork />
        <Currently />
        <SiteFooter />
      </div>
    </main>
  );
}

function SiteHeader() {
  return (
    <header className="flex items-center justify-between py-8">
      <Link
        href="/"
        className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft"
      >
        forloopcowboy
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="#work"
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          Work
        </Link>
        <Link
          href="mailto:leo@example.com"
          className="font-mono text-xs uppercase tracking-[0.18em]"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="flex flex-col gap-10 pb-24 pt-16 md:pt-28">
      <div className="animate-settle-in flex items-center gap-3 text-ink-soft">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ember">
          § 00
        </span>
        <span aria-hidden className="h-px w-8 bg-rule" />
        <span className="font-mono text-xs uppercase tracking-[0.18em]">
          Leo Gonsalves — Software Engineer
        </span>
      </div>

      <h1
        className="animate-settle-in max-w-[20ch] font-display text-5xl font-light leading-[1.02] tracking-[-0.025em] text-ink md:text-6xl [text-wrap:balance]"
        style={{ animationDelay: "80ms" }}
      >
        Building software for clinical trials, carbon credits, and Belgian
        payroll — <em className="font-normal italic text-ember">in roughly that order</em>.
      </h1>

      <p
        className="animate-settle-in max-w-prose font-sans text-lg leading-relaxed text-ink-soft [text-wrap:pretty]"
        style={{ animationDelay: "160ms" }}
      >
        Five years writing TypeScript and C#. Founding engineer at n-side, built
        tris.earth solo, and currently making Belgian payslips less mysterious
        at Payflip. Available for contract and consulting work from Q3 2026.
      </p>

      <div
        className="animate-settle-in flex flex-wrap items-center gap-3"
        style={{ animationDelay: "240ms" }}
      >
        <Button variant="primary" size="lg">
          Hire me for contract work
        </Button>
        <Button variant="secondary" size="lg">
          See recent work
        </Button>
        <Button variant="ghost" size="lg">
          Read the writing
        </Button>
      </div>
    </section>
  );
}

function RecentWork() {
  return (
    <section id="work" className="border-t border-rule py-24">
      <SectionHeader
        index={1}
        eyebrow="Recent work"
        title="Four projects across three unreasonable domains."
        lede="Clinical trial logistics, carbon credit accounting, and continental payroll have nothing in common except that they're all harder than they look. Brief tours below."
      />

      <ol className="mt-16 flex flex-col divide-y divide-rule">
        {PROJECTS.map((project, i) => (
          <li
            key={project.name}
            className="animate-settle-in group grid grid-cols-1 gap-x-10 gap-y-4 py-8 md:grid-cols-[10rem_1fr_auto]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex flex-col gap-1 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
              <span>{project.period}</span>
              <span>{project.role}</span>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="font-display text-2xl font-normal leading-tight tracking-[-0.01em] text-ink">
                <span className="transition-[font-style,color] duration-200 ease-settle group-hover:italic group-hover:text-ember">
                  {project.name}
                </span>
              </h3>
              <p className="max-w-prose font-sans text-base leading-relaxed text-ink-soft">
                {project.blurb}
              </p>
            </div>

            <div className="self-end md:self-center">
              {project.href && (
                <Link href={project.href} className="text-sm">
                  Visit
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Currently() {
  return (
    <section className="border-t border-rule py-24">
      <SectionHeader
        index={2}
        eyebrow="Currently"
        title="Belgian payroll by day. Tower defense by night."
        lede="At Payflip, I work on payments infrastructure for Belgian employers. On the side: a Unity tower-defense game, a jam-grade platformer, and a small LLM product that mostly exists to keep me honest about latency."
      />

      <div className="mt-10 flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
        <Stat label="Based" value="Brussels" />
        <span aria-hidden className="h-3 w-px bg-rule" />
        <Stat label="Stack" value="TypeScript · C# · PostGIS" />
        <span aria-hidden className="h-3 w-px bg-rule" />
        <Stat label="Open to" value="Contract · Consulting" />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-ember">§</span>
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </span>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-24 flex flex-col gap-6 border-t border-rule py-10 md:flex-row md:items-center md:justify-between">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
        © 2026 — Built with too much coffee
      </p>
      <div className="flex items-center gap-6 font-sans text-sm">
        <Link href="mailto:leo@example.com">leo@example.com</Link>
        <Link href="https://github.com/forloopcowboy">GitHub</Link>
        <Link href="https://www.linkedin.com/in/leogonsalves">LinkedIn</Link>
      </div>
    </footer>
  );
}

