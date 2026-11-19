import { PNG } from 'pngjs';
import { FeatureType, DEFAULT_TEXTURE_URLS } from '@personal/head-renderer';
import {
  renderHeadImage,
  type Atlas,
} from '@personal/head-renderer/cpu';
import type { HeadConfig } from '@personal/head-renderer';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
// `paper-raised` in the dark theme, the same backdrop the editor canvas sits on.
const OG_BACKGROUND: [number, number, number] = [36, 29, 34];

// Decoded atlases are ~16MB each; keep them for the lifetime of the (warm) instance.
const atlasCache = new Map<string, Promise<Atlas>>();

function loadAtlas(url: string): Promise<Atlas> {
  let pending = atlasCache.get(url);
  if (!pending) {
    pending = (async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to load atlas ${url}: ${res.status}`);
      const png = PNG.sync.read(Buffer.from(await res.arrayBuffer()));
      return { width: png.width, height: png.height, data: png.data };
    })();
    atlasCache.set(url, pending);
    pending.catch(() => atlasCache.delete(url));
  }
  return pending;
}

/** Renders the head as a 1200x630 PNG. `origin` is where the atlas assets are served from. */
export async function renderHeadPng(
  config: HeadConfig,
  origin: string,
): Promise<Buffer> {
  // Only fetch atlases for features that are actually switched on.
  const atlases: Partial<Record<FeatureType, Atlas>> = {};
  await Promise.all(
    (Object.entries(DEFAULT_TEXTURE_URLS) as [string, string][]).map(
      async ([key, url]) => {
        const type = Number(key) as FeatureType;
        if (!config.features[type]?.enabled) return;
        atlases[type] = await loadAtlas(new URL(url, origin).href);
      },
    ),
  );

  const rgba = renderHeadImage({
    config,
    atlases,
    width: OG_WIDTH,
    height: OG_HEIGHT,
    background: OG_BACKGROUND,
  });

  const png = new PNG({ width: OG_WIDTH, height: OG_HEIGHT });
  png.data = Buffer.from(rgba.buffer, rgba.byteOffset, rgba.byteLength);
  return PNG.sync.write(png, { colorType: 2, deflateLevel: 9 });
}
