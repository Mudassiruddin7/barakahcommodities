// ============================================================
// Returns — the arithmetic behind the calculator.
//
// Deliberately boring. A monthly target as a range, paid on the amount
// put in, for a fixed number of months, with the capital shown separately
// at the end. Nothing here compounds and nothing is hidden: the numbers
// the page shows are exactly these.
// ============================================================

import { RETURNS } from '../content';

export interface MonthRow {
  month: number;
  low: number;
  high: number;
  cumLow: number;
  cumHigh: number;
}

export interface Projection {
  amount: number;
  months: MonthRow[];
  totalLow: number;
  totalHigh: number;
  /** Capital plus returns at the close of the cycle, if the target is met. */
  closeLow: number;
  closeHigh: number;
  pctLow: number;
  pctHigh: number;
}

/** Keeps a typed or dragged amount inside the calculator's range, in whole thousands. */
export function clampAmount(raw: number): number {
  if (!Number.isFinite(raw)) return RETURNS.initial;
  const rounded = Math.round(raw / 1000) * 1000;
  return Math.min(RETURNS.max, Math.max(RETURNS.min, rounded));
}

export function project(amount: number): Projection {
  const low = Math.round(amount * RETURNS.monthlyLow);
  const high = Math.round(amount * RETURNS.monthlyHigh);
  const months: MonthRow[] = [];

  for (let m = 1; m <= RETURNS.tenureMonths; m++) {
    months.push({ month: m, low, high, cumLow: low * m, cumHigh: high * m });
  }

  const totalLow = low * RETURNS.tenureMonths;
  const totalHigh = high * RETURNS.tenureMonths;

  return {
    amount,
    months,
    totalLow,
    totalHigh,
    closeLow: amount + totalLow,
    closeHigh: amount + totalHigh,
    pctLow: Math.round(RETURNS.monthlyLow * RETURNS.tenureMonths * 100),
    pctHigh: Math.round(RETURNS.monthlyHigh * RETURNS.tenureMonths * 100),
  };
}

/** "₹1,00,000" in Indian digit grouping. */
export const rupees = (n: number): string => `₹${n.toLocaleString('en-IN')}`;

/** 100000 → "1 lakh", 250000 → "2.5 lakh". Used in labels and the WhatsApp text. */
export function inLakh(n: number): string {
  const lakh = n / 100000;
  if (lakh < 1) return rupees(n);
  const text = Number.isInteger(lakh) ? String(lakh) : lakh.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return `${text} lakh`;
}
