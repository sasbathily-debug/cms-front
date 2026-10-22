import {
  AmbientLight,
  BufferGeometry,
  Bone,
  Box3,
  CatmullRomCurve3,
  CircleGeometry,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Quaternion,
  Scene,
  SkinnedMesh,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_URL = '/models/mannequin.glb';
/** Hauteur du corps dans la scène (le cadrage de la caméra et le plateau en dépendent). */
const BODY_HEIGHT = 433;
/** De combien on baisse les bras par rapport à la pose en T d'origine (degrés). */
const ARM_DROP = 68;

export interface Body3D {
  /** Tourne le corps (degrés : 0 = de face, 90 = de profil, 180 = de dos). */
  setAngle(degrees: number): void;
  /** Hauteur du tour de taille à l'écran, en unités du dessin SVG (0 à 470). */
  waistScreenY: number;
  dispose(): void;
}

/** Baisse un bras : rotation autour de l'axe avant (Z du monde), au niveau de l'épaule. */
function dropArm(bone: Bone | undefined, degrees: number): void {
  if (!bone?.parent) return;
  bone.updateWorldMatrix(true, false);
  const world = new Quaternion();
  bone.getWorldQuaternion(world);
  const parentWorld = new Quaternion();
  bone.parent.getWorldQuaternion(parentWorld);
  const delta = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), (degrees * Math.PI) / 180);
  bone.quaternion.copy(parentWorld.invert().multiply(delta.multiply(world)));
  bone.updateWorldMatrix(true, true);
}

export async function createBody3D(canvas: HTMLCanvasElement): Promise<Body3D | null> {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;

  let gltf;
  try {
    gltf = await new GLTFLoader().loadAsync(MODEL_URL);
  } catch {
    renderer.dispose();
    return null;
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(22, 330 / 470, 100, 4000);
  const target = new Vector3(0, 222, 0);
  camera.position.set(0, 330, 1250);
  camera.lookAt(target);

  scene.add(new AmbientLight(0xffffff, 0.45));
  scene.add(new HemisphereLight(0xfff3e4, 0x3a2040, 1.3));
  const key = new DirectionalLight(0xfff0dc, 2.4);
  key.position.set(260, 520, 700);
  scene.add(key);
  const rim = new DirectionalLight(0xe0873f, 1.8);
  rim.position.set(-380, 260, -420);
  scene.add(rim);

  // Modèle : on mesure le corps au repos (bras en T) avant de baisser les bras.
  const model = gltf.scene;
  model.updateMatrixWorld(true);
  const box = new Box3().setFromObject(model);
  const scale = BODY_HEIGHT / (box.max.y - box.min.y);

  const bones: Record<string, Bone> = {};
  let skin: SkinnedMesh | undefined;
  model.traverse((o: Object3D) => {
    if ((o as Bone).isBone) bones[o.name] = o as Bone;
    if ((o as SkinnedMesh).isSkinnedMesh && o.name === 'Superhero_Female') skin = o as SkinnedMesh;
  });

  const origin = new Vector3();
  (bones['pelvis'] ?? model).getWorldPosition(origin);
  const pelvisY = origin.y;
  const spine = new Vector3();
  (bones['spine_02'] ?? model).getWorldPosition(spine);

  // Le tour de taille : à mi-chemin entre le bassin et le milieu du dos.
  const waistWorldY = pelvisY + (spine.y - pelvisY) * 0.85;
  const slice = { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity };
  if (skin) {
    const mesh: SkinnedMesh = skin;
    const pos = mesh.geometry.attributes['position'];
    const v = new Vector3();
    const tol = (box.max.y - box.min.y) * 0.012;
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
      if (Math.abs(v.y - waistWorldY) > tol) continue;
      slice.minX = Math.min(slice.minX, v.x);
      slice.maxX = Math.max(slice.maxX, v.x);
      slice.minZ = Math.min(slice.minZ, v.z);
      slice.maxZ = Math.max(slice.maxZ, v.z);
    }
  }
  const hasSlice = Number.isFinite(slice.minX);
  const ringCx = hasSlice ? (slice.minX + slice.maxX) / 2 : origin.x;
  const ringCz = hasSlice ? (slice.minZ + slice.maxZ) / 2 : origin.z;
  const ringA = hasSlice ? (slice.maxX - slice.minX) / 2 : 0.15;
  const ringB = hasSlice ? (slice.maxZ - slice.minZ) / 2 : 0.1;

  // Bras le long du corps (la pose d'origine a les bras en croix).
  dropArm(bones['upperarm_l'], -ARM_DROP);
  dropArm(bones['upperarm_r'], ARM_DROP);

  // Pieds au sol, bassin sur l'axe de rotation, échelle commune.
  const holder = new Group();
  holder.scale.setScalar(scale);
  model.position.set(-origin.x, -box.min.y, -origin.z);
  holder.add(model);

  const body = new Group();
  body.add(holder);

  // Anneau du tour de taille, un peu plus large que le corps
  const toScene = (x: number, y: number, z: number): Vector3 =>
    new Vector3((x - origin.x) * scale, (y - box.min.y) * scale, (z - origin.z) * scale);
  const ringPoints: Vector3[] = [];
  for (let k = 0; k < 64; k++) {
    const t = (k / 64) * Math.PI * 2;
    ringPoints.push(
      toScene(ringCx + ringA * 1.06 * Math.cos(t), waistWorldY, ringCz + ringB * 1.1 * Math.sin(t)),
    );
  }
  const ringGeometry = new TubeGeometry(new CatmullRomCurve3(ringPoints, true), 128, 1.5, 8, true);
  const ringMaterial = new MeshStandardMaterial({
    color: 0xe0873f,
    roughness: 0.4,
    emissive: 0xe0873f,
    emissiveIntensity: 0.4,
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
  const waistScreen = toScene(ringCx, waistWorldY, ringCz).project(camera);
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
      model.traverse((o: Object3D) => {
        const mesh = o as Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const m of materials) {
          for (const value of Object.values(m)) {
            (value as { isTexture?: boolean; dispose?: () => void } | null)?.isTexture &&
              (value as { dispose: () => void }).dispose();
          }
          m.dispose();
        }
      });
      for (const g of [ringGeometry, glowGeometry, dotGeometry]) g.dispose();
      for (const m of [ringMaterial, glowMaterial, dotMaterial]) m.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
