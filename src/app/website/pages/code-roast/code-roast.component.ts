import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiLabResponse, AiLabService } from '../../../common/service/ai-lab.service';

export type SectionKey = 'issues' | 'improvements' | 'betterCode' | 'quickTips' | 'interviewQna';

export interface ParsedSection {
  key: SectionKey;
  title: string;
  icon: string;
  content: string;
  open: boolean;
  copyLabel: string;
}

@Component({
  selector: 'app-code-roast',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-roast.component.html',
  styleUrls: ['./code-roast.component.scss']
})
export class CodeRoastComponent {
  code: string = '';

  result: string = '';
  loading = false;
  errorMsg = '';

  modelUsed = '';
  timeTakenMs: number | null = null;

  sections: ParsedSection[] = [];

  constructor(private ai: AiLabService) {}

  roastCode(): void {
    if (!this.code.trim()) return;

    this.loading = true;
    this.result = '';
    this.errorMsg = '';
    this.sections = [];
    this.modelUsed = '';
    this.timeTakenMs = null;

    const start = performance.now();

    this.ai.codeInterviewReview(this.code).subscribe({
      next: (res:  AiLabResponse) => {
        this.timeTakenMs = Math.round(performance.now() - start);
        this.result = res?.output || 'No output returned';
        this.modelUsed = res?.modelUsed || '';

        this.sections = this.parseSectionsByHeadings(this.result);
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
    this.code = '';
    this.result = '';
    this.errorMsg = '';
    this.sections = [];
    this.modelUsed = '';
    this.timeTakenMs = null;
  }

  copySection(key: SectionKey): void {
    const s = this.sections.find(x => x.key === key);
    if (!s?.content?.trim()) return;
    navigator.clipboard.writeText(s.content);
  }

  copyAll(): void {
    if (!this.result?.trim()) return;
    navigator.clipboard.writeText(this.result);
  }

  toggleSection(section: ParsedSection): void {
    section.open = !section.open;
  }

  // ✅ strict headings parser (since backend will enforce headings now)
  private parseSectionsByHeadings(text: string): ParsedSection[] {
    const titles: { key: SectionKey; title: string; icon: string }[] = [
      { key: 'issues', title: 'Issues', icon: '🚨' },
      { key: 'improvements', title: 'Improvements', icon: '✨' },
      { key: 'betterCode', title: 'Better Code', icon: '🧠' },
      { key: 'quickTips', title: 'Quick Tips', icon: '⚡' },
      { key: 'interviewQna', title: 'Interview Questions', icon: '🎯' }
    ];

    const out: ParsedSection[] = [];

    const getBlock = (title: string, nextTitle?: string) => {
      const start = new RegExp(`###\\s*${title}\\b`, 'i');
      const next = nextTitle ? new RegExp(`###\\s*${nextTitle}\\b`, 'i') : null;

      const startIndex = text.search(start);
      if (startIndex === -1) return '';

      const after = text.slice(startIndex);

      // remove heading line
      const firstLine = after.split('\n')[0];
      let remaining = after.slice(firstLine.length).trim();

      if (!next) return remaining.trim();

      const nextIndex = remaining.search(next);
      return nextIndex === -1 ? remaining.trim() : remaining.slice(0, nextIndex).trim();
    };

    for (let i = 0; i < titles.length; i++) {
      const current = titles[i];
      const next = titles[i + 1]?.title;

      const content = getBlock(current.title, next);
      if (!content.trim()) continue;

      out.push({
        key: current.key,
        title: current.title,
        icon: current.icon,
        content,
        open: current.key !== 'betterCode' ? true : true,
        copyLabel: `Copy ${current.title}`
      });
    }

    return out;
  }
}
