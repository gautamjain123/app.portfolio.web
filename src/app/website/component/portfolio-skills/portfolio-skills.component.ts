import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  ElementRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-portfolio-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-skills.component.html',
  styleUrl: './portfolio-skills.component.scss'
})
export class PortfolioSkillsComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  @ViewChild('root', { static: true }) root!: ElementRef;

  skillSections = [
    {
      title: 'Frontend',
      skills: [
        { name: 'Angular', level: 4, display: 0 },
        { name: 'TypeScript', level: 4, display: 0 },
        { name: 'HTML5', level: 5, display: 0 },
        { name: 'SCSS', level: 4, display: 0 }
      ]
    },
    {
      title: 'Interactive UI',
      skills: [
        { name: 'Three.js', level: 3, display: 0 },
        { name: 'GSAP', level: 3, display: 0 },
        { name: 'Parallax UI', level: 4, display: 0 }
      ]
    },
    {
      title: 'Tools & Systems',
      skills: [
        { name: 'Git', level: 4, display: 0 },
        { name: 'Bootstrap', level: 5, display: 0 },
        { name: 'REST APIs', level: 4, display: 0 },
        { name: 'Postman', level: 3, display: 0 }
      ]
    }
  ];

  maxLevel = 5;
  animated = false;

  ngAfterViewInit() {
    // ❗ FULL SSR safety: skip logic entirely if NOT browser
    if (!isPlatformBrowser(this.platformId)) return;

    // ❗ Extra check: intersection observer might not exist
    if (typeof IntersectionObserver === 'undefined') {
      /** Fallback: animate immediately instead of observing */
      this.animated = true;
      this.animateNumbers();
      this.animateGrid();
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animated = true;
          this.animateNumbers();
          this.animateGrid();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(this.root.nativeElement);
  }

  animateNumbers() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.skillSections.forEach(group => {
      group.skills.forEach(skill => {
        let count = 0;
        const timer = setInterval(() => {
          count++;
          skill.display = count;
          if (count >= skill.level * 20) clearInterval(timer);
        }, 20);
      });
    });
  }

  animateGrid() {
    if (!isPlatformBrowser(this.platformId)) return;

    const boxes = this.root.nativeElement.querySelectorAll('.box');
    boxes.forEach((box: HTMLElement, i: number) => {
      setTimeout(() => {
        box.classList.add('reveal');
      }, i * 20);
    });
  }
}
