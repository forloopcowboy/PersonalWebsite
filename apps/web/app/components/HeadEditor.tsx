import { useState, useCallback, useMemo } from 'react';
import {
  HeadCanvas,
  FeatureType,
  SMILEY_CONFIG,
  type HeadConfig,
  type FeatureConfig,
} from '@personal/head-renderer';

const FEATURE_LABELS: Record<FeatureType, string> = {
  [FeatureType.Eye]: 'Eyes',
  [FeatureType.Nose]: 'Nose',
  [FeatureType.Mouth]: 'Mouth',
  [FeatureType.Eyebrow]: 'Brows',
  [FeatureType.FacialHair]: 'Beard',
  [FeatureType.Accessory]: 'Acc.',
};

const EDITABLE_FEATURES = [
  FeatureType.Eye,
  FeatureType.Mouth,
  FeatureType.Nose,
  FeatureType.Eyebrow,
  FeatureType.FacialHair,
] as const;

const SKIN_SWATCHES: [number, number, number][] = [
  [0.96, 0.87, 0.77],
  [0.90, 0.75, 0.65],
  [0.82, 0.65, 0.50],
  [0.70, 0.50, 0.35],
  [0.55, 0.35, 0.22],
  [0.78, 0.79, 0.10],
  [0.65, 0.85, 0.65],
  [0.55, 0.65, 0.90],
  [0.90, 0.55, 0.55],
  [0.80, 0.55, 0.80],
];

function rgbToHex(c: [number, number, number]): string {
  return (
    '#' +
    c.map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('')
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 0xff) / 255, (n & 0xff) / 255];
}

export function HeadEditor() {
  const [config, setConfig] = useState<HeadConfig>(SMILEY_CONFIG);
  const [activeFeature, setActiveFeature] = useState<FeatureType>(
    FeatureType.Eye,
  );

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
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
      <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-paper-raised lg:mx-0 lg:flex-shrink-0">
        <HeadCanvas
          config={stableConfig}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <Section label="Skin">
          <div className="flex flex-wrap gap-2">
            {SKIN_SWATCHES.map((swatch) => {
              const hex = rgbToHex(swatch);
              const selected = rgbToHex(config.baseColor) === hex;
              return (
                <button
                  key={hex}
                  onClick={() => setConfig((p) => ({ ...p, baseColor: swatch }))}
                  className={`h-8 w-8 rounded-full border-2 transition-transform ${
                    selected
                      ? 'scale-110 border-ember'
                      : 'border-rule hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                  aria-label={`Skin color ${hex}`}
                />
              );
            })}
            <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-rule">
              <input
                type="color"
                value={rgbToHex(config.baseColor)}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, baseColor: hexToRgb(e.target.value) }))
                }
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span className="pointer-events-none select-none text-xs text-ink-soft">
                +
              </span>
            </label>
          </div>
        </Section>

        <Section label="Feature">
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
                  {FEATURE_LABELS[ft]}
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Variant">
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
              <span className="text-sm text-ink-soft">Enabled</span>
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

        <Section label="Transform">
          <Slider
            label="X Offset"
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
            label="Y Offset"
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
            label="Scale"
            value={activeConfig.scale}
            min={0.05}
            max={1.0}
            step={0.01}
            onChange={(v) => updateFeature(activeFeature, { scale: v })}
          />
        </Section>
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
