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

  cardTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';

  onMouseMove(event: MouseEvent) {
    const x = (window.innerWidth / 2 - event.clientX) / 40;
    const y = (window.innerHeight / 2 - event.clientY) / 40;

    this.cardTransform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg)`;
  }

}
