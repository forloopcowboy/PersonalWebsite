import type { HeadConfig, HeadRendererOptions } from './types';
import { createHeadMaterial, type HeadMaterial } from './createHeadMaterial';

export class HeadRenderer {
  private renderer!: import('three').WebGLRenderer;
  private scene!: import('three').Scene;
  private camera!: import('three').PerspectiveCamera;
  private mesh!: import('three').Mesh;
  private headMaterial!: HeadMaterial;
  private animationId = 0;
  private disposed = false;
  private isDragging = false;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private rotationY: number;
  private rotationX = 0;
  private canvas!: HTMLCanvasElement;

  private constructor() {
    this.rotationY = -Math.PI / 2;
  }

  static async create(
    canvas: HTMLCanvasElement,
    options: HeadRendererOptions,
  ): Promise<HeadRenderer> {
    const THREE = await import('three');
    const instance = new HeadRenderer();
    instance.canvas = canvas;

    const width = options.width ?? (canvas.clientWidth || 400);
    const height = options.height ?? (canvas.clientHeight || 400);
    const pixelRatio =
      options.pixelRatio ?? Math.min(window.devicePixelRatio, 2);

    instance.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    instance.renderer.setSize(width, height, false);
    instance.renderer.setPixelRatio(pixelRatio);
    instance.renderer.setClearColor(0x000000, 0);

    instance.scene = new THREE.Scene();

    instance.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    instance.camera.position.set(0, 0, 3.5);
    instance.camera.lookAt(0, 0, 0);

    instance.headMaterial = await createHeadMaterial(
      THREE,
      options.config,
      options.textures,
    );

    const geometry = new THREE.SphereGeometry(1, 64, 32);
    instance.mesh = new THREE.Mesh(geometry, instance.headMaterial.material);
    instance.mesh.rotation.y = instance.rotationY;
    instance.mesh.scale.y = -1;
    instance.scene.add(instance.mesh);

    instance.setupDragControls();
    instance.startRenderLoop();
    return instance;
  }

  setConfig(config: HeadConfig): void {
    this.headMaterial.updateConfig(config);
  }

  resize(width: number, height: number): void {
    const aspect = width / height;
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);

    const halfFov = (this.camera.fov * Math.PI) / 360;
    const fitDist = 1 / Math.tan(halfFov);
    this.camera.position.z = Math.max(fitDist, fitDist / aspect) * 1.27;
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.animationId);
    this.removeDragControls();
    this.headMaterial.dispose();
    this.mesh.geometry.dispose();
    this.renderer.dispose();
  }

  private onPointerDown = (e: PointerEvent) => {
    this.isDragging = true;
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    this.canvas.setPointerCapture(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.isDragging) return;
    const dx = e.clientX - this.lastMouseX;
    const dy = e.clientY - this.lastMouseY;
    this.rotationY += dx * 0.01;
    this.rotationX += dy * 0.01;
    this.rotationX = Math.max(
      -Math.PI / 3,
      Math.min(Math.PI / 3, this.rotationX),
    );
    this.lastMouseX = e.clientX;
    this.lastMouseY = e.clientY;
    this.mesh.rotation.y = this.rotationY;
    this.mesh.rotation.x = this.rotationX;
  };

  private onPointerUp = (e: PointerEvent) => {
    this.isDragging = false;
    this.canvas.releasePointerCapture(e.pointerId);
  };

  private setupDragControls(): void {
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.canvas.addEventListener('pointercancel', this.onPointerUp);
    this.canvas.style.cursor = 'grab';
    this.canvas.style.touchAction = 'none';
  }

  private removeDragControls(): void {
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.canvas.removeEventListener('pointercancel', this.onPointerUp);
  }

  private startRenderLoop(): void {
    const loop = () => {
      if (this.disposed) return;
      this.animationId = requestAnimationFrame(loop);
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }
}
