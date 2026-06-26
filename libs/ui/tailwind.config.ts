import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

const preset = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      paper: 'rgb(var(--color-paper) / <alpha-value>)',
      'paper-raised': 'rgb(var(--color-paper-raised) / <alpha-value>)',
      ink: 'rgb(var(--color-ink) / <alpha-value>)',
      'ink-soft': 'rgb(var(--color-ink-soft) / <alpha-value>)',
      rule: 'rgb(var(--color-rule) / <alpha-value>)',
      ember: 'rgb(var(--color-ember) / <alpha-value>)',
      'ember-deep': 'rgb(var(--color-ember-deep) / <alpha-value>)',
      teal: 'rgb(var(--color-teal) / <alpha-value>)',
      'teal-deep': 'rgb(var(--color-teal-deep) / <alpha-value>)',
      mauve: 'rgb(var(--color-mauve) / <alpha-value>)',
      wood: 'rgb(var(--color-wood) / <alpha-value>)',
      peach: 'rgb(var(--color-peach) / <alpha-value>)',
    },
    extend: {
      fontFamily: {
        display: ['Fraunces', ...defaultTheme.fontFamily.serif],
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.02em' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.625rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.375rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em' }],
        '3xl': ['2.25rem', { lineHeight: '2.625rem', letterSpacing: '-0.015em' }],
        '4xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '5xl': ['4.25rem', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        '6xl': ['6rem', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
      },
      spacing: {
        gutter: '5rem',
        column: '38rem',
      },
      maxWidth: {
        column: '38rem',
        prose: '40rem',
        page: '72rem',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '10px',
        xl: '14px',
        '2xl': '20px',
        full: '9999px',
      },
      transitionTimingFunction: {
        settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'settle-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'settle-in': 'settle-in 480ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [typography],
} satisfies Partial<Config>;

export default preset;
