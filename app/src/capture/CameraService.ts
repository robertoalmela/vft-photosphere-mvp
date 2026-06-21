export class CameraService {
  private stream: MediaStream | null = null;
  private video: HTMLVideoElement | null = null;

  async start(videoElement: HTMLVideoElement): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
    });
    videoElement.srcObject = this.stream;
    await videoElement.play();
    this.video = videoElement;
  }

  stop(): void {
    if (this.stream) {
      for (const track of this.stream.getTracks()) track.stop();
      this.stream = null;
    }
    if (this.video) {
      this.video.srcObject = null;
      this.video = null;
    }
  }

  captureFrame(): Blob | null {
    if (!this.video) return null;
    const v = this.video;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(v, 0, 0);
    const data = canvas.toDataURL('image/jpeg', 0.85);
    const bin = atob(data.split(',')[1]);
    const buf = new ArrayBuffer(bin.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
    return new Blob([buf], { type: 'image/jpeg' });
  }
}
