/**
 * CPU port of the head shader (shaders/head.frag.glsl) for environments with no
 * WebGL — namely the server, for link-preview images. It ray-traces the unit
 * sphere through the same camera the editor uses and mirrors the shader's
 * feature compositing and lighting, so the preview matches what the editor shows.
 *
 * If you change the shader, change this too.
 */
import { FeatureType, type HeadConfig, type FeatureConfig } from '../types';

/** A decoded, non-premultiplied RGBA atlas (what a PNG decoder produces). */
export interface Atlas {
  width: number;
  height: number;
  data: ArrayLike<number>;
}

export interface RenderHeadImageOptions {
  config: HeadConfig;
  atlases: Partial<Record<FeatureType, Atlas>>;
  width: number;
  height: number;
  /** Opaque background, 0-255 per channel. */
  background: [number, number, number];
  /** Camera distance from the sphere centre. Larger = smaller head. */
  cameraDistance?: number;
  /** Samples per axis per pixel for edge antialiasing. */
  supersample?: number;
}

const FOV_DEG = 40;
// Same order the fragment shader composites in (bottom to top).
const COMPOSITE_ORDER = [
  FeatureType.Mouth,
  FeatureType.Eye,
  FeatureType.Eyebrow,
  FeatureType.FacialHair,
  FeatureType.Nose,
  FeatureType.Accessory,
] as const;

// u_lightDirection = normalize(-1, -1, 0.8), light/ambient colours from createHeadMaterial.ts
const LIGHT_LEN = Math.hypot(-1, -1, 0.8);
const LIGHT: [number, number, number] = [
  -1 / LIGHT_LEN,
  -1 / LIGHT_LEN,
  0.8 / LIGHT_LEN,
];
const LIGHT_COLOR = [1.0, 0.98, 0.95];
const AMBIENT_COLOR = [0.35, 0.35, 0.4];

function sampleAtlas(
  atlas: Atlas,
  u: number,
  v: number,
  out: [number, number, number, number],
): void {
  // Matches THREE.LinearFilter + ClampToEdge + flipY=true (v=0 is the bottom row).
  const fx = u * atlas.width - 0.5;
  const fy = (1 - v) * atlas.height - 0.5;
  const x0 = Math.floor(fx);
  const y0 = Math.floor(fy);
  const tx = fx - x0;
  const ty = fy - y0;
  const maxX = atlas.width - 1;
  const maxY = atlas.height - 1;
  const xa = Math.min(maxX, Math.max(0, x0));
  const xb = Math.min(maxX, Math.max(0, x0 + 1));
  const ya = Math.min(maxY, Math.max(0, y0));
  const yb = Math.min(maxY, Math.max(0, y0 + 1));
  const d = atlas.data;
  const i00 = (ya * atlas.width + xa) * 4;
  const i10 = (ya * atlas.width + xb) * 4;
  const i01 = (yb * atlas.width + xa) * 4;
  const i11 = (yb * atlas.width + xb) * 4;
  for (let c = 0; c < 4; c++) {
    const top = d[i00 + c] * (1 - tx) + d[i10 + c] * tx;
    const bottom = d[i01 + c] * (1 - tx) + d[i11 + c] * tx;
    out[c] = (top * (1 - ty) + bottom * ty) / 255;
  }
}

interface PreparedFeature {
  atlas: Atlas;
  cellMinU: number;
  cellMinV: number;
  cellSizeU: number;
  cellSizeV: number;
  centerU: number;
  centerV: number;
  scale: number;
}

function prepareFeature(
  config: HeadConfig,
  type: FeatureType,
  atlas: Atlas | undefined,
): PreparedFeature | null {
  const f: FeatureConfig | undefined = config.features[type];
  if (!f || !f.enabled || !atlas) return null;
  const cols = Math.trunc(config.gridCols);
  const rows = Math.trunc(config.gridRows);
  const index = Math.trunc(f.index);
  const cellCol = index % cols;
  const cellRow = rows - 1 - Math.trunc(index / cols);
  return {
    atlas,
    cellMinU: cellCol / cols,
    cellMinV: cellRow / rows,
    cellSizeU: 1 / cols,
    cellSizeV: 1 / rows,
    centerU: 0.5 + f.translation[0],
    centerV: 0.5 + f.translation[1],
    scale: Math.max(f.scale, 0.05),
  };
}

export function renderHeadImage(opts: RenderHeadImageOptions): Uint8Array {
  const { config, atlases, width, height, background } = opts;
  const ss = Math.max(1, Math.round(opts.supersample ?? 3));
  const camZ = opts.cameraDistance ?? 4.2;
  const tanHalf = Math.tan((FOV_DEG * Math.PI) / 360);
  const aspect = width / height;

  const features = COMPOSITE_ORDER.map((t) =>
    prepareFeature(config, t, atlases[t]),
  ).filter((f): f is PreparedFeature => f !== null);

  const out = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    out[i * 4] = background[0];
    out[i * 4 + 1] = background[1];
    out[i * 4 + 2] = background[2];
    out[i * 4 + 3] = 255;
  }

  // Only visit pixels that can touch the sphere.
  const angular = Math.asin(1 / camZ);
  const ndcRadius = Math.tan(angular) / tanHalf; // in units of half image height
  const cx = width / 2;
  const cy = height / 2;
  const pxRadius = ndcRadius * (height / 2) * 1.05 + 2;
  const xMin = Math.max(0, Math.floor(cx - pxRadius));
  const xMax = Math.min(width - 1, Math.ceil(cx + pxRadius));
  const yMin = Math.max(0, Math.floor(cy - pxRadius));
  const yMax = Math.min(height - 1, Math.ceil(cy + pxRadius));

  const sample: [number, number, number, number] = [0, 0, 0, 0];
  const base = config.baseColor;
  const TWO_PI = Math.PI * 2;

  for (let py = yMin; py <= yMax; py++) {
    for (let px = xMin; px <= xMax; px++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let hits = 0;

      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const ndcX = (((px + (sx + 0.5) / ss) / width) * 2 - 1) * aspect;
          const ndcY = 1 - ((py + (sy + 0.5) / ss) / height) * 2;
          // Ray from (0,0,camZ) towards -z.
          let dx = ndcX * tanHalf;
          let dy = ndcY * tanHalf;
          let dz = -1;
          const dl = Math.hypot(dx, dy, dz);
          dx /= dl;
          dy /= dl;
          dz /= dl;

          // |o + t d| = 1, o = (0,0,camZ)
          const bq = camZ * dz;
          const disc = bq * bq - (camZ * camZ - 1);
          if (disc < 0) continue;
          const t = -bq - Math.sqrt(disc);
          if (t <= 0) continue;
          const wx = dx * t;
          const wy = dy * t;
          const wz = camZ + dz * t;

          // World -> mesh-local, inverting rotation.y = -PI/2 and scale.y = -1.
          const lx = wz;
          const ly = -wy;
          const lz = -wx;
          const u = (Math.atan2(lz, -lx) / TWO_PI + 1) % 1;
          const v = Math.acos(Math.max(-1, Math.min(1, ly))) / Math.PI;

          let cr = base[0];
          let cg = base[1];
          let cb = base[2];

          const latitude = (v - 0.5) * Math.PI;
          const cosLat = Math.cos(latitude);
          for (const f of features) {
            const localX =
              ((u - f.centerU) * 2 * cosLat) / f.scale + 0.5;
            const localY = (v - f.centerV) / f.scale + 0.5;
            if (localX < 0 || localX > 1 || localY < 0 || localY > 1) continue;
            sampleAtlas(
              f.atlas,
              f.cellMinU + localX * f.cellSizeU,
              f.cellMinV + localY * f.cellSizeV,
              sample,
            );
            const a = sample[3];
            cr += (sample[0] - cr) * a;
            cg += (sample[1] - cg) * a;
            cb += (sample[2] - cb) * a;
          }

          // The vertex shader derives its "normal" from UVs in a different
          // frame than the position, then applies normalMatrix. Reproduced as-is
          // so shading matches the editor: N = R * S * (p.z, -p.y, p.x).
          const nx = -wz;
          const ny = -wy;
          const nz = -wx;
          const nl = Math.hypot(nx, ny, nz) || 1;
          const ndotl = Math.max(
            0,
            Math.min(1, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / nl),
          );
          r += cr * LIGHT_COLOR[0] * ndotl + AMBIENT_COLOR[0] * cr;
          g += cg * LIGHT_COLOR[1] * ndotl + AMBIENT_COLOR[1] * cg;
          b += cb * LIGHT_COLOR[2] * ndotl + AMBIENT_COLOR[2] * cb;
          hits++;
        }
      }

      if (hits === 0) continue;
      const total = ss * ss;
      const cover = hits / total;
      const o = (py * width + px) * 4;
      // Samples are summed across hits; average them, then blend over background.
      out[o] = clamp8((r / hits) * cover * 255 + background[0] * (1 - cover));
      out[o + 1] = clamp8((g / hits) * cover * 255 + background[1] * (1 - cover));
      out[o + 2] = clamp8((b / hits) * cover * 255 + background[2] * (1 - cover));
    }
  }

  return out;
}

function clamp8(n: number): number {
  return n < 0 ? 0 : n > 255 ? 255 : Math.round(n);
}
