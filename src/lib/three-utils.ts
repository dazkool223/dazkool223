import * as THREE from "three";

/**
 * WebGL isn't guaranteed: disabled GPUs, hardened browsers, remote
 * desktops, emulators. Returns a configured renderer, or null when a
 * context can't be created, so callers degrade gracefully instead of
 * crashing the whole page.
 */
/**
 * Reads the active theme's palette off the document so canvas scenes can
 * match whatever the console's `theme` command has applied.
 */
export function readThemeColors() {
  const css = getComputedStyle(document.documentElement);
  const pick = (name: string, fallback: string) => {
    const value = css.getPropertyValue(name).trim();
    return value || fallback;
  };
  return {
    bg: pick("--bg", "#0d0c0a"),
    ink: pick("--ink", "#e9e4d8"),
    muted: pick("--muted", "#938b7b"),
    accent: pick("--accent", "#ff5c1c"),
  };
}

export function tryCreateRenderer(): THREE.WebGLRenderer | null {
  try {
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2") ?? probe.getContext("webgl");
    if (!gl) return null;
    return new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }
}
