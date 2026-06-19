import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface AlertProps {
  variant?: 'error' | 'success';
  children: ReactNode;
  className?: string;
}

export function Alert({
  variant = 'error',
  children,
  className,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border p-4 text-sm',
        variant === 'error' && 'border-ember/30 bg-ember/[0.06] text-ink',
        variant === 'success' && 'border-rule bg-paper-raised text-ink',
        className,
      )}
    >
      {children}
    </div>
  );
}
