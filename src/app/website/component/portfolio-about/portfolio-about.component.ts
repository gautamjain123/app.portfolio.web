import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-portfolio-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './portfolio-about.component.html',
  styleUrl: './portfolio-about.component.scss'
})
export class PortfolioAboutComponent {
    scrollToProject() {
    const section = document.getElementById('projects');
    const yOffset = -80; // Adjust based on your header height

    const y = section!.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}
