import { Component } from '@angular/core';
import { PortfolioHeaderComponent } from "../../../common/portfolio-header/portfolio-header.component";
import { PortfolioFooterComponent } from "../../../common/portfolio-footer/portfolio-footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [PortfolioHeaderComponent, RouterOutlet, PortfolioFooterComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent {

}
