import { parseConfig } from '../lib/head-config';
import { renderHeadPng } from '../lib/head-og.server';
import { getOrigin } from '../lib/origin.server';
import type { Route } from './+types/og-ballhead';

/**
 * Link-preview image for the Ballhead Character Editor: renders the character
 * encoded in `?c=...` (or the default one) as a PNG.
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const config = parseConfig(url.searchParams);
  const png = await renderHeadPng(config, getOrigin(request));
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      // The URL fully determines the image, so let the CDN keep it around.
      'Cache-Control':
        'public, max-age=3600, s-maxage=2592000, stale-while-revalidate=86400',
    },
  });
}
