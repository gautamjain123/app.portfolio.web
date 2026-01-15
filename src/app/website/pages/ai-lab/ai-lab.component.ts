import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CodeRoastComponent } from "../code-roast/code-roast.component";
import { SnippetGeneratorComponent } from "../snippet-generator/snippet-generator.component";
import { InterviewArenaComponent } from "../interview-arena/interview-arena.component";

declare const bootstrap: any;

@Component({
  selector: 'app-ai-lab',
  templateUrl: './ai-lab.component.html',
  standalone: true,
  styleUrls: ['./ai-lab.component.scss'],
  imports: [CodeRoastComponent, SnippetGeneratorComponent, InterviewArenaComponent]
})
export class AiLabComponent implements AfterViewInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // ✅ run only in browser
    if (!isPlatformBrowser(this.platformId)) return;

    const savedTab = localStorage.getItem('aiLabActiveTab');

    // ✅ Restore tab after refresh
    if (savedTab) {
      const el = document.querySelector(`[data-bs-target="${savedTab}"]`) as HTMLElement;

      if (el && typeof bootstrap !== 'undefined') {
        const tab = new bootstrap.Tab(el);
        tab.show();
      }
    }

    // ✅ Save tab whenever user changes
    const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');

    tabButtons.forEach((btn: any) => {
      btn.addEventListener('shown.bs.tab', (event: any) => {
        const target = event.target.getAttribute('data-bs-target');
        if (target) {
          localStorage.setItem('aiLabActiveTab', target);
        }
      });
    });
  }
}
