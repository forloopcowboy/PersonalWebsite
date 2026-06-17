# Style Guide

A warm-paper editorial aesthetic for a software-engineering portfolio. Playfulness lives in the typography and micro-interactions, not in decoration. This document is the source of truth — components should read like its sentences.

## 1. Concept

An *engineer's editorial*: a warm cream canvas (light) or deep cocoa-near-black (dark, default), deep ink for body, a single confident clay-red for accent, and JetBrains Mono used sparingly for metadata. Headlines set in **Fraunces** — a contemporary serif whose opsz/italic axes carry real personality — let type do the playful work. The site reads like a printed object that happens to be on the web. **Dark mode is the default**; light mode is wired and tested.

## 2. Principles

1. **Type does the work.** Fraunces' opsz and italic axes carry the personality. No illustration motifs, no theming layer.
2. **One accent.** Ember (persimmon) signals action, attention, and self. Everything else is ink on paper.
3. **Editorial, not corporate.** Sections breathe. Margins are generous. Body line-length stays inside ~65ch.
4. **Micro-interactions feel physical.** Buttons press, links draw an ink line, sections settle. No glow, no gradient hero, no parallax, no particles.
5. **Mono signals engineering, not terminal.** Used only for metadata, eyebrows, dates, and code — never body copy.

## 3. Color palette

Driven by CSS custom properties on `:root` and `.dark` (in `apps/web/app/app.css`) so dark mode is a class swap. Tailwind tokens map to those vars via `rgb(var(--…) / <alpha-value>)`, so opacity utilities (`bg-ember/10`) work.

| Token         | Light hex | Dark hex  | Use                                                 |
| ------------- | --------- | --------- | --------------------------------------------------- |
| `paper`       | `#F4EEE2` | `#15110D` | Page background. Warm, not pure white.              |
| `paper-raised`| `#FBF7EE` | `#1F1A14` | Cards, subtle elevation. Use sparingly.             |
| `ink`         | `#1A1714` | `#F0E8DA` | Body and headings. Warm near-black, never `#000`.   |
| `ink-soft`    | `#6B6258` | `#A8978A` | Captions, secondary copy, dividers' text neighbors. |
| `rule`        | `#E5DDCB` | `#2D2620` | Hairlines, card borders, input borders.             |
| `ember`       | `#984447` | `#C2575A` | The accent. Links on hover, primary CTA, eyebrow §. |
| `ember-deep`  | `#673739` | `#E0747A` | Hover/press state of `ember`.                       |

Rules:
- Black is never `#000`. White is never `#FFF`.
- Ember appears at most once per visual area. If you find yourself reaching for a second accent, you don't need one — use weight, size, or a rule.
- Never tint `ember` with itself for "subtle" accents. Use `ember/[0.06]` for backgrounds, full ember for ink.

## 4. Typography

**Stack** (Google Fonts):
- **Display:** Fraunces — opsz `9..144`, ital `0..1`, wght `100..900`. Use opsz to scale: small captions get opsz 14, hero gets opsz 144.
- **Body:** Inter — wght `400 / 500 / 600`.
- **Mono:** JetBrains Mono — wght `400 / 500`.

**Pairing rule:** Fraunces for headings and pull-quotes; Inter for prose and UI; JetBrains Mono for eyebrows, metadata, code, dates, and section numbers.

**Tailwind aliases:** `font-display` (Fraunces), `font-sans` (Inter), `font-mono` (JetBrains Mono).

**Scale** (`fontSize` token → `size / line-height / tracking`):

| Token  | Size      | Use                                            |
| ------ | --------- | ---------------------------------------------- |
| `xs`   | 12 / 16   | Mono eyebrows, badge labels                    |
| `sm`   | 14 / 22   | Captions, metadata                             |
| `base` | 16 / 26   | Body                                           |
| `lg`   | 18 / 28   | Lede paragraphs                                |
| `xl`   | 22 / 30   | Sub-display, large body                        |
| `2xl`  | 28 / 36   | Card titles                                    |
| `3xl`  | 36 / 42   | Subsection h3                                  |
| `4xl`  | 48 / 1.1  | Section h2 (mobile)                            |
| `5xl`  | 68 / 1.04 | Section h2 (desktop), Fraunces opsz ~96        |
| `6xl`  | 96 / 0.98 | Hero h1 only, Fraunces opsz 144, italic-allowed |

**Rules of thumb**
- Headings: `font-display` with `tracking-[-0.02em]` and `[text-wrap:balance]`. Default weight `300–400` (Fraunces is rich at low weights).
- Body: `font-sans` `text-base` `text-ink`. Line length capped at `max-w-prose` (40rem ≈ 65ch).
- Mono: always uppercase, always tracking `0.18em`, always at `text-xs` or `text-sm`. Never run as body.

## 5. Spacing & radii

**Spacing additions:** `gutter` (`5rem`, page side margins on desktop), `column` (`38rem`, body column width). Otherwise use Tailwind defaults — no need to reinvent the 4px scale.

**Radii are restrained:**

| Token   | Px  | Use                                |
| ------- | --- | ---------------------------------- |
| `none`  | 0   | Editorial rules, hairline dividers |
| `sm`    | 2   | Inputs, small chips                |
| `md`    | 6   | Buttons (default)                  |
| `lg`    | 10  | Cards                              |
| `xl`    | 14  | Large cards, modals                |
| `full`  | ∞   | Avatars, status dots only          |

Rule: never `rounded-2xl`+ on interactive surfaces. Soft enough to feel built, sharp enough to feel made.

## 6. Motion language

The site's micro-interaction language has four moves and only four:

1. **Ink-pull underlines.** Links carry no visible underline at rest; on hover, a 1px underline (in `currentColor`, which transitions to `ember`) grows from left to right over 300ms with a `cubic-bezier(0.22, 1, 0.36, 1)` settle. External links also show a `↗` glyph that lifts and slides 2px on hover. This is the site's signature gesture — use it whenever something is a real link, never for buttons.
2. **Press, don't glow.** Buttons shift `translate-y-px` on `:active` and tighten their shadow (`inset` on press) rather than expanding it. Hover deepens the color one step (`ember` → `ember-deep`). No box-glow, no gradient sheen.
3. **Settle-in, never fade.** Section content uses the `animate-settle-in` keyframe (6px up, opacity 0→1, 480ms `settle` easing). Stagger children by ~80ms. Below `prefers-reduced-motion`, drop the transform and keep opacity instant.
4. **Italics on emphasis hover.** Headings with hoverable spans (e.g. project titles) swap their Roman to Fraunces italic on hover with a 200ms ease — this is the one moment the typography "winks." Use at most twice per page.

Anything more elaborate than these four moves is decoration. Refuse it.

## 7. Voice & copy

Professional with personality. The audience is technical founders, EMs, and product people scoping consulting work — they should leave thinking *competent, specific, fun to work with*. Dry humor is allowed in deliberate doses: **one line per page maximum**. Never lead with the joke; the joke must follow a real claim.

**Lengths**
- Hero line: ≤ 14 words.
- Section ledes: ≤ 30 words.
- Project blurbs: ≤ 60 words.
- Captions/metadata: ≤ 8 words.

**Do**

- "Building software for clinical trials, carbon credits, and Belgian payroll — in roughly that order."
- "Five years writing TypeScript, three reading C# stack traces, and an unreasonable amount of time in PostGIS."
- "Founding engineer at n-side; built tris.earth solo for Brazilian landowners; now making Belgian payroll less mysterious."
- "Available for contract and consulting work from Q3 2026."

**Don't**

- "🚀 Passionate full-stack ninja crafting beautiful experiences." (sterile, performatively keen, emoji)
- "Yeehaw, partner — let's wrangle some code." (the handle is a wink, not a costume)
- "I love solving problems and learning new things." (generic; says nothing)
- Two jokes in one section. Cut to one.
- Marketing-voice verbs: *empower, leverage, unlock, drive, craft*. Use *built, shipped, ran, wrote, fixed*.

**Capitalization:** sentence case for headings (`Recent work`, not `Recent Work`). Mono eyebrows are `UPPERCASE` with letter-spacing. Project and company names keep their canonical casing (`n-side`, `tris.earth`, `Payflip`).

## 8. Implementation pointers

- Tailwind theme: `libs/ui/tailwind.config.ts` (canonical, typed).
- Color tokens: `apps/web/app/app.css` (CSS custom properties, `:root` + `.dark`).
- Fonts: loaded via `<link>` in `apps/web/app/root.tsx`. Self-host later if the design is locked.
- Primitives: `libs/ui/src/components/{Button,Link,SectionHeader}.tsx`. Hand-rolled with Tailwind; tiny `cn()` helper in `libs/ui/src/lib/cn.ts` (no clsx — it didn't earn the dep).
- Dark mode: toggle by adding `class="dark"` to `<html>`. Both palettes are wired; design and test light first.
