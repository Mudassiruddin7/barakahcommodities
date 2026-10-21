import { createContext, useContext, type RefObject } from 'react';
import type { DeviceTier } from './gl';

export interface StageState {
  /** The canvas is actually on screen — what a one-shot intro waits for. */
  active: boolean;
  tier: DeviceTier;
  reducedMotion: boolean;
}

export const StageContext = createContext<StageState>({
  active: true,
  tier: 'medium',
  reducedMotion: false,
});

export const useStage = (): StageState => useContext(StageContext);

/**
 * A scene with several groups of goods spread out in space (the lots on the
 * shelf) closes a group's gate until the camera is near it, so its pour is
 * seen rather than spent off screen. A ref, so toggling never re-renders.
 */
export const PourGateContext = createContext<RefObject<boolean>>({ current: true });
