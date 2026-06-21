import type { CaptureRecord } from '../types';

export class ReviewGallery {
  private container: HTMLElement;
  private grid: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = 'gallery';
    parent.appendChild(this.container);

    this.grid = document.createElement('div');
    this.grid.className = 'gallery-grid';
    this.container.appendChild(this.grid);
  }

  setRecords(
    records: CaptureRecord[],
    onRetake: (hotspotId: number) => void,
  ): void {
    this.grid.innerHTML = '';
    for (const rec of records) {
      const card = document.createElement('div');
      card.className = 'gallery-card';

      const img = document.createElement('img');
      img.src = URL.createObjectURL(rec.data);
      img.className = 'gallery-img';
      card.appendChild(img);

      const info = document.createElement('div');
      info.className = 'gallery-info';
      info.textContent = `#${rec.hotspotId}  y:${Math.round(rec.yaw)}° p:${Math.round(rec.pitch)}°`;
      card.appendChild(info);

      const btn = document.createElement('button');
      btn.className = 'gallery-retake';
      btn.textContent = 'Retake';
      btn.addEventListener('click', () => onRetake(rec.hotspotId));
      card.appendChild(btn);

      this.grid.appendChild(card);
    }
  }

  show(): void {
    this.container.classList.remove('gallery-hidden');
  }

  hide(): void {
    this.container.classList.add('gallery-hidden');
  }

  clear(): void {
    this.grid.innerHTML = '';
  }
}
