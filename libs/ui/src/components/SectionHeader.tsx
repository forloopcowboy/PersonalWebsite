import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface SectionHeaderProps {
  /** Small label rendered in mono uppercase, preceded by a rule line. */
  eyebrow?: string;
  /** Hash link (e.g. `#work`) — when set, the eyebrow becomes a clickable anchor. */
  href?: string;
  /** Headline. Set in display serif. */
  title: ReactNode;
  /** Optional lede paragraph below the title. */
  lede?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  href,
  title,
  lede,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const eyebrowLabel = eyebrow && (
    <span className="font-mono text-xs uppercase tracking-[0.18em]">
      {eyebrow}
    </span>
  );

  return (
    <header
      className={cn(
        'flex flex-col',
        align === 'center'
          ? 'items-center text-center'
          : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && (
        <div className="mb-6 flex items-center gap-3 text-ink-soft">
          <span aria-hidden className="h-px w-8 bg-rule" />
          {href ? (
            <a
              href={href}
              className="transition-colors duration-200 ease-settle hover:text-teal focus-visible:text-teal focus-visible:outline-none"
            >
              {eyebrowLabel}
            </a>
          ) : (
            eyebrowLabel
          )}
        </div>
      )}
      <h2 className="font-display text-4xl font-light leading-[1.04] tracking-[-0.02em] text-ink [text-wrap:balance] md:text-5xl">
        {title}
      </h2>
      {lede && (
        <p
          className={cn(
            'mt-5 max-w-prose font-sans text-lg leading-relaxed text-ink-soft [text-wrap:pretty]',
            align === 'center' && 'mx-auto',
          )}
        >
          {lede}
        </p>
      )}
    </header>
  );
}
