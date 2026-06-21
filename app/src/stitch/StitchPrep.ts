import type { CaptureRecord } from '../types';

export interface StitchPackage {
  format: 'raw';
  captures: {
    index: number;
    data: Blob;
    yaw: number;
    pitch: number;
    roll: number;
  }[];
  metadata: {
    count: number;
    generatedAt: number;
  };
}

export function prepareStitchPackage(
  records: CaptureRecord[],
): StitchPackage {
  const capturesSorted = [...records].sort((a, b) => a.hotspotId - b.hotspotId);
  return {
    format: 'raw',
    captures: capturesSorted.map((r) => ({
      index: r.hotspotId,
      data: r.data,
      yaw: r.yaw,
      pitch: r.pitch,
      roll: r.roll,
    })),
    metadata: {
      count: records.length,
      generatedAt: Date.now(),
    },
  };
}
