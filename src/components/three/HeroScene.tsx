"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { tryCreateRenderer, readThemeColors } from "@/lib/three-utils";

/**
 * The hero background: a plane of dots - graph paper come alive - rolling
 * with slow sine waves and rippling away from the cursor, plus a wireframe
 * icosahedron drifting overhead. Raw three.js, no framework wrapper.
 * If WebGL is unavailable the static CSS grid stays as the backdrop.
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = tryCreateRenderer();
    if (!renderer) return; // no WebGL: degrade to the CSS graph paper

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = readThemeColors();

    const scene = new THREE.Scene();
    const fog = new THREE.Fog(new THREE.Color(colors.bg), 7, 24);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.4, 9);
    camera.lookAt(0, 0, 0);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // --- dot grid plane ---
    const COLS = 130;
    const ROWS = 60;
    const GAP = 0.24;
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const baseX = new Float32Array(count);
    const baseZ = new Float32Array(count);

    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = (c - COLS / 2) * GAP;
        const z = (r - ROWS / 2) * GAP;
        baseX[i] = x;
        baseZ[i] = z;
        positions[i * 3] = x;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z;
        i++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(colors.muted),
      size: 0.032,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    points.position.y = -1.6;
    scene.add(points);

    // --- wireframe icosahedron, the lone exhibit above the desk ---
    const icoMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(colors.accent),
      transparent: true,
      opacity: 0.4,
    });
    const ico = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.4, 1)),
      icoMat
    );
    ico.position.set(2.8, 1.4, 1.5);
    scene.add(ico);

    // recolor when the console switches themes
    const onTheme = () => {
      const next = readThemeColors();
      fog.color.set(next.bg);
      mat.color.set(next.muted);
      icoMat.color.set(next.accent);
    };
    window.addEventListener("workshop:theme", onTheme);

    // --- pointer tracking (normalized, lerped) ---
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const halfW = (COLS * GAP) / 2;
    const halfD = (ROWS * GAP) / 2;

    const update = (t: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      // cursor projected onto the plane, roughly
      const mx = mouse.x * halfW * 0.7;
      const mz = mouse.y * halfD * 0.9 + 2;

      for (let j = 0; j < count; j++) {
        const x = baseX[j];
        const z = baseZ[j];
        // rolling terrain
        let y =
          Math.sin(x * 0.45 + t * 0.6) * 0.16 +
          Math.cos(z * 0.5 + t * 0.45) * 0.22;
        // ripple radiating from the cursor
        const dx = x - mx;
        const dz = z - mz;
        const d = Math.sqrt(dx * dx + dz * dz);
        y += Math.exp(-d * 0.55) * Math.sin(d * 2.4 - t * 3.2) * 0.55;
        pos.setY(j, y);
      }
      pos.needsUpdate = true;

      ico.rotation.x = t * 0.12;
      ico.rotation.y = t * 0.18;
      ico.position.y = 1.4 + Math.sin(t * 0.7) * 0.15;

      // gentle parallax + scroll response
      const sy = window.scrollY / window.innerHeight;
      camera.position.x = mouse.x * 0.5;
      camera.position.y = 2.4 + sy * 2.2 - mouse.y * 0.3;
      camera.lookAt(0, -sy * 1.5, 0);

      renderer.render(scene, camera);
    };

    if (reduced) {
      update(1.5);
    } else {
      renderer.setAnimationLoop((time) => update(time / 1000));
    }

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("workshop:theme", onTheme);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      ico.geometry.dispose();
      icoMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_60%,transparent)]"
    />
  );
}
