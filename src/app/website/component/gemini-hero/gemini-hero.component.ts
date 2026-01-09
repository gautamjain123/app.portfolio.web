// import {
//   Component,
//   ElementRef,
//   ViewChild,
//   AfterViewInit,
//   Inject,
//   PLATFORM_ID
// } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import * as THREE from 'three';
// import { Hands } from '@mediapipe/hands';
// import { Camera } from '@mediapipe/camera_utils';
// @Component({
//   selector: 'app-gemini-hero',
//   standalone: true,
//   imports: [],
//   templateUrl: './gemini-hero.component.html',
//   styleUrl: './gemini-hero.component.scss'
// })
// export class GeminiHeroComponent implements AfterViewInit{

//   @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
//   @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

//   private scene!: THREE.Scene;
//   private camera!: THREE.PerspectiveCamera;
//   private renderer!: THREE.WebGLRenderer;
//   private points!: THREE.Points;

//   private targetX = 0;
//   private targetY = 0;

//   constructor(@Inject(PLATFORM_ID) private pid: Object) {}

//   ngAfterViewInit() {
//     if (!isPlatformBrowser(this.pid)) return;

//     this.initThree();
//     this.initParticles();
//     this.initHands();
//     this.animate();
//   }

//   initThree() {
//     this.scene = new THREE.Scene();

//     this.camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       100
//     );
//     this.camera.position.z = 6;

//     this.renderer = new THREE.WebGLRenderer({
//       canvas: this.canvas.nativeElement,
//       alpha: true
//     });

//     this.renderer.setSize(window.innerWidth, window.innerHeight);
//     this.renderer.setPixelRatio(window.devicePixelRatio);
//   }

//   initParticles() {
//     const geo = new THREE.BufferGeometry();
//     const count = 4000;
//     const pos = new Float32Array(count * 3);

//     for (let i = 0; i < pos.length; i++) {
//       pos[i] = (Math.random() - 0.5) * 10;
//     }

//     geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

//     const mat = new THREE.PointsMaterial({
//       size: 0.03,
//       color: 0x00ffff
//     });

//     this.points = new THREE.Points(geo, mat);
//     this.scene.add(this.points);
//   }

//   initHands() {
//     const hands = new Hands({
//       locateFile: f =>
//         `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
//     });

//     hands.setOptions({
//       maxNumHands: 1,
//       modelComplexity: 1,
//       minDetectionConfidence: 0.6,
//       minTrackingConfidence: 0.6
//     });

//     hands.onResults(res => {
//       if (res.multiHandLandmarks?.length) {
//         const tip = res.multiHandLandmarks[0][8];
//         this.targetX = (tip.x - 0.5) * 2;
//         this.targetY = -(tip.y - 0.5) * 2;
//       }
//     });

//     const cam = new Camera(this.video.nativeElement, {
//       onFrame: async () => {
//         await hands.send({ image: this.video.nativeElement });
//       },
//       width: 640,
//       height: 480
//     });

//     cam.start();
//   }

//   animate = () => {
//     requestAnimationFrame(this.animate);

//     this.points.rotation.x += this.targetY * 0.01;
//     this.points.rotation.y += this.targetX * 0.01;
//     this.renderer.render(this.scene, this.camera);
//   };
// }
