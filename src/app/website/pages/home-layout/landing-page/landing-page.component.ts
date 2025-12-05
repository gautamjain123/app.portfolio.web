import { Component } from '@angular/core';
import { PortfolioHeroComponent } from "../../../component/portfolio-hero/portfolio-hero.component";
import { PortfolioAboutComponent } from "../../../component/portfolio-about/portfolio-about.component";
import { PortfolioSkillsComponent } from "../../../component/portfolio-skills/portfolio-skills.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [PortfolioHeroComponent, PortfolioAboutComponent, PortfolioSkillsComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
