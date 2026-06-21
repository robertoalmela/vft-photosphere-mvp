import type { AlignmentState } from '../types';

export class OverlayHUD {
  private container: HTMLDivElement;
  private targetArrow: HTMLDivElement;
  private levelIndicator: HTMLDivElement;
  private statusText: HTMLSpanElement;
  private countdownRing: SVGCircleElement;
  private progressText: HTMLSpanElement;
  private counterText: HTMLSpanElement;

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = 'hud';

    this.targetArrow = document.createElement('div');
    this.targetArrow.className = 'hud-arrow';
    this.container.appendChild(this.targetArrow);

    this.levelIndicator = document.createElement('div');
    this.levelIndicator.className = 'hud-level';
    this.container.appendChild(this.levelIndicator);

    this.statusText = document.createElement('span');
    this.statusText.className = 'hud-status';
    this.container.appendChild(this.statusText);

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'hud-ring');
    svg.setAttribute('viewBox', '0 0 40 40');
    const bg = document.createElementNS(svgNS, 'circle');
    bg.setAttribute('cx', '20');
    bg.setAttribute('cy', '20');
    bg.setAttribute('r', '18');
    bg.setAttribute('fill', 'none');
    bg.setAttribute('stroke', 'rgba(255,255,255,0.2)');
    bg.setAttribute('stroke-width', '3');
    svg.appendChild(bg);
    this.countdownRing = document.createElementNS(svgNS, 'circle');
    this.countdownRing.setAttribute('cx', '20');
    this.countdownRing.setAttribute('cy', '20');
    this.countdownRing.setAttribute('r', '18');
    this.countdownRing.setAttribute('fill', 'none');
    this.countdownRing.setAttribute('stroke', '#4ade80');
    this.countdownRing.setAttribute('stroke-width', '3');
    this.countdownRing.setAttribute('stroke-dasharray', '0 113');
    this.countdownRing.setAttribute('transform', 'rotate(-90 20 20)');
    svg.appendChild(this.countdownRing);
    this.container.appendChild(svg);

    this.counterText = document.createElement('span');
    this.counterText.className = 'hud-counter';
    this.container.appendChild(this.counterText);

    this.progressText = document.createElement('span');
    this.progressText.className = 'hud-progress';
    this.container.appendChild(this.progressText);

    parent.appendChild(this.container);
  }

  update(
    state: AlignmentState,
    distance: number,
    progress: number,
    completed: number,
    total: number,
  ): void {
    const labels: Record<AlignmentState, string> = {
      idle: 'Move phone around',
      approaching: 'Getting closer',
      aligned: 'Almost there — level phone',
      level: 'Hold still...',
      capturing: 'CAPTURE!',
    };
    this.statusText.textContent = labels[state] ?? '';

    const hue = state === 'level' || state === 'capturing' ? 120 : state === 'aligned' ? 60 : 0;
    const col = `hsl(${hue}, 100%, ${state === 'idle' ? 40 : 60}%)`;
    this.container.style.borderColor = col;
    this.statusText.style.color = col;

    this.countdownRing.setAttribute(
      'stroke-dasharray',
      `${progress * 113} 113`,
    );
    this.countdownRing.setAttribute('stroke', col);

    this.targetArrow.style.opacity = state === 'idle' ? '1' : '0.3';
    this.targetArrow.style.transform = `rotate(${Math.min(distance * 3, 90)}deg)`;

    this.counterText.textContent = `${completed}/${total}`;
    this.progressText.textContent = `${Math.round((completed / total) * 100)}%`;
  }

  show(): void {
    this.container.classList.remove('hud-hidden');
  }

  hide(): void {
    this.container.classList.add('hud-hidden');
  }
}
