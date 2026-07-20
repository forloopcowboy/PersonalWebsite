import type * as THREE_NS from 'three';
import type { HeadConfig, FeatureConfig } from './types';
import { FeatureType } from './types';
import vertexShader from './shaders/head.vert.glsl?raw';
import fragmentShader from './shaders/head.frag.glsl?raw';

import eyeTextureUrl from '../assets/EyeTextures.png';
import noseTextureUrl from '../assets/NoseTextures.png';
import mouthTextureUrl from '../assets/MouthTextures.png';
import eyebrowTextureUrl from '../assets/EyebrowTextures.png';
import facialHairTextureUrl from '../assets/FacialHairTextures.png';

const DEFAULT_TEXTURE_URLS: Partial<Record<FeatureType, string>> = {
  [FeatureType.Eye]: eyeTextureUrl,
  [FeatureType.Nose]: noseTextureUrl,
  [FeatureType.Mouth]: mouthTextureUrl,
  [FeatureType.Eyebrow]: eyebrowTextureUrl,
  [FeatureType.FacialHair]: facialHairTextureUrl,
};

function featureUniforms(
  THREE: typeof THREE_NS,
  prefix: string,
  feature: FeatureConfig | undefined,
  texture: THREE_NS.Texture | null,
) {
  const f = feature ?? { index: 0, translation: [0, 0] as [number, number], scale: 0.3, enabled: false };
  return {
    [`u_${prefix}Tex`]: { value: texture },
    [`u_${prefix}Index`]: { value: f.index },
    [`u_${prefix}Translation`]: { value: new THREE.Vector3(f.translation[0], f.translation[1], f.scale) },
    [`u_${prefix}Enabled`]: { value: f.enabled ? 1.0 : 0.0 },
  };
}

function updateFeatureUniforms(
  THREE: typeof THREE_NS,
  uniforms: Record<string, { value: unknown }>,
  prefix: string,
  feature: FeatureConfig | undefined,
) {
  const f = feature ?? { index: 0, translation: [0, 0] as [number, number], scale: 0.3, enabled: false };
  uniforms[`u_${prefix}Index`].value = f.index;
  (uniforms[`u_${prefix}Translation`].value as THREE_NS.Vector3).set(f.translation[0], f.translation[1], f.scale);
  uniforms[`u_${prefix}Enabled`].value = f.enabled ? 1.0 : 0.0;
}

export interface HeadMaterial {
  material: THREE_NS.ShaderMaterial;
  updateConfig: (config: HeadConfig) => void;
  dispose: () => void;
}

export async function createHeadMaterial(
  THREE: typeof THREE_NS,
  config: HeadConfig,
  textureOverrides?: Partial<Record<FeatureType, string>>,
): Promise<HeadMaterial> {
  const loader = new THREE.TextureLoader();
  const textures: Partial<Record<FeatureType, THREE_NS.Texture>> = {};

  const urls = { ...DEFAULT_TEXTURE_URLS, ...textureOverrides };

  const loadPromises = Object.entries(urls).map(async ([key, url]) => {
    if (!url) return;
    const ft = Number(key) as FeatureType;
    const tex = await loader.loadAsync(url);
    tex.flipY = true;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    textures[ft] = tex;
  });

  await Promise.all(loadPromises);

  const placeholderData = new Uint8Array([255, 255, 255, 0]);
  const placeholderTex = new THREE.DataTexture(placeholderData, 1, 1, THREE.RGBAFormat);
  placeholderTex.needsUpdate = true;

  const uniforms: Record<string, { value: unknown }> = {
    u_baseColor: { value: new THREE.Vector3(...config.baseColor) },
    u_metallic: { value: config.metallic },
    u_smoothness: { value: config.smoothness },
    u_gridCols: { value: config.gridCols },
    u_gridRows: { value: config.gridRows },
    u_lightDirection: { value: new THREE.Vector3(0.5, 1.0, 0.8).normalize() },
    u_lightColor: { value: new THREE.Vector3(1.0, 0.98, 0.95) },
    u_ambientColor: { value: new THREE.Vector3(0.35, 0.35, 0.4) },
    ...featureUniforms(THREE, 'eyes', config.features[FeatureType.Eye], textures[FeatureType.Eye] ?? placeholderTex),
    ...featureUniforms(THREE, 'nose', config.features[FeatureType.Nose], textures[FeatureType.Nose] ?? placeholderTex),
    ...featureUniforms(THREE, 'mouth', config.features[FeatureType.Mouth], textures[FeatureType.Mouth] ?? placeholderTex),
    ...featureUniforms(THREE, 'eyebrows', config.features[FeatureType.Eyebrow], textures[FeatureType.Eyebrow] ?? placeholderTex),
    ...featureUniforms(THREE, 'facialHair', config.features[FeatureType.FacialHair], textures[FeatureType.FacialHair] ?? placeholderTex),
    ...featureUniforms(THREE, 'accessory', config.features[FeatureType.Accessory], textures[FeatureType.Accessory] ?? placeholderTex),
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
  });

  function updateConfig(cfg: HeadConfig) {
    (uniforms.u_baseColor.value as THREE_NS.Vector3).set(...cfg.baseColor);
    uniforms.u_metallic.value = cfg.metallic;
    uniforms.u_smoothness.value = cfg.smoothness;
    uniforms.u_gridCols.value = cfg.gridCols;
    uniforms.u_gridRows.value = cfg.gridRows;

    updateFeatureUniforms(THREE, uniforms, 'eyes', cfg.features[FeatureType.Eye]);
    updateFeatureUniforms(THREE, uniforms, 'nose', cfg.features[FeatureType.Nose]);
    updateFeatureUniforms(THREE, uniforms, 'mouth', cfg.features[FeatureType.Mouth]);
    updateFeatureUniforms(THREE, uniforms, 'eyebrows', cfg.features[FeatureType.Eyebrow]);
    updateFeatureUniforms(THREE, uniforms, 'facialHair', cfg.features[FeatureType.FacialHair]);
    updateFeatureUniforms(THREE, uniforms, 'accessory', cfg.features[FeatureType.Accessory]);
  }

  function dispose() {
    material.dispose();
    for (const tex of Object.values(textures)) {
      tex?.dispose();
    }
    placeholderTex.dispose();
  }

  return { material, updateConfig, dispose };
}
