import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiSnippetService } from '../../../common/service/ai-snippet.service';

@Component({
  selector: 'app-snippet-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './snippet-generator.component.html',
    styleUrls: ['./snippet-generator.component.scss']
})
export class SnippetGeneratorComponent {
  prompt = '';
  loading = false;
  errorMsg = '';

  componentName = '';
  tsCode = '';
  htmlCode = '';
  scssCode = '';
  notes = '';

  modelUsed = '';
  timeTakenMs: number | null = null;

  constructor(private ai: AiSnippetService) {}

  generate(): void {
    if (!this.prompt.trim()) return;

    this.loading = true;
    this.errorMsg = '';

    this.componentName = '';
    this.tsCode = '';
    this.htmlCode = '';
    this.scssCode = '';
    this.notes = '';

    const start = performance.now();

    this.ai.generateSnippet(this.prompt).subscribe({
      next: (res: any) => {
        this.timeTakenMs = Math.round(performance.now() - start);
        const output = res?.output || '';
        this.modelUsed = res?.modelUsed || '';

        const parsed = this.parseSnippetOutput(output);

        this.componentName = parsed.componentName;
        this.tsCode = parsed.ts;
        this.htmlCode = parsed.html;
        this.scssCode = parsed.scss;
        this.notes = parsed.notes;

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg =
          err?.error?.details?.error?.message ||
          err?.error?.error ||
          'Something went wrong.';
        this.loading = false;
      }
    });
  }

  clearAll(): void {
    this.prompt = '';
    this.errorMsg = '';
    this.componentName = '';
    this.tsCode = '';
    this.htmlCode = '';
    this.scssCode = '';
    this.notes = '';
    this.modelUsed = '';
    this.timeTakenMs = null;
  }

  copy(text: string): void {
    if (!text?.trim()) return;
    navigator.clipboard.writeText(text);
  }

  private parseSnippetOutput(text: string) {
    const src = (text || '').trim();

    const getBlock = (label: string, next?: string) => {
      const start = new RegExp(`---${label}---`, 'i');
      const nextRgx = next ? new RegExp(`---${next}---`, 'i') : null;

      const startIndex = src.search(start);
      if (startIndex === -1) return '';

      const after = src.slice(startIndex);
      const firstLine = after.split('\n')[0];
      const remaining = after.slice(firstLine.length).trim();

      if (!nextRgx) return remaining.trim();

      const nextIndex = remaining.search(nextRgx);
      return nextIndex === -1 ? remaining.trim() : remaining.slice(0, nextIndex).trim();
    };

    const componentName = getBlock('COMPONENT_NAME', 'TS') || 'GeneratedStandaloneComponent';
    const ts = getBlock('TS', 'HTML');
    const html = getBlock('HTML', 'SCSS');
    const scss = getBlock('SCSS', 'NOTES');
    const notes = getBlock('NOTES');

    return {
      componentName: componentName.replace(/[`"'<>]/g, '').trim(),
      ts,
      html,
      scss,
      notes
    };
  }
}
