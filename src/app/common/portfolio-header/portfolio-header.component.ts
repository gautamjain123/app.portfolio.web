import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-portfolio-header',
  standalone: true,
  imports: [],
  templateUrl: './portfolio-header.component.html',
  styleUrl: './portfolio-header.component.scss'
})
export class PortfolioHeaderComponent {
menuOpen = false;
}
