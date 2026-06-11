"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const ACCENT = 0xff5c1c;
const WOOD = 0x1c1916;
const STRING = 0xe9e4d8;

/** Dark box with accent edge lines - the "blueprint exhibit" look. */
function blueprintBox(
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number
) {
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color: WOOD })
  );
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.7 })
  );
  group.add(mesh, edges);
  group.position.set(x, y, z);
  return group;
}

/** The violin body outline as a symmetric bézier shape, front view. */
function violinShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -1.8);
  // right lower bout
  s.bezierCurveTo(0.85, -1.8, 1.18, -1.35, 1.05, -0.78);
  // right C-bout (the waist)
  s.bezierCurveTo(0.97, -0.42, 0.64, -0.46, 0.6, -0.04);
  s.bezierCurveTo(0.57, 0.3, 0.9, 0.26, 0.92, 0.52);
  // right upper bout
  s.bezierCurveTo(0.95, 1.1, 0.52, 1.5, 0, 1.55);
  // mirrored left side
  s.bezierCurveTo(-0.52, 1.5, -0.95, 1.1, -0.92, 0.52);
  s.bezierCurveTo(-0.9, 0.26, -0.57, 0.3, -0.6, -0.04);
  s.bezierCurveTo(-0.64, -0.46, -0.97, -0.42, -1.05, -0.78);
  s.bezierCurveTo(-1.18, -1.35, -0.85, -1.8, 0, -1.8);
  return s;
}

function buildViolin() {
  const violin = new THREE.Group();

  // --- body: extruded shape + outline contours front and back ---
  const shape = violinShape();
  const bodyGeo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.34,
    bevelEnabled: false,
    curveSegments: 32,
  });
  bodyGeo.translate(0, 0, -0.17);
  const body = new THREE.Mesh(
    bodyGeo,
    new THREE.MeshBasicMaterial({ color: 0x14110e })
  );
  violin.add(body);

  const contourPts = shape
    .getPoints(90)
    .map((p) => new THREE.Vector3(p.x, p.y, 0));
  for (const z of [0.18, -0.18]) {
    const pts = contourPts.map((p) => new THREE.Vector3(p.x, p.y, z));
    const contour = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: ACCENT })
    );
    violin.add(contour);
  }

  // --- f-holes: two S-curves either side of the bridge ---
  for (const side of [1, -1]) {
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(side * 0.3, -0.72, 0.18),
      new THREE.Vector3(side * 0.56, -0.45, 0.18),
      new THREE.Vector3(side * 0.24, -0.05, 0.18),
      new THREE.Vector3(side * 0.46, 0.2, 0.18)
    );
    const fHole = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(28)),
      new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.8 })
    );
    violin.add(fHole);
  }

  // --- neck, fingerboard, pegbox ---
  violin.add(blueprintBox(0.16, 1.0, 0.12, 0, 2.0, 0));
  violin.add(blueprintBox(0.24, 2.1, 0.05, 0, 1.35, 0.2));
  violin.add(blueprintBox(0.2, 0.52, 0.14, 0, 2.72, 0));

  // --- scroll: a small torus where the spiral would be ---
  const scroll = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.035, 6, 20),
    new THREE.MeshBasicMaterial({
      color: ACCENT,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    })
  );
  scroll.position.set(0, 3.08, 0);
  violin.add(scroll);

  // --- tuning pegs ---
  const pegGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.4, 10);
  pegGeo.rotateZ(Math.PI / 2);
  for (const [px, py] of [
    [-0.16, 2.6],
    [0.16, 2.72],
    [-0.16, 2.84],
    [0.16, 2.92],
  ] as const) {
    const peg = new THREE.Mesh(
      pegGeo,
      new THREE.MeshBasicMaterial({ color: WOOD })
    );
    peg.position.set(px, py, 0);
    violin.add(peg);
  }

  // --- bridge + tailpiece ---
  violin.add(blueprintBox(0.5, 0.26, 0.04, 0, -0.55, 0.21));
  violin.add(blueprintBox(0.26, 0.55, 0.04, 0, -1.42, 0.2));

  // --- four strings, tailpiece to nut ---
  const stringMat = new THREE.LineBasicMaterial({
    color: STRING,
    transparent: true,
    opacity: 0.6,
  });
  for (let i = 0; i < 4; i++) {
    const x = -0.075 + i * 0.05;
    const pts = [
      new THREE.Vector3(x * 0.7, -1.62, 0.23),
      new THREE.Vector3(x, -0.55, 0.25), // over the bridge
      new THREE.Vector3(x * 0.6, 2.42, 0.2),
    ];
    violin.add(
      new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), stringMat)
    );
  }

  return violin;
}

/**
 * A violin built from nothing but primitives and bézier curves - no model
 * file. Drag to rotate; it keeps spinning gently when left alone.
 */
export default function ViolinScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.55, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const violin = buildViolin();
    violin.position.y = -0.62;
    violin.rotation.y = -0.5;
    scene.add(violin);

    // drag-to-rotate with inertia; gentle auto-spin when idle
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velY = 0;
    let tiltTarget = 0;

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      mount.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      velY = (e.clientX - lastX) * 0.006;
      tiltTarget = THREE.MathUtils.clamp(
        tiltTarget + (e.clientY - lastY) * 0.003,
        -0.5,
        0.5
      );
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const up = () => {
      dragging = false;
      mount.style.cursor = "grab";
    };

    mount.style.cursor = "grab";
    mount.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    const render = () => {
      violin.rotation.y += velY + (dragging ? 0 : 0.004);
      velY *= 0.94;
      if (!dragging) tiltTarget *= 0.97;
      violin.rotation.x += (tiltTarget - violin.rotation.x) * 0.08;
      renderer.render(scene, camera);
    };

    if (reduced) {
      render();
    } else {
      renderer.setAnimationLoop(render);
    }

    return () => {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      mount.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      violin.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className="h-full w-full touch-none" aria-hidden />
  );
}
