export enum FeatureType {
  Mouth = 0,
  Eye = 1,
  Nose = 2,
  Eyebrow = 3,
  FacialHair = 4,
  Accessory = 5,
}

export interface FeatureConfig {
  index: number;
  translation: [number, number];
  scale: number;
  enabled: boolean;
}

export interface HeadConfig {
  baseColor: [number, number, number];
  gridCols: number;
  gridRows: number;
  metallic: number;
  smoothness: number;
  features: Partial<Record<FeatureType, FeatureConfig>>;
}

export interface HeadRendererOptions {
  config: HeadConfig;
  textures?: Partial<Record<FeatureType, string>>;
  width?: number;
  height?: number;
  pixelRatio?: number;
}

export const DEFAULT_CONFIG: HeadConfig = {
  baseColor: [0.9, 0.75, 0.65],
  gridCols: 4,
  gridRows: 4,
  metallic: 0,
  smoothness: 0.5,
  features: {
    [FeatureType.Eye]: {
      index: 0,
      translation: [0, 0.12],
      scale: 0.45,
      enabled: true,
    },
    [FeatureType.Nose]: {
      index: 0,
      translation: [0, 0.1],
      scale: 0.3,
      enabled: true,
    },
    [FeatureType.Mouth]: {
      index: 0,
      translation: [0, 0],
      scale: 0.72,
      enabled: true,
    },
    [FeatureType.Eyebrow]: {
      index: 0,
      translation: [0, 0.1],
      scale: 0.64,
      enabled: true,
    },
    [FeatureType.FacialHair]: {
      index: 0,
      translation: [0, 0],
      scale: 0.3,
      enabled: false,
    },
    [FeatureType.Accessory]: {
      index: 0,
      translation: [0, 0],
      scale: 0.3,
      enabled: false,
    },
  },
};

export const SMILEY_CONFIG: HeadConfig = {
  baseColor: [0.78, 0.79, 0.1],
  gridCols: 4,
  gridRows: 4,
  metallic: 0,
  smoothness: 0.5,
  features: {
    [FeatureType.Mouth]: {
      index: 0,
      translation: [0, -0.06],
      scale: 0.4,
      enabled: true,
    },
    [FeatureType.Eye]: {
      index: 0,
      translation: [0, 0.07],
      scale: 0.476,
      enabled: true,
    },
    [FeatureType.Nose]: {
      index: 15,
      translation: [0, 0],
      scale: 0.2,
      enabled: true,
    },
    [FeatureType.Eyebrow]: {
      index: 15,
      translation: [0, 0.1],
      scale: 0.3,
      enabled: false,
    },
    [FeatureType.FacialHair]: {
      index: 0,
      translation: [0, -0.05],
      scale: 0.45,
      enabled: false,
    },
  },
};
