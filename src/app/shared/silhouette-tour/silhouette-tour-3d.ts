import {
  AmbientLight,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { Sample, TABLES, WAIST, WAIST_Y } from './silhouette-tour.data';

/** Hauteur (repère du dessin) du sol : le dessin va de y = 14 (tête) à y = 447 (pieds). */
const FLOOR_Y = 447;
const SEGMENTS = 36;

/** Repère du dessin (y vers le bas) vers le repère 3D (Y vers le haut), corps centré sur x = 0. */
const worldY = (y: number): number => FLOOR_Y - y;

/** Modèle 3D du corps : chaque coupe elliptique est reliée à la suivante pour former un maillage lisse. */
function loft(samples: Sample[], side: number): BufferGeometry {
  const positions: number[] = [];
  for (const s of samples) {
    for (let k = 0; k < SEGMENTS; k++) {
      const phi = (k / SEGMENTS) * Math.PI * 2;
      positions.push(side * s.c + s.a * Math.cos(phi), worldY(s.y), s.z + s.b * Math.sin(phi));
    }
  }
  const indices: number[] = [];
  for (let i = 0; i < samples.length - 1; i++) {
    for (let k = 0; k < SEGMENTS; k++) {
      const k2 = (k + 1) % SEGMENTS;
      const a = i * SEGMENTS + k;
      const b = i * SEGMENTS + k2;
      const c = (i + 1) * SEGMENTS + k;
      const d = (i + 1) * SEGMENTS + k2;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

export interface Body3D {
  /** Tourne le corps (degrés : 0 = de face, 90 = de profil, 180 = de dos). */
  setAngle(degrees: number): void;
  /** Hauteur du tour de taille à l'écran, en unités du dessin SVG (0 à 470). */
  waistScreenY: number;
  dispose(): void;
}

export function createBody3D(canvas: HTMLCanvasElement): Body3D | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(22, 330 / 470, 100, 4000);
  const target = new Vector3(0, 222, 0);
  camera.position.set(0, 330, 1250);
  camera.lookAt(target);

  scene.add(new AmbientLight(0xffffff, 0.35));
  scene.add(new HemisphereLight(0xfff3e4, 0x3a2040, 1.1));
  const key = new DirectionalLight(0xfff0dc, 2.6);
  key.position.set(260, 520, 700);
  scene.add(key);
  const rim = new DirectionalLight(0xe0873f, 1.6);
  rim.position.set(-380, 260, -420);
  scene.add(rim);

  // Corps
  const bodyMaterial = new MeshStandardMaterial({ color: 0xf0dcc3, roughness: 0.55, metalness: 0 });
  const body = new Group();
  const geometries: BufferGeometry[] = [];
  for (const table of TABLES) {
    // Le nez n'a de sens qu'en silhouette plate : en 3D, de face, il laisse une marque sombre sur le front.
    if (table.samples.every((s) => s.a < 2)) continue;
    const geometry = loft(table.samples, table.side);
    geometries.push(geometry);
    body.add(new Mesh(geometry, bodyMaterial));
  }

  // Anneau du tour de taille, un peu plus large que le corps
  const ringPoints: Vector3[] = [];
  for (let k = 0; k < 64; k++) {
    const t = (k / 64) * Math.PI * 2;
    ringPoints.push(
      new Vector3(
        (WAIST.a + 3) * Math.cos(t),
        worldY(WAIST_Y),
        WAIST.z + (WAIST.b + 3) * Math.sin(t),
      ),
    );
  }
  const ringGeometry = new TubeGeometry(new CatmullRomCurve3(ringPoints, true), 128, 1.7, 8, true);
  const ringMaterial = new MeshStandardMaterial({
    color: 0xe0873f,
    roughness: 0.4,
    emissive: 0xe0873f,
    emissiveIntensity: 0.35,
  });
  body.add(new Mesh(ringGeometry, ringMaterial));
  scene.add(body);

  // Plateau : halo et points qui tournent avec le corps
  const platform = new Group();
  const glowGeometry = new CircleGeometry(104, 64);
  const glowMaterial = new MeshBasicMaterial({ color: 0xe0873f, transparent: true, opacity: 0.2 });
  const glow = new Mesh(glowGeometry, glowMaterial);
  glow.rotation.x = -Math.PI / 2;
  platform.add(glow);
  const dotPositions: number[] = [];
  for (let k = 0; k < 56; k++) {
    const t = (k / 56) * Math.PI * 2;
    dotPositions.push(92 * Math.cos(t), 0.5, 92 * Math.sin(t));
  }
  const dotGeometry = new BufferGeometry();
  dotGeometry.setAttribute('position', new Float32BufferAttribute(dotPositions, 3));
  const dotMaterial = new PointsMaterial({
    color: 0xe0873f,
    size: 3.4,
    transparent: true,
    opacity: 0.85,
  });
  platform.add(new Points(dotGeometry, dotMaterial));
  scene.add(platform);

  const size = { w: 0, h: 0 };
  const resize = (): void => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h || (w === size.w && h === size.h)) return;
    size.w = w;
    size.h = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  let frame = 0;
  const draw = (): void => {
    frame = 0;
    resize();
    renderer.render(scene, camera);
  };
  const requestDraw = (): void => {
    if (!frame) frame = requestAnimationFrame(draw);
  };
  const observer = new ResizeObserver(requestDraw);
  observer.observe(canvas);

  camera.updateMatrixWorld();
  const waistScreen = new Vector3(0, worldY(WAIST_Y), WAIST.z).project(camera);
  const waistScreenY = ((1 - waistScreen.y) / 2) * 470;

  requestDraw();

  return {
    waistScreenY,
    setAngle(degrees: number): void {
      const rad = (degrees * Math.PI) / 180;
      body.rotation.y = rad;
      platform.rotation.y = -rad * 0.9;
      requestDraw();
    },
    dispose(): void {
      cancelAnimationFrame(frame);
      observer.disconnect();
      for (const g of [...geometries, ringGeometry, glowGeometry, dotGeometry]) g.dispose();
      for (const m of [bodyMaterial, ringMaterial, glowMaterial, dotMaterial]) m.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
