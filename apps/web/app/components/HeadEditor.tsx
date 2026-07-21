import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  HeadCanvas,
  FeatureType,
  SMILEY_CONFIG,
  type HeadConfig,
  type FeatureConfig,
} from '@personal/head-renderer';

const FEATURE_LABEL_KEYS: Record<FeatureType, string> = {
  [FeatureType.Eye]: 'head_editor.eyes',
  [FeatureType.Nose]: 'head_editor.nose',
  [FeatureType.Mouth]: 'head_editor.mouth',
  [FeatureType.Eyebrow]: 'head_editor.brows',
  [FeatureType.FacialHair]: 'head_editor.beard',
  [FeatureType.Accessory]: 'head_editor.accessory',
};

const EDITABLE_FEATURES = [
  FeatureType.Eye,
  FeatureType.Mouth,
  FeatureType.Nose,
  FeatureType.Eyebrow,
  FeatureType.FacialHair,
] as const;

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

const SKIN_SWATCHES: [number, number, number][] = [
  [0.96, 0.87, 0.77],
  [0.9, 0.75, 0.65],
  [0.82, 0.65, 0.5],
  [0.7, 0.5, 0.35],
  [0.55, 0.35, 0.22],
  [0.78, 0.79, 0.1],
  [0.65, 0.85, 0.65],
  [0.55, 0.65, 0.9],
  [0.9, 0.55, 0.55],
  [0.8, 0.55, 0.8],
];

function rgbToHex(c: [number, number, number]): string {
  return (
    '#' +
    c
      .map((v) =>
        Math.round(v * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}

function serializeConfig(config: HeadConfig): URLSearchParams {
  const params = new URLSearchParams();
  params.set('skin', rgbToHex(config.baseColor).slice(1));
  for (const [featureType, paramKey] of Object.entries(FEATURE_PARAM_KEYS)) {
    const fc = config.features[Number(featureType) as FeatureType];
    if (!fc) continue;
    const e = fc.enabled ? 1 : 0;
    const tx = parseFloat(fc.translation[0].toFixed(3));
    const ty = parseFloat(fc.translation[1].toFixed(3));
    const s = parseFloat(fc.scale.toFixed(3));
    params.set(paramKey, `${e},${fc.index},${tx},${ty},${s}`);
  }
  return params;
}

function parseConfig(params: URLSearchParams): HeadConfig {
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

export function HeadEditor() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState<HeadConfig>(() =>
    parseConfig(searchParams),
  );
  const [activeFeature, setActiveFeature] = useState<FeatureType>(
    FeatureType.Eye,
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const qs = serializeConfig(config).toString();
    window.history.replaceState(window.history.state, '', '?' + qs);
  }, [config]);

  const updateFeature = useCallback(
    (type: FeatureType, patch: Partial<FeatureConfig>) => {
      setConfig((prev) => {
        const current = prev.features[type] ?? {
          index: 0,
          translation: [0, 0] as [number, number],
          scale: 0.3,
          enabled: false,
        };
        return {
          ...prev,
          features: {
            ...prev.features,
            [type]: { ...current, ...patch },
          },
        };
      });
    },
    [],
  );

  const activeConfig = config.features[activeFeature] ?? {
    index: 0,
    translation: [0, 0] as [number, number],
    scale: 0.3,
    enabled: false,
  };

  const stableConfig = useMemo(() => config, [config]);

  return (
    <div className="my-5 flex flex-col gap-6 lg:flex-row lg:gap-10">
      <div className="relative w-full overflow-hidden rounded-2xl bg-paper-raised lg:mx-0 lg:max-w-sm lg:flex-shrink-0">
        <HeadCanvas
          config={stableConfig}
          className="h-[35vh] w-full lg:h-full"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <Section label={t('head_editor.skin')}>
          <div className="flex flex-wrap gap-2">
            {SKIN_SWATCHES.map((swatch) => {
              const hex = rgbToHex(swatch);
              const selected = rgbToHex(config.baseColor) === hex;
              return (
                <button
                  key={hex}
                  onClick={() =>
                    setConfig((p) => ({ ...p, baseColor: swatch }))
                  }
                  className={`h-8 w-8 rounded-full border-2 transition-transform ${
                    selected
                      ? 'scale-110 border-ember'
                      : 'border-rule hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                  aria-label={t('head_editor.skin_color_aria', { hex })}
                />
              );
            })}
            <label
              className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-rule transition-transform hover:scale-105"
              style={{
                background:
                  'conic-gradient(from 0deg, #f66, #ff6, #6f6, #6ff, #66f, #f6f, #f66)',
              }}
            >
              <input
                type="color"
                value={rgbToHex(config.baseColor)}
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    baseColor: hexToRgb(e.target.value),
                  }))
                }
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </label>
          </div>
        </Section>

        <Section label={t('head_editor.feature')}>
          <div className="flex gap-1">
            {EDITABLE_FEATURES.map((ft) => {
              const active = ft === activeFeature;
              return (
                <button
                  key={ft}
                  onClick={() => setActiveFeature(ft)}
                  className={`rounded-md px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                    active
                      ? 'bg-ember/20 text-ember'
                      : 'text-ink-soft hover:bg-paper-raised hover:text-ink'
                  }`}
                >
                  {t(FEATURE_LABEL_KEYS[ft])}
                </button>
              );
            })}
          </div>
        </Section>

        <Section label={t('head_editor.variant')}>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={activeConfig.enabled}
                onChange={(e) =>
                  updateFeature(activeFeature, { enabled: e.target.checked })
                }
                className="h-4 w-4 accent-ember"
              />
              <span className="text-sm text-ink-soft">
                {t('head_editor.enabled')}
              </span>
            </label>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 16 }, (_, i) => {
              const selected = activeConfig.index === i && activeConfig.enabled;
              return (
                <button
                  key={i}
                  onClick={() =>
                    updateFeature(activeFeature, { index: i, enabled: true })
                  }
                  className={`flex h-10 items-center justify-center rounded border font-mono text-xs transition-colors ${
                    selected
                      ? 'border-ember bg-ember/10 text-ember'
                      : 'border-rule text-ink-soft hover:border-ink-soft'
                  }`}
                >
                  {i}
                </button>
              );
            })}
          </div>
        </Section>

        <Section label={t('head_editor.transform')}>
          <Slider
            label={t('head_editor.x_offset')}
            value={activeConfig.translation[0]}
            min={-0.3}
            max={0.3}
            step={0.01}
            onChange={(v) =>
              updateFeature(activeFeature, {
                translation: [v, activeConfig.translation[1]],
              })
            }
          />
          <Slider
            label={t('head_editor.y_offset')}
            value={activeConfig.translation[1]}
            min={-0.3}
            max={0.3}
            step={0.01}
            onChange={(v) =>
              updateFeature(activeFeature, {
                translation: [activeConfig.translation[0], v],
              })
            }
          />
          <Slider
            label={t('head_editor.scale')}
            value={activeConfig.scale}
            min={0.05}
            max={1.0}
            step={0.01}
            onChange={(v) => updateFeature(activeFeature, { scale: v })}
          />
        </Section>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
          className={`mt-1 flex h-9 items-center justify-center rounded-md border px-4 font-mono text-xs uppercase tracking-wider transition-colors ${
            copied
              ? 'border-ember text-ember'
              : 'border-rule bg-paper-raised text-ink-soft hover:border-ember hover:text-ember'
          }`}
        >
          {copied ? t('head_editor.copied') : t('head_editor.share')}
        </button>
      </div>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </span>
      {children}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-16 text-sm text-ink-soft">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-rule accent-ember"
      />
      <span className="w-12 text-right font-mono text-xs text-ink-soft">
        {value.toFixed(2)}
      </span>
    </label>
  );
}
