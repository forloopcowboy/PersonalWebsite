import { useEffect, useRef, type CSSProperties } from 'react';
import type { HeadConfig, HeadRendererOptions } from './types';
import { HeadRenderer } from './HeadRenderer';

export interface HeadCanvasProps extends Omit<
  HeadRendererOptions,
  'width' | 'height'
> {
  className?: string;
  style?: CSSProperties;
}

export function HeadCanvas({
  config,
  className,
  style,
  ...opts
}: HeadCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<HeadRenderer | null>(null);
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;

    HeadRenderer.create(canvas, {
      ...opts,
      config: configRef.current,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    }).then((renderer) => {
      if (disposed) {
        renderer.dispose();
        return;
      }
      rendererRef.current = renderer;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.resize(w, h);
    });

    const observer = new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      rendererRef.current?.resize(w, h);
    });
    observer.observe(canvas);

    return () => {
      disposed = true;
      observer.disconnect();
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.setConfig(config);
  }, [config]);

  return <canvas ref={canvasRef} className={className} />;
}
