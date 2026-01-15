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

        // ✅ fallback: if model doesn't follow structure still show output
        if (!this.tsCode && !this.htmlCode && !this.scssCode) {
          this.componentName = 'GeneratedComponent';
          this.tsCode = output;
        }

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

  // ✅ supports BOTH:
  // ---TS--- OR #### TS formats
  private parseSnippetOutput(text: string) {
    const src = (text || '').trim();

    // remove intro like "Here's ..."
    const cleaned = src.replace(/^Here.*?\n\n/gi, '').trim();

    // ✅ component name (---COMPONENT_NAME--- OR ### ComponentName)
    let componentName = '';

    const nameFromDash = this.extractBetween(cleaned, /---COMPONENT_NAME---/i, /---TS---/i);
    if (nameFromDash) componentName = nameFromDash.trim();

    if (!componentName) {
      const nameMatch = cleaned.match(/^###\s*(.+)$/m);
      componentName = nameMatch?.[1]?.trim() || '';
    }

    componentName = componentName.replace(/[`"'<>]/g, '').trim() || 'GeneratedComponent';

    // ✅ extract TS/HTML/SCSS/NOTES from both formats
    const ts =
      this.extractBlock(cleaned, 'TS', ['HTML']) ||
      this.extractBlockByHeading(cleaned, 'TS', ['HTML']);

    const html =
      this.extractBlock(cleaned, 'HTML', ['SCSS']) ||
      this.extractBlockByHeading(cleaned, 'HTML', ['SCSS']);

    const scss =
      this.extractBlock(cleaned, 'SCSS', ['NOTES']) ||
      this.extractBlockByHeading(cleaned, 'SCSS', ['NOTES']);

    const notes =
      this.extractBlock(cleaned, 'NOTES', []) ||
      this.extractBlockByHeading(cleaned, 'NOTES', []);

    // ✅ strip ``` fences
    const stripFences = (val: string) =>
      (val || '')
        .replace(/```[a-z]*\n?/gi, '')
        .replace(/```/g, '')
        .trim();

    return {
      componentName,
      ts: stripFences(ts),
      html: stripFences(html),
      scss: stripFences(scss),
      notes: stripFences(notes)
    };
  }

  /* ---------------- HELPERS ---------------- */

  private extractBetween(text: string, start: RegExp, end: RegExp): string {
    const startIndex = text.search(start);
    if (startIndex === -1) return '';

    const afterStart = text.slice(startIndex);
    const startLine = afterStart.split('\n')[0];
    const remaining = afterStart.slice(startLine.length).trim();

    const endIndex = remaining.search(end);
    return endIndex === -1 ? remaining.trim() : remaining.slice(0, endIndex).trim();
  }

  // for ---TS--- blocks
  private extractBlock(text: string, label: string, nextLabels: string[]): string {
    const start = new RegExp(`---${label}---`, 'i');
    const end = nextLabels.length
      ? new RegExp(`---(${nextLabels.join('|')})---`, 'i')
      : null;

    const startIndex = text.search(start);
    if (startIndex === -1) return '';

    const after = text.slice(startIndex);
    const firstLine = after.split('\n')[0];
    const remaining = after.slice(firstLine.length).trim();

    if (!end) return remaining.trim();

    const endIndex = remaining.search(end);
    return endIndex === -1 ? remaining.trim() : remaining.slice(0, endIndex).trim();
  }

  // for #### TS headings
  private extractBlockByHeading(text: string, label: string, nextLabels: string[]): string {
    const start = new RegExp(`^#{3,4}\\s*${label}\\b`, 'im');
    const end = nextLabels.length
      ? new RegExp(`^#{3,4}\\s*(${nextLabels.join('|')})\\b`, 'im')
      : null;

    const startIndex = text.search(start);
    if (startIndex === -1) return '';

    const after = text.slice(startIndex);
    const firstLine = after.split('\n')[0];
    const remaining = after.slice(firstLine.length).trim();

    if (!end) return remaining.trim();

    const endIndex = remaining.search(end);
    return endIndex === -1 ? remaining.trim() : remaining.slice(0, endIndex).trim();
  }
}
