// Measurements shared between objects and the scenes that place them.

/** One-kilo cast bar. Height includes the rounded edge on top and bottom. */
export const BAR = { width: 1, height: 0.3, length: 1.95, bevel: 0.05 } as const;
export const BAR_TOP = BAR.height + BAR.bevel * 2;

/** Radius and height of the powder heap at the mouth of the sack. */
export const SACK_HEAP = { radius: 0.54, base: 0.78, height: 0.5 } as const;

/** Height of a brass dish's inner surface at distance r from its axis. */
export const bowlFloor = (r: number, radius = 1, depth = 0.38): number =>
  0.06 + depth * 0.84 * Math.min(1, r / radius) ** 5;
