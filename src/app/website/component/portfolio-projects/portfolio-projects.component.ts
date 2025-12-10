import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-portfolio-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-projects.component.html',
  styleUrl: './portfolio-projects.component.scss'
})
export class PortfolioProjectsComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  projects = [
    {
      title: 'Netoyed Corporate Website',
      desc: `Revamped company website using Angular 17 and built a custom CMS 
             with AI-powered recruitment automation & chatbot support.`,
      tech: ['Angular 17', 'AI Chatbot', 'CMS Engineering'],
      img: '../../../../assets/images/netoyed-web.png',
      link: 'https://netoyed.com/'
    },
    {
      title: 'Gov.in App Store (Government App Marketplace)',
      desc: `Delivered 90% of frontend for India’s official app store focusing on 
             performance, scalable modules, and accessibility-driven UI.`,
      tech: ['Angular', 'High Performance UI', 'GovTech UX'],
      img: '../../../../assets/images/gov.in.png',
      link: 'https://apps.mgov.gov.in/'
    },
    {
      title: 'National Career Service (NCS) Portal',
      desc: `End-to-end development of government job portal with employer dashboards, 
             job seeker flows, and automated hiring workflows.`,
      tech: ['Angular', 'Workflow Automation', 'API Integrations'],
      img: '../../../../assets/images/ncs.png',
      link: 'https://betacloud.ncs.gov.in/'
    }
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // slight delay to ensure DOM is ready
    setTimeout(() => this.initGSAPAnimations(), 80);
  }

private initGSAPAnimations() {
  const cards = document.querySelectorAll('.case-card');

  cards.forEach((card, index) => {
    const direction = index % 2 === 0 ? -120 : 120;
    const image = card.querySelector('.case-image img');

    // === Card Reveal Animation ===
    gsap.fromTo(card,
      {
        opacity: 0,
        x: direction,
        scale: 0.92,
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // === Parallax Zoom Animation ===
    if (image) {
      gsap.fromTo(image,
        { scale: 1.0 },
        {
          scale: 1.15,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            scrub: true,
            start: 'top bottom',
            end: 'bottom top',
          }
        }
      );
    }
  });
}

}
