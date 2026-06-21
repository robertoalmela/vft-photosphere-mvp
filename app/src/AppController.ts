import type { AppScreen, Pose } from './types';
import { CaptureSession } from './core/CaptureSession';
import { DevicePose } from './core/DevicePose';
import { requestAllPermissions } from './core/Permissions';
import { CameraService } from './capture/CameraService';
import { AlignmentEngine } from './capture/AlignmentEngine';
import { OverlayHUD } from './view/OverlayHUD';
import { SceneView } from './view/SceneView';
import { ReviewGallery } from './view/ReviewGallery';
import { saveSession, saveCapture } from './storage/db';
import { downloadSession } from './storage/exports';

export class AppController {
  private currentScreen: AppScreen = 'splash';
  private session: CaptureSession | null = null;
  private currentPose: Pose = { yaw: 0, pitch: 0, roll: 0 };

  private camera = new CameraService();
  private poseTracker = new DevicePose();
  private alignment = new AlignmentEngine();
  private hud!: OverlayHUD;
  private sceneView!: SceneView;
  private gallery!: ReviewGallery;

  private appEl: HTMLElement;
  private videoEl!: HTMLVideoElement;
  private screens: Record<string, HTMLElement> = {};
  private rafId = 0;
  private previewContainer!: HTMLElement;

  constructor() {
    const app = document.getElementById('app');
    if (!app) throw new Error('No #app element found');
    this.appEl = app;
    this.appEl.className = 'app';
  }

  async init(): Promise<void> {
    this.createScreens();
    this.showScreen('splash');
  }

  private createScreens(): void {
    this.createSplashScreen();
    this.createPermissionsScreen();
    this.createModeScreen();
    this.createCaptureScreen();
    this.createReviewScreen();
    this.createExportScreen();
  }

  private showScreen(name: AppScreen): void {
    this.currentScreen = name;
    for (const [key, el] of Object.entries(this.screens)) {
      el.classList.toggle('screen-active', key === name);
    }
  }

  private showError(msg: string): void {
    const el = document.createElement('div');
    el.className = 'toast-error';
    el.textContent = msg;
    this.appEl.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  /* ── Splash ─────────────────────────────────── */

  private createSplashScreen(): void {
    const s = this.makeScreen('splash');
    s.innerHTML = `
      <div class="splash-content">
        <div class="splash-icon">◎</div>
        <h1 class="splash-title">VFT Photosphere</h1>
        <p class="splash-sub">Capture 360° photos with your phone</p>
        <button class="btn-primary" id="btn-start">Start Capture</button>
      </div>
    `;
    s.querySelector('#btn-start')!.addEventListener('click', () => this.handleStart());
    this.appEl.appendChild(s);
  }

  private async handleStart(): Promise<void> {
    this.showScreen('permissions');
    const result = await requestAllPermissions();
    this.updatePermissionsUI(result);
  }

  /* ── Permissions ────────────────────────────── */

  private createPermissionsScreen(): void {
    const s = this.makeScreen('permissions');
    s.innerHTML = `
      <div class="perm-content">
        <h2>Permissions Required</h2>
        <div id="perm-status">
          <p class="perm-check" id="perm-camera">📷 Camera ...</p>
          <p class="perm-check" id="perm-motion">📱 Motion sensors ...</p>
        </div>
        <button class="btn-primary hidden" id="btn-perm-continue">Continue</button>
        <p class="perm-hint" id="perm-hint"></p>
      </div>
    `;
    s.querySelector('#btn-perm-continue')!.addEventListener('click', () => {
      this.showScreen('mode_select');
    });
    this.appEl.appendChild(s);
  }

  private updatePermissionsUI(result: { camera: boolean; motion: boolean }): void {
    const camEl = document.getElementById('perm-camera')!;
    const motEl = document.getElementById('perm-motion')!;
    const hint = document.getElementById('perm-hint')!;

    camEl.textContent = result.camera ? '📷 Camera — Granted' : '📷 Camera — Denied';
    camEl.className = `perm-check ${result.camera ? 'perm-ok' : 'perm-fail'}`;
    motEl.textContent = result.motion ? '📱 Motion sensors — Available' : '📱 Motion sensors — Unavailable';
    motEl.className = `perm-check ${result.motion ? 'perm-ok' : 'perm-fail'}`;

    if (!result.camera) {
      hint.textContent = 'Camera access is required. Please allow camera access in your browser settings.';
      return;
    }
    if (!result.motion) {
      hint.textContent = 'Motion sensors may be limited on this device. Basic functionality may still work.';
    }

    document.getElementById('btn-perm-continue')!.classList.remove('hidden');
  }

  /* ── Mode Select ────────────────────────────── */

  private createModeScreen(): void {
    const s = this.makeScreen('mode_select');
    s.innerHTML = `
      <div class="mode-content">
        <h2>Choose Capture Mode</h2>
        <button class="btn-mode" id="btn-mode-24">
          <span class="mode-label">Quick</span>
          <span class="mode-desc">24 shots · ~1 min</span>
        </button>
        <button class="btn-mode" id="btn-mode-36">
          <span class="mode-label">Quality</span>
          <span class="mode-desc">36 shots · ~2 min</span>
        </button>
      </div>
    `;
    s.querySelector('#btn-mode-24')!.addEventListener('click', () => this.startCapture(24));
    s.querySelector('#btn-mode-36')!.addEventListener('click', () => this.startCapture(36));
    this.appEl.appendChild(s);
  }

  /* ── Capture ────────────────────────────────── */

  private createCaptureScreen(): void {
    const s = this.makeScreen('capture');
    s.innerHTML = `
      <video id="capture-video" class="capture-video" autoplay playsinline></video>
      <div id="capture-hud"></div>
      <div id="capture-preview" class="capture-preview"></div>
      <div id="capture-bar" class="capture-bar">
        <div id="capture-bar-fill" class="capture-bar-fill"></div>
      </div>
      <button id="btn-cancel-capture" class="btn-cancel">Cancel</button>
    `;
    this.videoEl = s.querySelector('#capture-video')!;
    this.previewContainer = s.querySelector('#capture-preview')!;
    s.querySelector('#btn-cancel-capture')!.addEventListener('click', () => this.cancelCapture());
    this.appEl.appendChild(s);
  }

  private async startCapture(mode: 24 | 36): Promise<void> {
    this.session = new CaptureSession(mode);
    this.alignment.reset();
    this.currentPose = { yaw: 0, pitch: 0, roll: 0 };

    this.showScreen('capture');

    const hudContainer = document.getElementById('capture-hud')!;
    this.hud = new OverlayHUD(hudContainer);
    this.sceneView = new SceneView(this.previewContainer);

    try {
      await this.camera.start(this.videoEl);
    } catch {
      this.showError('Failed to start camera');
      return;
    }

    this.poseTracker.start((pose) => {
      this.currentPose = pose;
      this.sceneView.updatePose(pose);
    });

    this.rafId = requestAnimationFrame(this.captureLoop);
  }

  private captureLoop = (): void => {
    if (this.currentScreen !== 'capture') return;

    const session = this.session;
    if (!session) return;

    const target = session.currentTarget;
    if (!target) {
      this.finishCapture();
      return;
    }

    const result = this.alignment.evaluate(this.currentPose, target);
    this.hud.update(
      result.state,
      result.distance,
      result.progress,
      session.hotspots.length - session.getRemainingCount(),
      session.hotspots.length,
    );
    this.sceneView.setHotspots(
      session.hotspots,
      new Set(
        session.allRecords.map((r) => r.hotspotId),
      ),
      target,
    );

    const barFill = document.getElementById('capture-bar-fill')!;
    barFill.style.width = `${session.progress * 100}%`;

    if (result.state === 'capturing') {
      this.handleCapture(session, target);
    }

    this.rafId = requestAnimationFrame(this.captureLoop);
  };

  private async handleCapture(session: CaptureSession, target: { id: number; yaw: number; pitch: number }): Promise<void> {
    const blob = this.camera.captureFrame();
    if (!blob) {
      this.showError('Capture failed');
      return;
    }

    const record = {
      id: 0,
      hotspotId: target.id,
      yaw: this.currentPose.yaw,
      pitch: this.currentPose.pitch,
      roll: this.currentPose.roll,
      timestamp: Date.now(),
      data: blob,
    };

    session.markCaptured(record);

    try {
      await saveCapture('session-' + Date.now(), record);
    } catch {
      // silent: local-only fallback
    }

    this.alignment.reset();
  }

  private finishCapture(): void {
    this.poseTracker.stop();
    this.camera.stop();
    cancelAnimationFrame(this.rafId);
    this.sceneView.dispose();

    if (!this.session) return;
    const s = this.session;
    const records = [...s.allRecords];

    saveSession({
      id: 'session-' + Date.now(),
      mode: s.mode,
      captures: records,
      completed: true,
      createdAt: Date.now(),
    });

    this.gallery.setRecords(records, (hotspotId) => this.retakeHotspot(hotspotId));
    this.showScreen('review');
  }

  private cancelCapture(): void {
    this.poseTracker.stop();
    this.camera.stop();
    cancelAnimationFrame(this.rafId);
    this.sceneView?.dispose();
    this.showScreen('splash');
  }

  private retakeHotspot(hotspotId: number): void {
    this.showScreen('splash');
    this.showError('Retake: start a new session — target hotspot #' + hotspotId);
  }

  /* ── Review ─────────────────────────────────── */

  private createReviewScreen(): void {
    const s = this.makeScreen('review');
    s.innerHTML = `
      <div class="review-header">
        <h2>Review Captures</h2>
        <button id="btn-export" class="btn-primary">Export</button>
      </div>
      <div id="review-gallery"></div>
    `;
    s.querySelector('#btn-export')!.addEventListener('click', () => this.handleExport());
    this.appEl.appendChild(s);

    this.gallery = new ReviewGallery(s.querySelector('#review-gallery')!);
  }

  /* ── Export ─────────────────────────────────── */

  private createExportScreen(): void {
    const s = this.makeScreen('export');
    s.innerHTML = `
      <div class="export-content">
        <h2>Export</h2>
        <p>Your session has been saved locally.</p>
        <button id="btn-download-json" class="btn-primary">Download Session JSON</button>
        <button id="btn-download-images" class="btn-primary">Download Images</button>
        <button id="btn-back-home" class="btn-secondary">Back to Home</button>
      </div>
    `;
    s.querySelector('#btn-back-home')!.addEventListener('click', () => this.showScreen('splash'));
    this.appEl.appendChild(s);
  }

  private handleExport(): void {
    if (!this.session) return;
    downloadSession(
      {
        id: 'session-' + Date.now(),
        mode: this.session.mode,
        captures: [...this.session.allRecords],
        completed: true,
        createdAt: Date.now(),
      },
      [...this.session.allRecords],
    );
    this.showScreen('export');
  }

  /* ── Helpers ────────────────────────────────── */

  private makeScreen(name: string): HTMLElement {
    const el = document.createElement('div');
    el.className = 'screen';
    el.id = 'screen-' + name;
    this.screens[name] = el;
    return el;
  }
}
