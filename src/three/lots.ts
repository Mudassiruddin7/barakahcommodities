// ============================================================
// Lot position — shared by the DOM and the 3D scene so the words and
// the goods always change together.
//
// A pinned section divides its scroll into one segment per lot. Each
// lot holds still for most of its segment, then slides to the next
// during the last third. Returns a continuous index: 0 = first lot
// centred, 1.5 = halfway between the second and third, and so on.
// ============================================================

export const LOT_COUNT = 3;
export const LOT_SPACING = 11;

const smooth = (t: number) => t * t * (3 - 2 * t);

export function lotPosition(progress: number): number {
  const p = Math.min(Math.max(progress, 0), 0.9999);
  const u = p * LOT_COUNT;
  const i = Math.floor(u);
  const f = u - i;
  const slide = Math.min(Math.max((f - 0.68) / 0.32, 0), 1);
  return Math.min(LOT_COUNT - 1, i + smooth(slide));
}

/** Which lot owns the screen — flips at the midpoint of each slide. */
export function lotIndex(progress: number): number {
  return Math.min(LOT_COUNT - 1, Math.round(lotPosition(progress)));
}
