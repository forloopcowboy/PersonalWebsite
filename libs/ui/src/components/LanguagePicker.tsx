import { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface LanguageOption {
  code: string;
  label: string;
}

export interface LanguagePickerProps {
  value: string;
  options: readonly LanguageOption[];
  onChange: (code: string) => void;
  className?: string;
}

export const LanguagePicker = forwardRef<HTMLDivElement, LanguagePickerProps>(
  ({ value, options, onChange, className }, ref) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const current = options.find((o) => o.code === value);

    useEffect(() => {
      if (!open) return;
      function handleClick(e: MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      }
      function handleEscape(e: KeyboardEvent) {
        if (e.key === "Escape") setOpen(false);
      }
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClick);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [open]);

    if (options.length <= 1) {
      return (
        <div ref={ref} className={cn("relative", className)}>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
            {current?.label ?? value}
          </span>
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("relative", className)}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            "inline-flex items-center gap-1.5",
            "font-mono text-xs uppercase tracking-[0.18em]",
            "text-ink-soft transition-colors duration-200",
            "hover:text-ink focus-visible:text-ink",
            "focus-visible:outline-none"
          )}
        >
          {current?.label ?? value}
          <svg
            aria-hidden="true"
            viewBox="0 0 10 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "h-[6px] w-[10px] transition-transform duration-200 ease-settle",
              open && "rotate-180"
            )}
          >
            <path d="M1 1l4 4 4-4" />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            aria-activedescendant={`lang-${value}`}
            className={cn(
              "absolute right-0 top-full z-50 mt-2",
              "min-w-[6rem] overflow-hidden rounded-sm",
              "border border-rule bg-paper-raised",
              "shadow-[0_2px_8px_rgb(0_0_0/0.08)]",
              "animate-settle-in"
            )}
          >
            {options.map((opt) => (
              <li
                key={opt.code}
                id={`lang-${opt.code}`}
                role="option"
                aria-selected={opt.code === value}
                className={cn(
                  "cursor-pointer select-none px-4 py-2",
                  "font-mono text-xs uppercase tracking-[0.18em]",
                  "transition-colors duration-150",
                  opt.code === value
                    ? "text-ember"
                    : "text-ink-soft hover:text-ink hover:bg-ember/[0.06]"
                )}
                onClick={() => {
                  onChange(opt.code);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
LanguagePicker.displayName = "LanguagePicker";
