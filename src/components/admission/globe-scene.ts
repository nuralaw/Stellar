// The Admission globe: a three.js scene (a sphere with a land mask and a graticule drawn in a shader, in the site's colours),
// drag-to-rotate with inertia, slow auto-rotation, and DOM markers that the scene positions every rendered frame.
// Land outlines: Natural Earth 1:110m land (ne_110m_land), public domain, https://www.naturalearthdata.com/, built into
// public/admission/land-110m.json by scripts/admission-land.mjs.
// This is the only module that imports three. It is loaded with import() from AdmissionGlobe.tsx, so three.js stays out of
// the bundle of every other page. Not a React component.

import {
  CanvasTexture,
  ClampToEdgeWrapping,
  Color,
  Group,
  LinearMipmapLinearFilter,
  Mesh,
  NoColorSpace,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

export interface GlobeMarker {
  el: HTMLElement;
  lat: number;
  lon: number;
}

export interface GlobeOptions {
  /** The square box; pointer events and observers attach here. */
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  /** DOM elements the scene positions every rendered frame. */
  markers: GlobeMarker[];
  onContextLost: () => void;
  /** Abort while the land data is loading: nothing is created and the promise rejects. */
  signal?: AbortSignal;
}

export interface GlobeHandle {
  dispose(): void;
}

/** The scene puts a marker element's top-left corner at (x − MARKER_ANCHOR, y − MARKER_ANCHOR). */
export const MARKER_ANCHOR = 22;

const LAND_URL = "/admission/land-110m.json";
const MASK_W = 2048;
const MASK_H = 1024;
const FOV = 30; // degrees
const FILL = 0.88; // share of the canvas height the sphere covers
const AUTO_SPEED = (Math.PI * 2) / 90; // rad/s
const AUTO_DELAY = 2500; // ms after the last interaction
const INERTIA_TAU = 0.325; // s
const INERTIA_EPS = 0.01; // rad/s
const MAX_VELOCITY = 8; // rad/s
const MAX_PITCH = 1.0;
const CLICK_SLOP = 6; // px: a gesture that moved further than this is a drag, not a click

const THEME_VARS = { uOcean: "--surface-2", uLand: "--muted", uGrid: "--line", uRim: "--primary" } as const;

const VERTEX = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalV;
void main() {
  vUv = uv;
  vNormalV = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uMask;
uniform vec3 uOcean;
uniform vec3 uLand;
uniform vec3 uGrid;
uniform vec3 uRim;
varying vec2 vUv;
varying vec3 vNormalV;
void main() {
  float land = smoothstep(0.35, 0.65, texture2D(uMask, vUv).r);
  vec3 col = mix(uOcean, uLand, land);
  // Graticule every 15°, on the ocean only; meridians fade out towards the poles where they bunch up.
  vec2 g = vUv * vec2(24.0, 12.0);
  vec2 d = abs(fract(g - 0.5) - 0.5) / fwidth(g);
  float polar = smoothstep(0.04, 0.16, min(vUv.y, 1.0 - vUv.y));
  float line = max((1.0 - min(d.x, 1.0)) * polar, 1.0 - min(d.y, 1.0));
  col = mix(col, uGrid, line * 0.55 * (1.0 - land));
  vec3 n = normalize(vNormalV);
  col *= 0.84 + 0.16 * max(dot(n, normalize(vec3(-0.45, 0.55, 0.7))), 0.0);
  col = mix(col, uRim, pow(1.0 - max(n.z, 0.0), 3.0) * 0.4);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

/** Land mask: black sea, white land, equirectangular. */
function drawMask(polygons: number[][][]): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = MASK_W;
  c.height = MASK_H;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, MASK_W, MASK_H);
  ctx.fillStyle = "#fff";
  for (const rings of polygons) {
    ctx.beginPath();
    for (const ring of rings) {
      for (let i = 0; i + 1 < ring.length; i += 2) {
        const x = ((ring[i] + 180) / 360) * MASK_W;
        const y = ((90 - ring[i + 1]) / 180) * MASK_H;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
    ctx.fill("evenodd");
  }
  return c;
}

async function loadLand(signal?: AbortSignal): Promise<number[][][]> {
  const res = await fetch(LAND_URL, { signal });
  if (!res.ok) throw new Error(`Land data: HTTP ${res.status}`);
  const json = (await res.json()) as { polygons?: unknown };
  if (!Array.isArray(json.polygons)) throw new Error("Land data: unexpected shape");
  return json.polygons as number[][][];
}

/** Rejects when the land data can't be loaded or WebGL is unavailable. */
export async function createGlobe(opts: GlobeOptions): Promise<GlobeHandle> {
  const { container, canvas, markers, onContextLost, signal } = opts;

  const polygons = await loadLand(signal);
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  // Everything created from here on is undone, in reverse order, by dispose() (also when setup throws midway).
  const cleanups: (() => void)[] = [];
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    for (let i = cleanups.length - 1; i >= 0; i--) {
      try {
        cleanups[i]();
      } catch {
        // keep tearing down
      }
    }
  };

  try {
    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true });
    cleanups.push(() => {
      renderer.dispose();
      renderer.forceContextLoss();
    });
    renderer.setClearColor(0x000000, 0);
    // Runs last: hand the marker elements back as the component rendered them (the page may be kept alive hidden and set the globe up again).
    cleanups.unshift(() => {
      for (const m of markers) {
        const st = m.el.style;
        st.visibility = "hidden";
        st.opacity = "";
        st.pointerEvents = "";
        st.transform = "";
      }
    });

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 20);
    const fov = (FOV * Math.PI) / 180;
    camera.position.set(0, 0, 1 / Math.sin(Math.atan(FILL * Math.tan(fov / 2))));
    camera.updateMatrixWorld();

    const tilt = new Group();
    scene.add(tilt);

    const texture = new CanvasTexture(drawMask(polygons));
    texture.wrapS = RepeatWrapping;
    texture.wrapT = ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.colorSpace = NoColorSpace;
    texture.needsUpdate = true;
    cleanups.push(() => texture.dispose());

    const material = new ShaderMaterial({
      uniforms: {
        uMask: { value: texture },
        uOcean: { value: new Color() },
        uLand: { value: new Color() },
        uGrid: { value: new Color() },
        uRim: { value: new Color() },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
    });
    cleanups.push(() => material.dispose());
    const geometry = new SphereGeometry(1, 96, 64);
    cleanups.push(() => geometry.dispose());
    const sphere = new Mesh(geometry, material);
    tilt.add(sphere);

    // ---- theme colours from the site tokens ----
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      for (const [uniform, name] of Object.entries(THEME_VARS)) {
        const value = cs.getPropertyValue(name).trim();
        if (value) (material.uniforms[uniform].value as Color).set(value);
      }
    };
    readTheme();

    // ---- state ----
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = media.matches;
    let yaw = 0;
    let pitch = 0;
    let vel = 0; // yaw inertia, rad/s
    let w = 0;
    let h = 0;
    let onScreen = true;
    let dragging = false;
    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let moved = 0;
    let lastInteraction = -Infinity;
    let raf = 0;
    let last = 0;
    let lost = false;

    // lat/lon → point on the unit sphere in the sphere's local frame
    const local = markers.map((m) => {
      const phi = (m.lat * Math.PI) / 180;
      const lam = (m.lon * Math.PI) / 180;
      return new Vector3(Math.cos(phi) * Math.cos(lam), Math.sin(phi), -Math.cos(phi) * Math.sin(lam));
    });
    if (markers.length) {
      const phi = (markers[0].lat * Math.PI) / 180;
      const lam = (markers[0].lon * Math.PI) / 180;
      pitch = phi * 0.6;
      yaw = -(lam + Math.PI / 2) - (reduced ? 0 : 0.35);
    }

    const p = new Vector3();
    const n = new Vector3();
    const toCam = new Vector3();

    const draw = () => {
      if (lost || w === 0) return;
      sphere.rotation.y = yaw;
      tilt.rotation.x = pitch;
      scene.updateMatrixWorld();
      renderer.render(scene, camera);
      markers.forEach((m, i) => {
        p.copy(local[i]).applyMatrix4(sphere.matrixWorld);
        n.copy(p).normalize(); // the sphere sits at the origin
        toCam.copy(camera.position).sub(p).normalize();
        const facing = n.dot(toCam);
        p.project(camera);
        const x = (p.x * 0.5 + 0.5) * w;
        const y = (0.5 - p.y * 0.5) * h;
        const s = m.el.style;
        s.transform = `translate3d(${x - MARKER_ANCHOR}px, ${y - MARKER_ANCHOR}px, 0)`;
        s.opacity = String(smoothstep(0.05, 0.25, facing));
        s.pointerEvents = facing > 0.12 ? "auto" : "none";
        s.visibility = "visible";
      });
    };

    const visible = () => document.visibilityState === "visible";
    const moving = () => dragging || vel !== 0 || !reduced;
    const shouldRun = () => !lost && onScreen && visible() && moving();

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(Math.max((now - last) / 1000, 0), 0.05); // the rAF stamp can precede the performance.now() that seeded `last`
      last = now;
      if (!dragging) {
        if (vel !== 0) {
          yaw += vel * dt;
          vel *= Math.exp(-dt / INERTIA_TAU);
          if (Math.abs(vel) < INERTIA_EPS) vel = 0;
        } else if (!reduced && performance.now() - lastInteraction > AUTO_DELAY) {
          yaw += AUTO_SPEED * dt;
        }
      }
      draw();
      if (shouldRun()) raf = requestAnimationFrame(tick);
    };

    /** Start the loop if something moves, otherwise stop it; either way show the current state once. */
    const update = () => {
      if (shouldRun()) {
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      } else {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        if (onScreen && visible()) draw();
      }
    };
    cleanups.push(() => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    });

    // ---- sizing ----
    const resize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    cleanups.push(() => ro.disconnect());

    const io = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1].isIntersecting;
      update();
    });
    io.observe(container);
    cleanups.push(() => io.disconnect());

    const onVisibility = () => {
      if (!visible()) finishDrag(false, 0); // a pointerup that never arrives must not leave the globe in drag mode
      update();
    };
    document.addEventListener("visibilitychange", onVisibility);
    cleanups.push(() => document.removeEventListener("visibilitychange", onVisibility));

    const onMedia = () => {
      reduced = media.matches;
      if (reduced) vel = 0;
      update();
    };
    media.addEventListener("change", onMedia);
    cleanups.push(() => media.removeEventListener("change", onMedia));

    const mo = new MutationObserver(() => {
      readTheme();
      if (!raf) draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    cleanups.push(() => mo.disconnect());

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      onContextLost();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    cleanups.push(() => canvas.removeEventListener("webglcontextlost", onLost));

    // ---- interaction ----
    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      // The button was released somewhere we never heard about (outside the window, over an iframe): not dragging any more.
      if (e.pointerType !== "touch" && e.buttons === 0) {
        finishDrag(false, e.timeStamp);
        return;
      }
      // The surface under the pointer follows it at the centre of the globe: the nearest point of the sphere is 1 unit
      // closer to the camera than its centre, so one radian there covers height / (2 (d − 1) tan(fov / 2)) pixels.
      const k = (2 * (camera.position.z - 1) * Math.tan(fov / 2)) / Math.max(container.clientHeight, 1);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      yaw += dx * k;
      if (e.pointerType !== "touch") pitch = Math.min(Math.max(pitch + dy * k, -MAX_PITCH), MAX_PITCH);
      const dt = (e.timeStamp - lastT) / 1000;
      if (dt > 0) vel = vel * 0.6 + ((dx * k) / dt) * 0.4;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      moved = Math.max(moved, Math.hypot(e.clientX - startX, e.clientY - startY));
      if (!raf) draw();
    };
    const finishDrag = (inertia: boolean, timeStamp: number) => {
      if (!dragging) return;
      dragging = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      // A pause before release means no fling.
      if (!inertia || reduced || timeStamp - lastT > 80) vel = 0;
      vel = Math.min(Math.max(vel, -MAX_VELOCITY), MAX_VELOCITY);
      if (Math.abs(vel) < INERTIA_EPS) vel = 0;
      lastInteraction = performance.now();
      update();
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === pointerId) finishDrag(true, e.timeStamp);
    };
    const onCancel = (e: PointerEvent) => {
      if (e.pointerId === pointerId) finishDrag(false, e.timeStamp);
    };
    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || e.button !== 0 || dragging) return;
      dragging = true;
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      startY = lastY = e.clientY;
      lastT = e.timeStamp;
      moved = 0;
      vel = 0;
      lastInteraction = performance.now();
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onCancel);
      update();
    };
    // A drag that starts on a marker would otherwise navigate on release (the marker travels with the globe under the pointer).
    const onClick = (e: MouseEvent) => {
      if (moved > CLICK_SLOP) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const onDragStart = (e: Event) => e.preventDefault();
    container.addEventListener("pointerdown", onDown);
    container.addEventListener("click", onClick, true);
    container.addEventListener("dragstart", onDragStart);
    cleanups.push(() => {
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("click", onClick, true);
      container.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    });

    resize();
    update();
    return { dispose };
  } catch (err) {
    dispose();
    throw err;
  }
}
