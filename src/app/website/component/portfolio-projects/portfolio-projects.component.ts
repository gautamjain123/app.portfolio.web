import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-portfolio-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-projects.component.html',
  styleUrl: './portfolio-projects.component.scss'
})
export class PortfolioProjectsComponent {
  projects = [
    {
      title: 'Immersive 3D Portfolio',
      desc: 'A cinematic personal experience with interactive motion UI built using Angular + WebGL layers.',
      tech: ['Angular', 'Three.js', 'GSAP'],
    },
    {
      title: 'Job Matching Dashboard',
      desc: 'Smart filtering, job pipelines, resume automation, employer dashboards & modern analytics.',
      tech: ['Angular', 'Bootstrap', 'REST APIs'],
    },
    {
      title: 'UI Motion Playground',
      desc: 'A collection of futuristic parallax & motion UI experiments showcasing interface expression.',
      tech: ['GSAP', 'UX Motion', 'WebGL'],
    }
  ];
}
