import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  type LinksFunction,
} from 'react-router';
import { useTranslation } from 'react-i18next';
import { faviconUrl, logo192Url, IllustrationNotFound } from '@personal/ui';
import appStylesUrl from './app.css?url';
import './i18n/config';
import { Analytics } from '@vercel/analytics/react';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
  },
  { rel: 'stylesheet', href: appStylesUrl },
  { rel: 'icon', href: faviconUrl, type: 'image/x-icon' },
  { rel: 'apple-touch-icon', href: logo192Url },
];

export default function Root() {
  const { i18n } = useTranslation();

  return (
    <html lang={i18n.language} className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <Analytics />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const is404 = isRouteErrorResponse(error) && error.status === 404;

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>{is404 ? 'Page not found' : 'Something went wrong'}</title>
      </head>
      <body>
        <main className="flex min-h-dvh flex-col items-center justify-center bg-paper px-6 text-ink">
          <IllustrationNotFound className="w-64 opacity-70" />
          <h1 className="mt-8 font-display text-4xl font-light tracking-[-0.02em] md:text-5xl">
            {is404 ? 'Page not found' : 'Something went wrong'}
          </h1>
          <p className="mt-4 max-w-[36ch] text-center font-sans text-lg text-ink-soft">
            {is404
              ? "The page you're looking for doesn't exist or has been moved."
              : 'An unexpected error occurred. Please try again.'}
          </p>
          <a
            href="/"
            className="mt-8 inline-flex h-12 items-center rounded-md bg-ember px-6 font-sans font-medium text-paper transition-colors duration-150 hover:bg-ember-deep"
          >
            Go home
          </a>
        </main>
        <Scripts />
      </body>
    </html>
  );
}
