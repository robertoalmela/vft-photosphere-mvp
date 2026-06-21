import * as THREE from 'three';
import type { Hotspot, Pose } from '../types';

export class SceneView {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private points: THREE.Points;
  private targetMarker: THREE.Mesh;
  private sphere: THREE.Mesh;
  private animFrame = 0;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    this.camera.position.set(0, 0, 4);

    const sphereGeo = new THREE.SphereGeometry(1.8, 32, 24);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x1a1a2e,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
    this.scene.add(this.sphere);

    const dotGeo = new THREE.BufferGeometry();
    const dotPos = new Float32Array(1000 * 3);
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x4ade80,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    this.points = new THREE.Points(dotGeo, dotMat);
    this.scene.add(this.points);

    const markerGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    this.targetMarker = new THREE.Mesh(markerGeo, markerMat);
    this.scene.add(this.targetMarker);

    this.animate();
  }

  setHotspots(hotspots: Hotspot[], captured: Set<number>, current: Hotspot | null): void {
    const positions: number[] = [];
    const colors: number[] = [];

    for (const h of hotspots) {
      const theta = ((90 - h.pitch) * Math.PI) / 180;
      const phi = (h.yaw * Math.PI) / 180;
      const r = 1.8;
      positions.push(
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.cos(theta),
        r * Math.sin(theta) * Math.sin(phi),
      );
      const isCap = captured.has(h.id);
      colors.push(isCap ? 0 / 255 : 80 / 255, isCap ? 222 / 255 : 80 / 255, isCap ? 128 / 255 : 80 / 255);
    }

    this.points.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );
    (this.points.geometry as THREE.BufferGeometry).setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3),
    );
    (this.points.material as THREE.PointsMaterial).vertexColors = true;
    this.points.geometry.setDrawRange(0, hotspots.length);

    if (current) {
      const theta = ((90 - current.pitch) * Math.PI) / 180;
      const phi = (current.yaw * Math.PI) / 180;
      this.targetMarker.position.set(
        1.8 * Math.sin(theta) * Math.cos(phi),
        1.8 * Math.cos(theta),
        1.8 * Math.sin(theta) * Math.sin(phi),
      );
      this.targetMarker.visible = true;
    } else {
      this.targetMarker.visible = false;
    }
  }

  updatePose(pose: Pose): void {
    this.sphere.rotation.y = -(pose.yaw * Math.PI) / 180;
    this.sphere.rotation.x = (pose.pitch * Math.PI) / 180;
  }

  resize(): void {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;
    this.renderer.setSize(parent.clientWidth, parent.clientHeight);
  }

  dispose(): void {
    cancelAnimationFrame(this.animFrame);
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  private animate = (): void => {
    this.animFrame = requestAnimationFrame(this.animate);
    this.targetMarker.rotation.x += 0.02;
    this.targetMarker.rotation.y += 0.03;
    this.renderer.render(this.scene, this.camera);
  };
}
