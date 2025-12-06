import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-portfolio-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portfolio-footer.component.html',
  styleUrl: './portfolio-footer.component.scss'
})
export class PortfolioFooterComponent {
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

  scrollToSkill() {
    this.navigateAndScroll('skill');
  }
}
