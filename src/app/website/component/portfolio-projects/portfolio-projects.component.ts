import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';

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
    // Run only on browser, skip server rendering
    if (!isPlatformBrowser(this.platformId)) return;

    // Delay to ensure DOM fully rendered
    setTimeout(() => this.initScrollAnimations(), 50);
  }

  private initScrollAnimations() {
    const items = document.querySelectorAll('.case-item');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
        }
      });
    }, { threshold: 0.2 });

    items.forEach(item => observer.observe(item));
  }
}
