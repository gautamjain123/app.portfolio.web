import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-portfolio-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './portfolio-header.component.html',
  styleUrl: './portfolio-header.component.scss'
})
export class PortfolioHeaderComponent {
  menuOpen = false;

  constructor(private router: Router) {}

  private scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const yOffset = -80;
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  private navigateAndScroll(targetId: string) {
    const isHome = this.router.url === '/' || this.router.url.includes('home');

    if (!isHome) {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToSection(targetId), 300);
      });
    } else {
      this.scrollToSection(targetId);
    }
  }

  scrollToHome() {
    this.navigateAndScroll('home');
  }

  scrollToProject() {
    this.navigateAndScroll('projects');
  }

  scrollToAbout() {
    this.navigateAndScroll('about');
  }

    scrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }
}
