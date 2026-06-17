import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  children: ReactNode;
}

const inkPullUnderline = [
  'group inline-flex items-baseline gap-1',
  'font-sans font-medium text-ink',
  'bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat',
  'bg-[length:0%_1px] bg-[position:0_92%]',
  'hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]',
  'hover:text-ember focus-visible:text-ember',
  'transition-[background-size,color] duration-300 ease-settle',
  'focus-visible:outline-none',
].join(' ');

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ external, children, className, target, rel, href, ...rest }, ref) => {
    const looksExternal =
      typeof href === 'string' && /^(https?:)?\/\//.test(href);
    const isExternal = external ?? looksExternal;

    return (
      <a
        ref={ref}
        href={href}
        target={isExternal ? target ?? '_blank' : target}
        rel={isExternal ? rel ?? 'noreferrer noopener' : rel}
        className={cn(inkPullUnderline, className)}
        {...rest}
      >
        <span>{children}</span>
        {isExternal && (
          <span
            aria-hidden="true"
            className={cn(
              'inline-block text-[0.85em] translate-y-px',
              'transition-transform duration-200 ease-out',
              'group-hover:-translate-y-[2px] group-hover:translate-x-[2px]',
              'group-focus-visible:-translate-y-[2px] group-focus-visible:translate-x-[2px]',
            )}
          >
            ↗
          </span>
        )}
      </a>
    );
  },
);
Link.displayName = 'Link';
