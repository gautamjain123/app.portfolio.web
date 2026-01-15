import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiLabService } from '../../../common/service/ai-lab.service';

export type RoastMode = 'senior' | 'roast' | 'interview';

@Component({
  selector: 'app-code-roast',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './code-roast.component.html',
  styleUrls: ['./code-roast.component.scss']   // ✅ correct
})
export class CodeRoastComponent {
  code: string = '';
  mode: RoastMode = 'senior';

  result: string = '';
  loading: boolean = false;
  errorMsg: string = '';

  constructor(private ai: AiLabService) {}

  roastCode(): void {
    if (!this.code.trim()) return;

    this.loading = true;
    this.result = '';
    this.errorMsg = '';

    this.ai.codeRoast(this.code, this.mode).subscribe({
      next: (res) => {
        this.result = res?.output || 'No output returned';
        this.loading = false;
      },
      error: (err) => {
        console.error('AI Roast Error:', err);
        this.errorMsg = err?.error?.error || 'Something went wrong. Try again.';
        this.loading = false;
      }
    });
  }

  clearAll(): void {
    this.code = '';
    this.result = '';
    this.errorMsg = '';
    this.mode = 'senior';
  }

  copyResult(): void {
    if (!this.result?.trim()) return;
    navigator.clipboard.writeText(this.result);
  }
}
