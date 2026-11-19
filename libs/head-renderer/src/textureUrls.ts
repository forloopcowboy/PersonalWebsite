import { FeatureType } from './types';

import eyeTextureUrl from '../assets/EyeTextures.png';
import noseTextureUrl from '../assets/NoseTextures.png';
import mouthTextureUrl from '../assets/MouthTextures.png';
import eyebrowTextureUrl from '../assets/EyebrowTextures.png';
import facialHairTextureUrl from '../assets/FacialHairTextures.png';

/** Bundler-resolved URLs of the feature atlases (shared by the WebGL and CPU renderers). */
export const DEFAULT_TEXTURE_URLS: Partial<Record<FeatureType, string>> = {
  [FeatureType.Eye]: eyeTextureUrl,
  [FeatureType.Nose]: noseTextureUrl,
  [FeatureType.Mouth]: mouthTextureUrl,
  [FeatureType.Eyebrow]: eyebrowTextureUrl,
  [FeatureType.FacialHair]: facialHairTextureUrl,
};
