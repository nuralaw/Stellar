// Loads the Desmos graphing calculator API (https://www.desmos.com/api) once, on demand.
// The key comes from NEXT_PUBLIC_DESMOS_API_KEY (.env.local locally, project env vars on Vercel).
// It is a browser key by design: Desmos expects it in the script URL.

export const DESMOS_VERSION = "v1.12";
export const DESMOS_KEY = process.env.NEXT_PUBLIC_DESMOS_API_KEY ?? "";

export interface DesmosCalculator {
  resize(): void;
  destroy(): void;
  updateSettings(settings: Record<string, unknown>): void;
  setBlank(): void;
  setExpression(expr: Record<string, unknown>): void;
  removeExpression(expr: { id: string }): void;
  setMathBounds(bounds: { left: number; right: number; bottom: number; top: number }): void;
  /** The graph paper's size in pixels (the area that shows the graph). */
  graphpaperBounds?: { pixelCoordinates: { width: number; height: number } };
  /** Per expression id: whether Desmos could evaluate it (filled in asynchronously). */
  expressionAnalysis?: Record<string, { isError?: boolean; errorMessage?: string; evaluation?: { type: string; value: number } }>;
}

interface DesmosGlobal {
  GraphingCalculator(el: HTMLElement, options?: Record<string, unknown>): DesmosCalculator;
}

declare global {
  interface Window {
    Desmos?: DesmosGlobal;
  }
}

let loading: Promise<DesmosGlobal> | null = null;

export function loadDesmos(): Promise<DesmosGlobal> {
  if (typeof window === "undefined") return Promise.reject(new Error("Desmos needs a browser"));
  if (window.Desmos) return Promise.resolve(window.Desmos);
  if (!DESMOS_KEY) return Promise.reject(new Error("Missing NEXT_PUBLIC_DESMOS_API_KEY"));
  loading ??= new Promise<DesmosGlobal>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://www.desmos.com/api/${DESMOS_VERSION}/calculator.js?apiKey=${encodeURIComponent(DESMOS_KEY)}`;
    s.async = true;
    s.onload = () => (window.Desmos ? resolve(window.Desmos) : reject(new Error("Desmos did not load")));
    s.onerror = () => {
      s.remove();
      loading = null; // allow a retry
      reject(new Error("Couldn't reach desmos.com"));
    };
    document.head.appendChild(s);
  });
  return loading;
}
