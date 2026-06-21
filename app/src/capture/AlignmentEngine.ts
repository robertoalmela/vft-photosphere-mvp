import type { Pose, Hotspot, AlignmentState } from '../types';

export interface AlignmentResult {
  state: AlignmentState;
  distance: number;
  progress: number;
}

export class AlignmentEngine {
  thresholdApproaching = 15;
  thresholdAligned = 5;
  thresholdLevel = 2.5;
  holdDuration = 800;

  private holdStart = 0;
  private wasLevel = false;

  evaluate(pose: Pose, target: Hotspot): AlignmentResult {
    const distance = this.angularDistance(pose, target);
    const isLevel = Math.abs(pose.roll) < this.thresholdLevel;

    let state: AlignmentState;
    if (isLevel && distance < this.thresholdAligned) {
      if (!this.wasLevel) {
        this.holdStart = performance.now();
        this.wasLevel = true;
      }
      const elapsed = performance.now() - this.holdStart;
      if (elapsed >= this.holdDuration) {
        state = 'capturing';
      } else {
        state = 'level';
      }
    } else if (distance < this.thresholdAligned) {
      this.wasLevel = false;
      state = 'aligned';
    } else if (distance < this.thresholdApproaching) {
      this.wasLevel = false;
      state = 'approaching';
    } else {
      this.wasLevel = false;
      state = 'idle';
    }

    const progress = this.wasLevel
      ? Math.min((performance.now() - this.holdStart) / this.holdDuration, 1)
      : 0;

    return { state, distance, progress };
  }

  reset(): void {
    this.holdStart = 0;
    this.wasLevel = false;
  }

  private angularDistance(pose: Pose, target: Hotspot): number {
    const dyaw = this.degToRad(this.angleDiff(pose.yaw, target.yaw));
    const dpitch = this.degToRad(pose.pitch - target.pitch);
    const cosPitch = Math.cos(this.degToRad(pose.pitch));
    const dx = Math.cos(dpitch) * Math.sin(dyaw) * cosPitch;
    const dy = Math.sin(dpitch);
    return this.radToDeg(Math.atan2(Math.sqrt(dx * dx + dy * dy), 1));
  }

  private angleDiff(a: number, b: number): number {
    let d = b - a;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    return Math.abs(d);
  }

  private degToRad(d: number): number {
    return (d * Math.PI) / 180;
  }

  private radToDeg(r: number): number {
    return (r * 180) / Math.PI;
  }
}
