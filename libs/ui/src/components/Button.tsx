import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const base = [
  'inline-flex items-center justify-center gap-2',
  'font-sans font-medium tracking-[-0.01em]',
  'rounded-md select-none whitespace-nowrap',
  'transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-out',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
  'disabled:opacity-50 disabled:pointer-events-none',
  'active:translate-y-px',
].join(' ');

const variants: Record<ButtonVariant, string> = {
  primary: [
    'bg-ember text-paper',
    'shadow-[0_1px_0_rgb(0_0_0/0.12),inset_0_1px_0_rgb(255_255_255/0.08)]',
    'hover:bg-ember-deep',
    'active:shadow-[inset_0_1px_2px_rgb(0_0_0/0.20)]',
  ].join(' '),
  secondary: [
    'bg-paper text-ink border border-rule',
    'hover:border-ink/50 hover:shadow-[0_1px_0_rgb(0_0_0/0.05)]',
    'active:shadow-none',
  ].join(' '),
  ghost: [
    'bg-transparent text-ink',
    'hover:text-ember hover:bg-ember/[0.06]',
  ].join(' '),
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-[0.95rem]',
  lg: 'h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, type = 'button', ...rest }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    />
  ),
);
Button.displayName = 'Button';
