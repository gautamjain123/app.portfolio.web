import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Build With Gautam | Full Stack Frontend Developer';

  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);

    this.metaService.addTags([
      { name: 'description', content: 'Portfolio of Gautam Jain — Software & Web Developer specializing in Angular, UI, WordPress, and modern web experiences.' },
      { name: 'keywords', content: 'Frontend Developer, Angular Developer, UI Developer, Portfolio, Web Developer India, Gautam Jain' },
      { name: 'author', content: 'Gautam Jain' },
      { name: 'robots', content: 'index, follow' },

      // Open Graph SEO (LinkedIn / Facebook sharing)
      { property: 'og:title', content: 'Build With Gautam | Frontend Developer' },
      { property: 'og:description', content: 'I build interactive UI, scalable apps, 3D effects, performance optimized experiences.' },
      { property: 'og:image', content: 'https://buildwithgautam.com/assets/images/og-preview.jpg' },
      { property: 'og:url', content: 'https://buildwithgautam.com' },
      { property: 'og:type', content: 'website' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Build With Gautam' },
      { name: 'twitter:description', content: 'Frontend Developer Portfolio' },
      { name: 'twitter:image', content: 'https://buildwithgautam.com/assets/images/og-preview.jpg' }
    ]);
  }
}
