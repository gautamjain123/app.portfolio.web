import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-three-preloader',
  standalone: true,
  templateUrl: './three-preloader.component.html',
  styleUrls: ['./three-preloader.component.scss'] // ✅ also fixed plural
})
export class ThreePreloaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private particles: any[] = [];
  private animationId: any;
  private mouse = { x: 0, y: 0 };
  private isBrowser: boolean;
  hidden = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();

window.addEventListener('resize', () => {
  this.resizeCanvas();
  this.createTextParticles("GAUTAM"); // regenerate particles responsively
});
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.createTextParticles("GAUTAM");
    this.animate();

    setTimeout(() => this.finishIntro(), 3500);
  }

resizeCanvas() {
  const canvas = this.canvasRef.nativeElement;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}


createTextParticles(text: string) {
  const offscreen = document.createElement('canvas');
  const ctx = offscreen.getContext('2d')!;

  const screenWidth = window.innerWidth;

  // 📱 Responsive font sizing
  let fontSize = 120;
  if (screenWidth < 480) fontSize = 52;       // mobile
  else if (screenWidth < 768) fontSize = 72;  // tablet
  else if (screenWidth < 1200) fontSize = 100;

  ctx.font = `bold ${fontSize}px Arial`;

  // Measure text to size canvas perfectly
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize * 1.2;

  offscreen.width = textWidth;
  offscreen.height = textHeight;

  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, offscreen.width / 2, offscreen.height / 2);

  const imageData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);

  // 📉 Fewer particles on small screens for performance
  const gap = screenWidth < 480 ? 8 : screenWidth < 768 ? 6 : 5;

  this.particles = [];

  for (let y = 0; y < offscreen.height; y += gap) {
    for (let x = 0; x < offscreen.width; x += gap) {
      const index = (y * offscreen.width + x) * 4;
      if (imageData.data[index + 3] > 128) {
        this.particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          baseX: x + (window.innerWidth / 2 - offscreen.width / 2),
          baseY: y + (window.innerHeight / 2 - offscreen.height / 2),
          vx: 0,
          vy: 0
        });
      }
    }
  }
}


  animate = () => {
    this.animationId = requestAnimationFrame(this.animate);
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.particles.forEach(p => {
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, 100 - dist) / 100;

      p.vx += (p.baseX - p.x) * 0.02;
      p.vy += (p.baseY - p.y) * 0.02;

      p.vx += dx * force * 0.02;
      p.vy += dy * force * 0.02;

      p.vx *= 0.92;
      p.vy *= 0.92;

      p.x += p.vx;
      p.y += p.vy;

      const gradient = this.ctx.createLinearGradient(
        window.innerWidth / 2 - 200,
        0,
        window.innerWidth / 2 + 200,
        0
      );
      gradient.addColorStop(0, '#6366f1'); // Indigo
      gradient.addColorStop(1, '#ec4899'); // Pink

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(p.x, p.y, 2.2, 2.2);


    });
  };

  finishIntro() {
    this.hidden = true;
    cancelAnimationFrame(this.animationId);
  }

  ngOnDestroy() {
    if (!this.isBrowser) return;
    cancelAnimationFrame(this.animationId);
  }
}
