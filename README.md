# forloopcowboy.com

Personal portfolio and contact site for Leo Gonsalves — interdisciplinary software engineer.

Built with React Router v7, Vite, Tailwind CSS, and MDX. Bilingual (English + Portuguese).

## Stack

| Layer | Tool |
|-------|------|
| Framework | React 19 + React Router v7 (file-based routing, SSR) |
| Build | Vite 6 + MDX |
| Styling | Tailwind CSS 3.4 (custom design tokens in `libs/ui`) |
| i18n | i18next + react-i18next |
| Email | Resend (contact form) |
| Monorepo | Nx + pnpm workspaces |

## Structure

```
apps/web/          Main website application
  app/routes/      File-based routes (home, projects, contact)
  app/content/     MDX project write-ups (en-us, pt-br)
  app/i18n/        Translation files
  app/lib/         Utilities (project registry, contact form logic)
libs/ui/           Shared component library + Tailwind preset
```

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

### Environment variables

The contact form requires two env vars in `apps/web/.env`:

```
RESEND_API_KEY=...
CONTACT_FORM_SECRET=...
```

`RESEND_API_KEY` — from [resend.com](https://resend.com). `CONTACT_FORM_SECRET` — any random 32+ character hex string, used to HMAC-sign form timestamps.

## Build & serve

```bash
pnpm build
pnpm start        # runs react-router-serve on the build output
```

## License

This is a personal portfolio. The code is public for reference but not licensed for reuse.
