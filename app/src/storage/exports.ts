import type { Session, CaptureRecord } from '../types';

interface ExportData {
  session: Session;
  captures: {
    index: number;
    hotspotId: number;
    yaw: number;
    pitch: number;
    roll: number;
    timestamp: number;
    imageData: string;
  }[];
}

export async function exportSessionJson(
  session: Session,
  records: CaptureRecord[],
): Promise<Blob> {
  const data: ExportData = {
    session,
    captures: await Promise.all(
      records.map(async (r, i) => ({
        index: i,
        hotspotId: r.hotspotId,
        yaw: r.yaw,
        pitch: r.pitch,
        roll: r.roll,
        timestamp: r.timestamp,
        imageData: await blobToBase64(r.data),
      })),
    ),
  };
  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSession(
  session: Session,
  records: CaptureRecord[],
): void {
  const blob = new Blob([JSON.stringify(session, null, 2)], {
    type: 'application/json',
  });
  downloadBlob(blob, `session-${session.id}.json`);

  for (const rec of records) {
    downloadBlob(rec.data, `capture-${rec.hotspotId}.jpg`);
  }
}
