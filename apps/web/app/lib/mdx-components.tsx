import type { MDXComponents } from "mdx/types";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import { Link, cn } from "@personal/ui";

/**
 * Component overrides for MDX bodies in `content/projects/*.mdx`.
 * Styled to match STYLE_GUIDE.md — Fraunces for headings, Inter for prose,
 * JetBrains Mono for inline code, ember accent on links.
 */
export const projectMdxComponents: MDXComponents = {
  h2: ({ children, ...rest }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...rest}
      className="mt-16 flex items-baseline gap-4 font-display text-3xl font-light leading-tight tracking-[-0.015em] text-ink first:mt-0 md:text-4xl"
    >
      <span aria-hidden className="h-px w-8 translate-y-[-0.4em] bg-rule" />
      <span>{children}</span>
    </h2>
  ),
  h3: ({ children, ...rest }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...rest}
      className="mt-10 font-display text-2xl font-normal leading-tight tracking-[-0.01em] text-ink"
    >
      {children}
    </h3>
  ),
  p: ({ children, ...rest }: HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...rest}
      className="mt-5 max-w-prose font-sans text-base leading-relaxed text-ink-soft [text-wrap:pretty]"
    >
      {children}
    </p>
  ),
  ul: ({ children, ...rest }: HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...rest}
      className="mt-6 flex max-w-prose flex-col gap-3 font-sans text-base leading-relaxed text-ink-soft"
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...rest }: HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...rest}
      className="mt-6 flex max-w-prose list-decimal flex-col gap-3 pl-5 font-sans text-base leading-relaxed text-ink-soft"
    >
      {children}
    </ol>
  ),
  li: ({ children, ...rest }: HTMLAttributes<HTMLLIElement>) => (
    <li
      {...rest}
      className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-ember/70"
    >
      <span className="text-ink">{children}</span>
    </li>
  ),
  a: ({
    href,
    children,
    className,
    ...rest
  }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <Link href={href} className={cn("text-base", className)} {...rest}>
      {children as ReactNode}
    </Link>
  ),
  code: ({ children, ...rest }: HTMLAttributes<HTMLElement>) => (
    <code
      {...rest}
      className="rounded-sm bg-ember/[0.08] px-1.5 py-0.5 font-mono text-[0.85em] text-ink"
    >
      {children}
    </code>
  ),
  pre: ({ children, ...rest }: HTMLAttributes<HTMLPreElement>) => (
    <pre
      {...rest}
      className="mt-6 max-w-prose overflow-x-auto rounded-md border border-rule bg-paper-raised p-4 font-mono text-sm leading-relaxed text-ink"
    >
      {children}
    </pre>
  ),
  strong: ({ children, ...rest }: HTMLAttributes<HTMLElement>) => (
    <strong {...rest} className="font-medium text-ink">
      {children}
    </strong>
  ),
  em: ({ children, ...rest }: HTMLAttributes<HTMLElement>) => (
    <em {...rest} className="italic text-ink">
      {children}
    </em>
  ),
  hr: () => <hr className="mt-12 border-0 border-t border-rule" />,
};
