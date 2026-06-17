import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface SectionHeaderProps {
  /** Optional section number — rendered as `§ 02` in mono, ember-colored. */
  index?: string | number;
  /** Small label rendered alongside the index in mono uppercase. */
  eyebrow?: string;
  /** Headline. Set in display serif. */
  title: ReactNode;
  /** Optional lede paragraph below the title. */
  lede?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const indexLabel =
    typeof index === 'number' ? index.toString().padStart(2, '0') : index;
  const hasMeta = Boolean(indexLabel || eyebrow);

  return (
    <header
      className={cn(
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {hasMeta && (
        <div className="mb-6 flex items-center gap-3 text-ink-soft">
          {indexLabel && (
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ember">
              § {indexLabel}
            </span>
          )}
          {eyebrow && (
            <>
              <span aria-hidden className="h-px w-8 bg-rule" />
              <span className="font-mono text-xs uppercase tracking-[0.18em]">
                {eyebrow}
              </span>
            </>
          )}
        </div>
      )}
      <h2 className="font-display text-4xl font-light leading-[1.04] tracking-[-0.02em] text-ink md:text-5xl [text-wrap:balance]">
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
