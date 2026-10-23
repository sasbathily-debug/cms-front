import {
  ACESFilmicToneMapping,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export interface Anneau3D {
  /** Anime ou met en pause la scène (hors écran, on ne dessine rien). */
  setActive(active: boolean): void;
  /** Position du pointeur sur la figure, de -1 à 1 (l'anneau s'incline vers lui). */
  setPointer(x: number, y: number): void;
  /** Donne un coup de vitesse de rotation (glisser). */
  spin(velocity: number): void;
  dispose(): void;
}

/** Fond de la carte : le verre réfracte cette couleur, la scène doit donc la partager. */
const BACKGROUND = 0x2a1930;

/**
 * Anneau en verre teinté qui tourne doucement, avec un noyau orange et des reflets colorés derrière.
 * Forme abstraite, sans modèle externe : tout est généré ici (et la lumière vient d'un décor procédural).
 */
export function createAnneau3D(canvas: HTMLCanvasElement, animate: boolean): Anneau3D | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true });
  } catch {
    return null;
  }
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(BACKGROUND, 1);

  const scene = new Scene();
  scene.background = new Color(BACKGROUND);
  const pmrem = new PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  const envTarget = pmrem.fromScene(environment, 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.3;

  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 7.6);

  // Deux lumières colorées : violette en haut à gauche, orange en bas à droite
  const violet = new PointLight(0x9b7bff, 90, 20, 2);
  violet.position.set(-4, 3.5, 4);
  const orange = new PointLight(0xe0873f, 80, 20, 2);
  orange.position.set(4.5, -3, 3.5);
  scene.add(violet, orange);

  // Anneau de verre
  const ringGeometry = new TorusGeometry(1.5, 0.3, 64, 220);
  const ringMaterial = new MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 1,
    thickness: 0.9,
    dispersion: 0.7,
    ior: 1.5,
    roughness: 0.02,
    metalness: 0,
    attenuationColor: new Color(0xe0873f),
    attenuationDistance: 9,
    iridescence: 0.5,
    iridescenceIOR: 1.3,
    clearcoat: 0.7,
    clearcoatRoughness: 0.05,
    envMapIntensity: 0.7,
  });
  const ring = new Mesh(ringGeometry, ringMaterial);

  // Noyau orange, vu à travers le verre
  const coreGeometry = new TorusGeometry(1.5, 0.028, 24, 220);
  const coreMaterial = new MeshStandardMaterial({
    color: 0xe0873f,
    emissive: 0xe0873f,
    emissiveIntensity: 0.9,
    roughness: 0.4,
  });
  const core = new Mesh(coreGeometry, coreMaterial);

  const group = new Group();
  group.add(ring, core);
  scene.add(group);

  // Taches de couleur derrière, qui glissent lentement : elles donnent leurs reflets au verre
  const blobGeometry = new SphereGeometry(0.5, 32, 24);
  const blobs: { mesh: Mesh; radius: number; speed: number; phase: number; z: number }[] = [];
  const blobMaterials: MeshBasicMaterial[] = [];
  const blobColors = [0x8b5cf6, 0xe0873f, 0x5b7cfa, 0x6d4aa8, 0xb89cf5];
  blobColors.forEach((color, i) => {
    const material = new MeshBasicMaterial({ color });
    blobMaterials.push(material);
    const mesh = new Mesh(blobGeometry, material);
    mesh.scale.setScalar(0.55 + (i % 3) * 0.28);
    blobs.push({
      mesh,
      radius: 1.6 + (i % 2) * 0.55,
      speed: 0.22 + i * 0.07,
      phase: i * 1.7,
      z: -2.4 - (i % 3) * 0.5,
    });
    scene.add(mesh);
  });

  const size = { w: 0, h: 0 };
  const resize = (): void => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h || (w === size.w && h === size.h)) return;
    size.w = w;
    size.h = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let yaw = 0.4;
  let velocity = 0;
  let time = 0;
  let last = 0;
  let frame = 0;
  let active = false;
  let disposed = false;

  const update = (dt: number): void => {
    time += dt;
    yaw += (animate ? dt * 0.28 : 0) + velocity * dt;
    velocity *= Math.pow(0.04, dt);
    pointer.sx += (pointer.x - pointer.sx) * Math.min(1, dt * 4);
    pointer.sy += (pointer.y - pointer.sy) * Math.min(1, dt * 4);
    group.rotation.set(
      0.95 + pointer.sy * 0.35 + (animate ? Math.sin(time * 0.5) * 0.1 : 0),
      yaw,
      pointer.sx * 0.3,
    );
    for (const b of blobs) {
      const a = time * b.speed + b.phase;
      b.mesh.position.set(Math.cos(a) * b.radius, Math.sin(a * 1.3) * b.radius * 0.7, b.z);
    }
  };

  const render = (): void => {
    resize();
    renderer.render(scene, camera);
  };

  const loop = (now: number): void => {
    frame = 0;
    if (!active || disposed) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    update(dt);
    render();
    frame = requestAnimationFrame(loop);
  };

  // Sans animation (mouvement réduit) : on ne redessine que lors d'un geste.
  let pending = 0;
  const renderOnce = (): void => {
    if (animate || pending || disposed) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      update(0.016);
      render();
    });
  };

  const observer = new ResizeObserver(() => (animate ? undefined : renderOnce()));
  observer.observe(canvas);
  update(0);
  render();

  return {
    setActive(on: boolean): void {
      if (on === active) return;
      active = on;
      if (on && animate) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      } else if (!on) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    setPointer(x: number, y: number): void {
      pointer.x = x;
      pointer.y = y;
      renderOnce();
    },
    spin(v: number): void {
      velocity = Math.max(-6, Math.min(6, velocity + v));
      if (!animate) {
        yaw += v * 0.2;
        renderOnce();
      }
    },
    dispose(): void {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pending);
      observer.disconnect();
      for (const g of [ringGeometry, coreGeometry, blobGeometry]) g.dispose();
      for (const m of [ringMaterial, coreMaterial, ...blobMaterials]) m.dispose();
      envTarget.dispose();
      pmrem.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
