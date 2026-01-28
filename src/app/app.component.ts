import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ThreePreloaderComponent } from "./common/three-preloader/three-preloader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThreePreloaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private siteTitle = 'Build With Gautam | Frontend Developer';
  private siteDescription =
    'Portfolio of Gautam Jain — Software & Web Developer specializing in Angular, UI, animations, and modern web experiences.';
  private siteUrl = 'https://buildwithgautam.com';
  private previewImage = 'https://buildwithgautam.com/assets/images/og-preview.png';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.setBasicSEO();
    this.setOpenGraph();
    this.setTwitterCard();
    this.setCanonicalURL();
    this.addStructuredData();
  }

  /* ---------- BASIC SEO ---------- */
  private setBasicSEO() {
    this.titleService.setTitle(this.siteTitle);

    this.metaService.updateTag({ name: 'description', content: this.siteDescription });
    this.metaService.updateTag({ name: 'keywords', content: 'Frontend Developer, Angular Developer, UI Developer, Portfolio, Web Developer India, Gautam Jain' });
    this.metaService.updateTag({ name: 'author', content: 'Gautam Jain' });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    this.metaService.updateTag({ name: 'theme-color', content: '#4f8cff' });
  }

  /* ---------- OPEN GRAPH (LinkedIn / Facebook) ---------- */
  private setOpenGraph() {
    this.metaService.updateTag({ property: 'og:title', content: this.siteTitle });
    this.metaService.updateTag({ property: 'og:description', content: this.siteDescription });
    this.metaService.updateTag({ property: 'og:image', content: this.previewImage });
    this.metaService.updateTag({ property: 'og:url', content: this.siteUrl });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:site_name', content: 'Build With Gautam' });
  }

  /* ---------- TWITTER CARD ---------- */
  private setTwitterCard() {
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: this.siteTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: this.siteDescription });
    this.metaService.updateTag({ name: 'twitter:image', content: this.previewImage });
    this.metaService.updateTag({ name: 'twitter:creator', content: '@yourhandle' }); // optional
  }

  /* ---------- CANONICAL URL ---------- */
  private setCanonicalURL() {
    if (isPlatformBrowser(this.platformId)) {
      const existingLink: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");
      const link: HTMLLinkElement = existingLink || this.doc.createElement('link');

      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', this.siteUrl);

      if (!existingLink) {
        this.doc.head.appendChild(link);
      }
    }
  }

  /* ---------- STRUCTURED DATA (GOOGLE RICH RESULTS) ---------- */
  private addStructuredData() {
    if (isPlatformBrowser(this.platformId)) {
      const script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Gautam Jain",
        "url": this.siteUrl,
        "image": this.previewImage,
        "jobTitle": "Frontend Developer",
        "sameAs": [
          "https://www.linkedin.com/in/yourprofile",
          "https://github.com/yourprofile"
        ],
        "knowsAbout": [
          "Angular",
          "Frontend Development",
          "UI/UX",
          "Web Performance",
          "Three.js"
        ]
      });

      this.doc.head.appendChild(script);
    }
  }
}
