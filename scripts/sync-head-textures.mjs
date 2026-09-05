#!/usr/bin/env node
// Copies the Bad Tourist feature atlases from the Unity project into libs/head-renderer/assets so the
// website head editor renders exactly what the game renders.
//
//   pnpm sync:head-textures            copy any atlas whose contents differ
//   pnpm sync:head-textures --check    report drift only (exit 1 when out of sync)
//   HEAD_TEXTURES_SOURCE=/path/to/Textures pnpm sync:head-textures
//
// The head shader slices every atlas into a fixed 4x4 grid (libs/head-renderer/src/types.ts), so a
// warning is printed when an atlas is not 2048x2048.

import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const DEFAULT_SOURCE = path.resolve(
  REPO_ROOT,
  '../../UnityProjects/BadTourist/Assets/Resources/Textures',
);
const SOURCE_DIR = process.env.HEAD_TEXTURES_SOURCE
  ? path.resolve(process.env.HEAD_TEXTURES_SOURCE)
  : DEFAULT_SOURCE;
const DEST_DIR = path.join(REPO_ROOT, 'libs/head-renderer/assets');
const ATLAS_NAMES = ['Eye', 'Nose', 'Mouth', 'Eyebrow', 'FacialHair'];
const EXPECTED_SIZE = 2048;

const checkOnly = process.argv.includes('--check');

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function readPngSize(buffer) {
  // PNG: 8-byte signature, then the IHDR chunk whose data starts at byte 16 (width, height as big-endian u32).
  const isPng =
    buffer.length >= 24 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47;
  if (!isPng) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

if (!existsSync(SOURCE_DIR)) {
  console.error(`Source directory not found: ${SOURCE_DIR}`);
  console.error(
    "Set HEAD_TEXTURES_SOURCE to the game's Assets/Resources/Textures folder.",
  );
  process.exit(1);
}

let failures = 0;
let drift = 0;

for (const name of ATLAS_NAMES) {
  const fileName = `${name}Textures.png`;
  const sourcePath = path.join(SOURCE_DIR, fileName);
  const destPath = path.join(DEST_DIR, fileName);

  if (!existsSync(sourcePath)) {
    console.error(`missing   ${fileName} (expected at ${sourcePath})`);
    failures++;
    continue;
  }

  const sourceBuffer = readFileSync(sourcePath);
  const size = readPngSize(sourceBuffer);
  if (!size) {
    console.error(`invalid   ${fileName} is not a PNG`);
    failures++;
    continue;
  }
  if (size.width !== EXPECTED_SIZE || size.height !== EXPECTED_SIZE) {
    console.warn(
      `warning   ${fileName} is ${size.width}x${size.height}; the shader assumes a ${EXPECTED_SIZE}x${EXPECTED_SIZE} 4x4 atlas`,
    );
  }

  const destExists = existsSync(destPath);
  const unchanged =
    destExists && sha256(readFileSync(destPath)) === sha256(sourceBuffer);

  if (unchanged) {
    console.log(`unchanged ${fileName}`);
    continue;
  }

  drift++;
  if (checkOnly) {
    console.log(`outdated  ${fileName}`);
    continue;
  }

  copyFileSync(sourcePath, destPath);
  console.log(`updated   ${fileName}`);
}

if (failures > 0) {
  console.error(
    `${failures} atlas file(s) could not be read from ${SOURCE_DIR}`,
  );
  process.exit(1);
}

if (checkOnly && drift > 0) {
  console.error(
    `${drift} atlas file(s) are out of date; run "pnpm sync:head-textures"`,
  );
  process.exit(1);
}

console.log(
  checkOnly
    ? 'All head textures are in sync.'
    : `Done (${drift} file(s) updated).`,
);
