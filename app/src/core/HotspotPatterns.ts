import type { Hotspot } from '../types';

function generatePattern(
  rows: number,
  cols: number,
  pitchRange: number,
): Hotspot[] {
  const hotspots: Hotspot[] = [];
  let id = 0;
  for (let r = 0; r < rows; r++) {
    const t = rows === 1 ? 0 : (r / (rows - 1)) * 2 - 1;
    const pitch = t * pitchRange;
    for (let c = 0; c < cols; c++) {
      const yaw = (c / cols) * 360;
      hotspots.push({ id: id++, yaw, pitch });
    }
  }
  return hotspots;
}

const PATTERN_24: Hotspot[] = generatePattern(3, 8, 30);
const PATTERN_36: Hotspot[] = generatePattern(3, 12, 30);

export function getPattern(mode: 24 | 36): Hotspot[] {
  return mode === 24 ? PATTERN_24 : PATTERN_36;
}
