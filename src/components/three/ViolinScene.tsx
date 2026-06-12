"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { tryCreateRenderer, readThemeColors } from "@/lib/three-utils";

const WOOD = 0x1c1916;

type Palette = { accent: THREE.LineBasicMaterial[]; strings: THREE.LineBasicMaterial; scroll: THREE.MeshBasicMaterial };

/** Dark box with accent edge lines - the "blueprint exhibit" look. */
function blueprintBox(
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  palette: Palette,
  accentHex: string
) {
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color: WOOD })
  );
  const edgeMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(accentHex),
    transparent: true,
    opacity: 0.7,
  });
  palette.accent.push(edgeMat);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMat);
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

function buildViolin(accentHex: string, inkHex: string) {
  const violin = new THREE.Group();
  const palette: Palette = {
    accent: [],
    strings: new THREE.LineBasicMaterial({
      color: new THREE.Color(inkHex),
      transparent: true,
      opacity: 0.6,
    }),
    scroll: new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentHex),
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    }),
  };

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
    const contourMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(accentHex),
    });
    palette.accent.push(contourMat);
    const contour = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      contourMat
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
    const fMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(accentHex),
      transparent: true,
      opacity: 0.8,
    });
    palette.accent.push(fMat);
    const fHole = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(28)),
      fMat
    );
    violin.add(fHole);
  }

  // --- neck, fingerboard, pegbox ---
  violin.add(blueprintBox(0.16, 1.0, 0.12, 0, 2.0, 0, palette, accentHex));
  violin.add(blueprintBox(0.24, 2.1, 0.05, 0, 1.35, 0.2, palette, accentHex));
  violin.add(blueprintBox(0.2, 0.52, 0.14, 0, 2.72, 0, palette, accentHex));

  // --- scroll: a small torus where the spiral would be ---
  const scroll = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.035, 6, 20),
    palette.scroll
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
  violin.add(blueprintBox(0.5, 0.26, 0.04, 0, -0.55, 0.21, palette, accentHex));
  violin.add(blueprintBox(0.26, 0.55, 0.04, 0, -1.42, 0.2, palette, accentHex));

  // --- four strings, tailpiece to nut ---
  for (let i = 0; i < 4; i++) {
    const x = -0.075 + i * 0.05;
    const pts = [
      new THREE.Vector3(x * 0.7, -1.62, 0.23),
      new THREE.Vector3(x, -0.55, 0.25), // over the bridge
      new THREE.Vector3(x * 0.6, 2.42, 0.2),
    ];
    violin.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        palette.strings
      )
    );
  }

  return { violin, palette };
}

/**
 * A violin built from nothing but primitives and bézier curves - no model
 * file. Drag to rotate; it keeps spinning gently when left alone. Falls
 * back to the sketchbook drawing when WebGL isn't available.
 */
export default function ViolinScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = tryCreateRenderer();
    if (!renderer) {
      setFallback(true);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = readThemeColors();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.55, 7.2);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const { violin, palette } = buildViolin(colors.accent, colors.ink);
    violin.position.y = -0.62;
    violin.rotation.y = -0.5;
    scene.add(violin);

    // recolor when the console switches themes
    const onTheme = () => {
      const next = readThemeColors();
      palette.accent.forEach((m) => m.color.set(next.accent));
      palette.strings.color.set(next.ink);
      palette.scroll.color.set(next.accent);
    };
    window.addEventListener("workshop:theme", onTheme);

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
      window.removeEventListener("workshop:theme", onTheme);
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

  if (fallback) {
    return (
      <img
        src="/art/sketch-02.svg"
        alt="pencil sketch of a violin"
        className="h-full w-full object-cover"
      />
    );
  }

  // pan-y keeps vertical page scrolling alive on touch screens
  return (
    <div
      ref={mountRef}
      aria-hidden
      className="h-full w-full [touch-action:pan-y]"
    />
  );
}
