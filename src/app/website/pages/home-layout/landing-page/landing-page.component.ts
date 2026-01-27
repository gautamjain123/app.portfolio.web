import { Component } from '@angular/core';
import { PortfolioHeroComponent } from "../../../component/portfolio-hero/portfolio-hero.component";
import { PortfolioAboutComponent } from "../../../component/portfolio-about/portfolio-about.component";
import { PortfolioSkillsComponent } from "../../../component/portfolio-skills/portfolio-skills.component";
import { PortfolioProjectsComponent } from "../../../component/portfolio-projects/portfolio-projects.component";
import { AiLablinkComponent } from "../../../component/ai-lablink/ai-lablink.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [PortfolioHeroComponent, PortfolioAboutComponent, PortfolioSkillsComponent, PortfolioProjectsComponent, AiLablinkComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

}
