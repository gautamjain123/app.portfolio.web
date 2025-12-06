import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-portfolio-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portfolio-header.component.html',
  styleUrl: './portfolio-header.component.scss'
})
export class PortfolioHeaderComponent {
  menuOpen = false;
  constructor(private router: Router) {}


  scrollToProject() {
    const section = document.getElementById('projects');
    const yOffset = -80; // Adjust based on your header height

    const y = section!.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
  scrollToHome() {
    const isHome = this.router.url === '/' || this.router.url.includes('home');

    if (!isHome) {
      // Navigate home first
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.executeScroll(), 300);
      });
    } else {
      this.executeScroll();
    }
  }

  private executeScroll() {
    const section = document.getElementById('home');

    if (!section) return;

    const yOffset = -80; // adjust header height
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
  scrollToAbout() {
    const section = document.getElementById('about');
    const yOffset = -80; // Adjust based on your header height

    const y = section!.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
