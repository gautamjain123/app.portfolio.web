import {
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import * as THREE from 'three';
import { OrbitControls, GLTFLoader } from 'three-stdlib';
import gsap from 'gsap';

@Component({
  selector: 'app-portfolio-hero',
  standalone: true,
  templateUrl: './portfolio-hero.component.html',
  styleUrls: ['./portfolio-hero.component.scss']
})
export class PortfolioHeroComponent implements AfterViewInit, OnDestroy {

  @ViewChild('bgCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @ViewChild('resumeExplosion')
  explosionCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private mixer!: THREE.AnimationMixer;
  private avatar!: THREE.Object3D;
  private clock = new THREE.Clock();
  private animationFrameId = 0;

  private particles!: THREE.Points;
  private grid!: THREE.GridHelper;

  private hoverEffect = 0.6;

  private mouse = new THREE.Vector2(0, 0);
  private parallaxTarget = new THREE.Vector2(0, 0);

  private scrollProgress = 0;

  private idleTime = 0;
  private idleAutoMotion = 0.05;

  private explosionParticles: any[] = [];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initScene();
      this.loadAvatar();
      this.animate();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.animationFrameId);
      if (this.renderer) this.renderer.dispose();
    }
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050816);
    this.scene.fog = new THREE.Fog(0x050816, 8, 22);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0.8, 6);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.minPolarAngle = Math.PI / 3;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.6;

    const hemi = new THREE.HemisphereLight(0x8b5cf6, 0xf97316, 1.2);
    const point = new THREE.PointLight(0x7dd3fc, 1.6, 25);
    point.position.set(-4, 6, 6);
    this.scene.add(hemi, point);

    this.grid = new THREE.GridHelper(40, 80, 0x6366f1, 0x1e1b4b);
    this.grid.position.y = -1.4;
    (this.grid.material as THREE.Material).transparent = true;
    (this.grid.material as THREE.Material).opacity = 0.7;
    this.scene.add(this.grid);

    const particlesCount = 8000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 40;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.08,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0x9ca3af
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  explodeResume(button: HTMLElement) {

    // 🔥 MOBILE/TABLET → DIRECT DOWNLOAD (NO ANIMATION)
    if (this.isMobileOrTablet()) {
      this.downloadResume();
      return;
    }

    // ✔ Desktop explosion animation logic
    const canvas = this.explosionCanvas.nativeElement;
    const ctx = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const buttonRect = button.getBoundingClientRect();

    this.explosionParticles = [];

    for (let i = 0; i < 120; i++) {
      this.explosionParticles.push({
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 14,
        speedY: (Math.random() - 0.5) * 14,
        opacity: 1,
        color: `hsl(${120 + Math.random() * 80}, 100%, 60%)`
      });
    }

    const animateExplosion = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.explosionParticles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= 0.02;
        p.size *= 0.93;

        if (p.opacity > 0) {
          ctx.shadowBlur = 18;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color.replace("hsl", "hsla").replace(")", `,${p.opacity})`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (this.explosionParticles.some((p) => p.opacity > 0)) {
        requestAnimationFrame(animateExplosion);
      }
    };

    animateExplosion();

    gsap.to(button, {
      opacity: 0,
      scale: 0.7,
      duration: 0.25,
      ease: "power2.in"
    });

    setTimeout(() => {
      this.downloadResume();

      gsap.to(button, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)"
      });
    }, 450);
  }

  downloadResume() {
    const link = document.createElement("a");
    link.href = "../../../../assets/pdf/gautamresume.pdf";
    link.download = "Gautam-Jain-Resume.pdf";
    link.click();
  }

  scrollToCategory() {
    const section = document.getElementById('projects');
    const yOffset = -80;
    const y = section!.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  private loadAvatar(): void {
    const loader = new GLTFLoader();

    loader.load('assets/models/avatar.glb', (gltf) => {
      this.avatar = gltf.scene;
      this.avatar.position.set(0, -1.3, 0);
      this.avatar.scale.set(3.2, 3.2, 3.2);

      this.avatar.traverse((child: any) => {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color(0x6366f1);
          child.material.emissiveIntensity = 0.4;
        }
      });

      this.scene.add(this.avatar);

      if (gltf.animations.length) {
        this.mixer = new THREE.AnimationMixer(this.avatar);
        this.mixer.clipAction(gltf.animations[0]).play();
      }
    });
  }

  private animate = (): void => {
    const delta = this.clock.getDelta();

    this.idleTime += 0.003;
    const autoX = Math.sin(this.idleTime) * 0.05;
    const autoY = Math.cos(this.idleTime * 0.8) * 0.05;

    if (this.avatar) {
      const pulse = (Math.sin(Date.now() * 0.0011) + 1) * 0.25;
      this.avatar.traverse((child: any) => {
        if (child.isMesh) child.material.emissiveIntensity = pulse;
      });

      const hoverY = (this.scrollProgress * 0.6) + this.parallaxTarget.y + autoY;
      this.avatar.position.x += ((this.parallaxTarget.x + autoX) - this.avatar.position.x) * 0.12;
      this.avatar.position.y += (hoverY - this.avatar.position.y) * 0.06;
    }

    this.particles.rotation.y += 0.00025;
    this.particles.position.x += ((this.parallaxTarget.x * 1.2 + autoX * 4) - this.particles.position.x) * 0.05;

    const fogDepth = -this.scrollProgress * 4;
    this.particles.position.z += (fogDepth - this.particles.position.z) * 0.04;

    if (this.grid) {
      const t = this.hoverEffect;
      this.grid.scale.set(1 + t * 0.2, 1, 1 + t * 0.2);
      (this.grid.material as THREE.Material).opacity = 0.6 + t * 0.4;

      const gridY = this.parallaxTarget.y * 0.8 - (this.scrollProgress * 1.5);
      this.grid.position.x += ((this.parallaxTarget.x * 0.6 + autoX * 2)
        - this.grid.position.x) * 0.05;
      this.grid.position.y += (gridY - this.grid.position.y) * 0.05;
    }

    if (this.mixer) this.mixer.update(delta);

    const minZoom = 3;
    const maxZoom = 6;
    const zoomTarget = maxZoom - (this.scrollProgress * 2);
    const clampedZoom = Math.max(minZoom, zoomTarget);
    this.camera.position.z += (clampedZoom - this.camera.position.z) * 0.05;

    const camY = this.parallaxTarget.y * 0.8 + autoY * 2;
    this.camera.position.x += ((this.parallaxTarget.x * 1.2 + autoX * 3)
      - this.camera.position.x) * 0.05;
    this.camera.position.y += (camY - this.camera.position.y) * 0.04;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = (event.clientY / window.innerHeight) * 2 - 1;

    this.parallaxTarget.x = this.mouse.x * 1.2;
    this.parallaxTarget.y = -this.mouse.y * 1.5;
  }

  @HostListener('window:scroll')
  onScroll() {
    const max = document.body.scrollHeight - window.innerHeight;
    this.scrollProgress = max > 0 ? window.scrollY / max : 0;
  }

  @HostListener('window:resize')
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 📌 Improved detection for Mobile/Tablet
  isMobileOrTablet(): boolean {
    return (
      window.innerWidth <= 1024 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }
}
