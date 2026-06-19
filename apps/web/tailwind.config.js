import preset from '@personal/ui/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    '../../libs/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
};
