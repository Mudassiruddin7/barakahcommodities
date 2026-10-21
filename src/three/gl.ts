// ============================================================
// WebGL capability — probed once for the whole page.
//
// Browsers cap live WebGL contexts (Chrome: 16) and quietly kill the
// oldest when the cap is hit. The previous build opened two throw-away
// probe contexts per canvas on top of the canvases themselves, which on
// a page with several scenes is exactly how the first scene goes blank
// after a scroll. One probe, cached, closed immediately.
// ============================================================

export type DeviceTier = 'high' | 'medium' | 'low';

export interface GLInfo {
  supported: boolean;
  tier: DeviceTier;
  /** Upper bound for devicePixelRatio on this device. */
  dprCeiling: number;
}

let cached: GLInfo | null = null;

export function getGLInfo(): GLInfo {
  if (cached) return cached;

  if (typeof document === 'undefined') {
    return { supported: false, tier: 'low', dprCeiling: 1 };
  }

  let supported = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    supported = Boolean(gl);
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    supported = false;
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 768;

  let tier: DeviceTier = 'high';
  if (!supported || (coarse && narrow) || memory <= 2 || cores <= 2) tier = 'low';
  else if (memory <= 4 || cores <= 4 || coarse) tier = 'medium';

  const dprCeiling = tier === 'high' ? 1.75 : tier === 'medium' ? 1.4 : 1;

  cached = { supported, tier, dprCeiling };
  return cached;
}
