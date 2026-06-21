export interface PermissionResult {
  camera: boolean;
  motion: boolean;
}

export async function requestAllPermissions(): Promise<PermissionResult> {
  const camera = await requestCamera();
  const motion = await requestMotion();
  return { camera, motion };
}

async function requestCamera(): Promise<boolean> {
  if (!navigator.mediaDevices?.getUserMedia) return false;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
    for (const track of stream.getTracks()) track.stop();
    return true;
  } catch {
    return false;
  }
}

async function requestMotion(): Promise<boolean> {
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
  return typeof DeviceOrientationEvent !== 'undefined';
}
