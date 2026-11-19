/**
 * Compact, URL-safe serialization of a head configuration. Shared by the
 * editor (client) and the link-preview image route (server), so both always
 * agree on what `?c=...` means.
 */
import {
  FeatureType,
  SMILEY_CONFIG,
  type HeadConfig,
  type FeatureConfig,
} from '@personal/head-renderer';

const FEATURE_PARAM_KEYS: Record<FeatureType, string> = {
  [FeatureType.Mouth]: 'mouth',
  [FeatureType.Eye]: 'eye',
  [FeatureType.Nose]: 'nose',
  [FeatureType.Eyebrow]: 'brow',
  [FeatureType.FacialHair]: 'beard',
  [FeatureType.Accessory]: 'acc',
};

const PARAM_KEY_TO_FEATURE = Object.fromEntries(
  Object.entries(FEATURE_PARAM_KEYS).map(([k, v]) => [
    v,
    Number(k) as FeatureType,
  ]),
) as Record<string, FeatureType>;

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function toBase64Url(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    result += B64[b0 >> 2];
    result += B64[((b0 & 3) << 4) | (b1 >> 4)];
    if (i + 1 < bytes.length) result += B64[((b1 & 0xf) << 2) | (b2 >> 6)];
    if (i + 2 < bytes.length) result += B64[b2 & 0x3f];
  }
  return result;
}

function fromBase64Url(str: string): Uint8Array {
  const bytes: number[] = [];
  const vals = Array.from(str, (ch) => B64.indexOf(ch));
  for (let i = 0; i < vals.length; i += 4) {
    const v0 = vals[i];
    const v1 = vals[i + 1] ?? 0;
    const v2 = vals[i + 2] ?? 0;
    const v3 = vals[i + 3] ?? 0;
    bytes.push((v0 << 2) | (v1 >> 4));
    if (i + 2 < vals.length) bytes.push(((v1 & 0xf) << 4) | (v2 >> 2));
    if (i + 3 < vals.length) bytes.push(((v2 & 3) << 6) | v3);
  }
  return new Uint8Array(bytes);
}

const DEFAULT_FEATURE: FeatureConfig = {
  enabled: false,
  index: 0,
  translation: [0, 0],
  scale: 0.3,
};

const FEATURE_ORDER = [
  FeatureType.Mouth,
  FeatureType.Eye,
  FeatureType.Nose,
  FeatureType.Eyebrow,
  FeatureType.FacialHair,
  FeatureType.Accessory,
] as const;

function encodeFeature(fc: FeatureConfig): [number, number, number] {
  const en = fc.enabled ? 1 : 0;
  const idx = Math.max(0, Math.min(15, fc.index));
  const tx = Math.max(
    0,
    Math.min(60, Math.round((fc.translation[0] + 0.3) / 0.01)),
  );
  const ty = Math.max(
    0,
    Math.min(60, Math.round((fc.translation[1] + 0.3) / 0.01)),
  );
  const sc = Math.max(0, Math.min(95, Math.round((fc.scale - 0.05) / 0.01)));
  const bits = (en << 23) | (idx << 19) | (tx << 13) | (ty << 7) | sc;
  return [(bits >> 16) & 0xff, (bits >> 8) & 0xff, bits & 0xff];
}

function decodeFeature(b0: number, b1: number, b2: number): FeatureConfig {
  const bits = (b0 << 16) | (b1 << 8) | b2;
  return {
    enabled: ((bits >> 23) & 1) === 1,
    index: (bits >> 19) & 0xf,
    translation: [
      ((bits >> 13) & 0x3f) * 0.01 - 0.3,
      ((bits >> 7) & 0x3f) * 0.01 - 0.3,
    ],
    scale: Math.max(0.05, (bits & 0x7f) * 0.01 + 0.05),
  };
}

export function serializeConfig(config: HeadConfig): URLSearchParams {
  const buf = new Uint8Array(21);
  buf[0] = Math.round(config.baseColor[0] * 255);
  buf[1] = Math.round(config.baseColor[1] * 255);
  buf[2] = Math.round(config.baseColor[2] * 255);
  for (let i = 0; i < FEATURE_ORDER.length; i++) {
    const fc = config.features[FEATURE_ORDER[i]] ?? DEFAULT_FEATURE;
    const [a, b, c] = encodeFeature(fc);
    buf[3 + i * 3] = a;
    buf[4 + i * 3] = b;
    buf[5 + i * 3] = c;
  }
  const params = new URLSearchParams();
  params.set('c', toBase64Url(buf));
  return params;
}

export function parseConfig(params: URLSearchParams): HeadConfig {
  const compact = params.get('c');
  if (compact) {
    const bytes = fromBase64Url(compact);
    if (bytes.length >= 21) {
      const config: HeadConfig = {
        ...SMILEY_CONFIG,
        baseColor: [bytes[0] / 255, bytes[1] / 255, bytes[2] / 255],
        features: {},
      };
      for (let i = 0; i < FEATURE_ORDER.length; i++) {
        config.features[FEATURE_ORDER[i]] = decodeFeature(
          bytes[3 + i * 3],
          bytes[4 + i * 3],
          bytes[5 + i * 3],
        );
      }
      return config;
    }
  }

  // Legacy format fallback
  const config: HeadConfig = {
    ...SMILEY_CONFIG,
    features: { ...SMILEY_CONFIG.features },
  };
  const skinHex = params.get('skin');
  if (skinHex && /^[0-9a-fA-F]{6}$/.test(skinHex)) {
    config.baseColor = hexToRgb('#' + skinHex);
  }
  for (const [paramKey, featureType] of Object.entries(PARAM_KEY_TO_FEATURE)) {
    const raw = params.get(paramKey);
    if (!raw) continue;
    const parts = raw.split(',');
    if (parts.length !== 5) continue;
    const [e, idx, tx, ty, s] = parts;
    const index = parseInt(idx, 10);
    const translationX = parseFloat(tx);
    const translationY = parseFloat(ty);
    const scale = parseFloat(s);
    if (
      isNaN(index) ||
      index < 0 ||
      index > 15 ||
      isNaN(translationX) ||
      isNaN(translationY) ||
      isNaN(scale)
    )
      continue;
    config.features[featureType] = {
      enabled: e === '1',
      index,
      translation: [translationX, translationY],
      scale: Math.max(0.05, Math.min(1.0, scale)),
    };
  }
  return config;
}

