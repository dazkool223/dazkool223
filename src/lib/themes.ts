/**
 * Console-switchable themes. Each theme overrides the CSS custom properties
 * defined in globals.css - colors, and (for some) the display font. Add or
 * tweak a theme here and it immediately shows up in the console via
 * `theme list`. An empty vars object means "factory settings".
 */
export type Theme = {
  hint: string;
  vars: Record<string, string>;
};

export const THEME_STORAGE_KEY = "nk-theme";

export const themes: Record<string, Theme> = {
  workshop: {
    hint: "the default. warm dark, safety orange.",
    vars: {},
  },
  blueprint: {
    hint: "drafting-table blue, cyan ink.",
    vars: {
      "--bg": "#0a111c",
      "--surface": "#0f1826",
      "--ink": "#dce8f5",
      "--muted": "#7f93a8",
      "--faint": "#4c5d70",
      "--line": "rgba(220, 232, 245, 0.14)",
      "--line-faint": "rgba(220, 232, 245, 0.05)",
      "--accent": "#4cc3ff",
      "--accent-dim": "rgba(76, 195, 255, 0.14)",
    },
  },
  paper: {
    hint: "light mode: graph paper and red pen.",
    vars: {
      "--bg": "#f3ecdc",
      "--surface": "#ebe1ca",
      "--ink": "#221e16",
      "--muted": "#6d6450",
      "--faint": "#a59a80",
      "--line": "rgba(34, 30, 22, 0.18)",
      "--line-faint": "rgba(34, 30, 22, 0.06)",
      "--accent": "#d43d0d",
      "--accent-dim": "rgba(212, 61, 13, 0.1)",
    },
  },
  phosphor: {
    hint: "green crt. the workshop in 1982.",
    vars: {
      "--bg": "#060907",
      "--surface": "#0a120c",
      "--ink": "#c2f5cd",
      "--muted": "#5e8f6c",
      "--faint": "#3a5c44",
      "--line": "rgba(63, 255, 118, 0.18)",
      "--line-faint": "rgba(63, 255, 118, 0.05)",
      "--accent": "#3fff76",
      "--accent-dim": "rgba(63, 255, 118, 0.1)",
      // everything goes mono, like it should be
      "--font-grotesk": "var(--font-plex)",
      "--font-newsreader": "var(--font-plex)",
    },
  },
  midnight: {
    hint: "violet hour, for late commits.",
    vars: {
      "--bg": "#0c0a16",
      "--surface": "#141022",
      "--ink": "#e9e5f7",
      "--muted": "#8d86a8",
      "--faint": "#575170",
      "--line": "rgba(233, 229, 247, 0.12)",
      "--line-faint": "rgba(233, 229, 247, 0.045)",
      "--accent": "#a78bfa",
      "--accent-dim": "rgba(167, 139, 250, 0.14)",
    },
  },
};

export function currentTheme(): string {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && themes[stored]) return stored;
  } catch {
    /* storage unavailable */
  }
  return "workshop";
}

/** Applies a theme at runtime and persists the choice. */
export function applyTheme(name: string): boolean {
  const theme = themes[name];
  if (!theme) return false;

  const root = document.documentElement;
  const everyVar = new Set(
    Object.values(themes).flatMap((t) => Object.keys(t.vars))
  );
  everyVar.forEach((v) => root.style.removeProperty(v));
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));

  try {
    localStorage.setItem(THEME_STORAGE_KEY, name);
  } catch {
    /* storage unavailable */
  }
  // three.js scenes listen for this and recolor their materials
  window.dispatchEvent(new CustomEvent("workshop:theme", { detail: name }));
  return true;
}

/** Inline-script source for layout.tsx: applies the saved theme pre-paint. */
export function themeInitScript(): string {
  const varsByName = Object.fromEntries(
    Object.entries(themes).map(([name, t]) => [name, t.vars])
  );
  return `(function(){try{var n=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY
  )});var T=${JSON.stringify(
    varsByName
  )};var v=n&&T[n];if(v){for(var k in v){document.documentElement.style.setProperty(k,v[k]);}}}catch(e){}})();`;
}
