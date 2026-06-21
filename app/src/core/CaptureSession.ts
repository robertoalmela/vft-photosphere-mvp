import type { Hotspot, CaptureRecord } from '../types';
import { getPattern } from './HotspotPatterns';

export class CaptureSession {
  readonly mode: 24 | 36;
  readonly hotspots: Hotspot[];
  private captured = new Set<number>();
  private targetIndex = 0;
  private records: CaptureRecord[] = [];

  constructor(mode: 24 | 36) {
    this.mode = mode;
    this.hotspots = getPattern(mode);
  }

  get currentTarget(): Hotspot | null {
    if (this.targetIndex >= this.hotspots.length) return null;
    return this.hotspots[this.targetIndex];
  }

  get progress(): number {
    return this.captured.size / this.hotspots.length;
  }

  get isComplete(): boolean {
    return this.captured.size >= this.hotspots.length;
  }

  get allRecords(): readonly CaptureRecord[] {
    return this.records;
  }

  markCaptured(record: CaptureRecord): void {
    this.captured.add(record.hotspotId);
    this.records.push(record);
    this.advance();
  }

  isHotspotCaptured(id: number): boolean {
    return this.captured.has(id);
  }

  getCapturedRecord(hotspotId: number): CaptureRecord | undefined {
    return this.records.find((r) => r.hotspotId === hotspotId);
  }

  getRemainingCount(): number {
    return this.hotspots.length - this.captured.size;
  }

  private advance(): void {
    while (this.targetIndex < this.hotspots.length) {
      if (!this.captured.has(this.hotspots[this.targetIndex].id)) break;
      this.targetIndex++;
    }
  }
}
