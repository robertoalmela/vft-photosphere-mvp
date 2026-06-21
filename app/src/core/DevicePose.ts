import type { Pose } from '../types';

export type PoseCallback = (pose: Pose) => void;

export class DevicePose {
  private callback: PoseCallback | null = null;
  private smoothed: Pose = { yaw: 0, pitch: 0, roll: 0 };
  private alpha = 0.3;

  async requestPermission(): Promise<boolean> {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      'requestPermission' in DeviceOrientationEvent
    ) {
      try {
        const perm = await (
          DeviceOrientationEvent as unknown as {
            requestPermission: () => Promise<'granted' | 'denied'>;
          }
        ).requestPermission();
        return perm === 'granted';
      } catch {
        return false;
      }
    }
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent === 'function'
    ) {
      return true;
    }
    return false;
  }

  start(callback: PoseCallback): void {
    this.callback = callback;
    window.addEventListener('deviceorientation', this.handleOrientation);
  }

  stop(): void {
    this.callback = null;
    window.removeEventListener('deviceorientation', this.handleOrientation);
  }

  private handleOrientation = (e: DeviceOrientationEvent): void => {
    if (!this.callback) return;

    const raw: Pose = {
      yaw: e.alpha ?? 0,
      pitch: e.beta ?? 0,
      roll: e.gamma ?? 0,
    };

    const a = this.alpha;
    this.smoothed = {
      yaw: this.lerpAngle(this.smoothed.yaw, raw.yaw, a),
      pitch: this.smoothed.pitch + a * (raw.pitch - this.smoothed.pitch),
      roll: this.smoothed.roll + a * (raw.roll - this.smoothed.roll),
    };

    this.callback(this.smoothed);
  };

  private lerpAngle(a: number, b: number, t: number): number {
    let diff = b - a;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return a + t * diff;
  }
}
