import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiInterviewService } from '../../../common/service/ai-interview.service';

type Difficulty = 'easy' | 'medium' | 'hard';

@Component({
  selector: 'app-interview-arena',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview-arena.component.html',
  styleUrls: ['./interview-arena.component.scss'] // ✅ FIXED (styleUrls)
})
export class InterviewArenaComponent implements OnDestroy {
  topic = 'Angular';
  difficulty: Difficulty = 'medium';

  loadingQ = false;
  loadingEval = false;
  errorMsg = '';

  // question section
  question = '';
  keyPoints: string[] = [];
  followUps: string[] = [];

  // answer section
  answer = '';

  // evaluation result
  score = '';
  feedback = '';
  missingPoints: string[] = [];
  idealAnswer = '';
  nextQuestion = '';

  modelUsed = '';
  timeTakenMs: number | null = null;

  // timer
  timerSec = 0;
  timerRunning = false;
  private timerInterval: any;

  // streak
  streak = 0;

  constructor(
    private ai: AiInterviewService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // ✅ browser safe localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.streak = Number(localStorage.getItem('aiInterviewStreak') || 0);
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  // ---------------- TIMER ----------------
  startTimer(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.timerRunning) return;

    this.timerRunning = true;
    this.timerInterval = setInterval(() => {
      this.timerSec++;
    }, 1000);
  }

  pauseTimer(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.timerRunning = false;
    clearInterval(this.timerInterval);
  }

  stopTimer(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.timerRunning = false;
    clearInterval(this.timerInterval);
  }

  resetTimer(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stopTimer();
    this.timerSec = 0;
  }

  formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // ---------------- QUESTION ----------------
  generateQuestion(): void {
    this.loadingQ = true;
    this.errorMsg = '';

    this.question = '';
    this.keyPoints = [];
    this.followUps = [];
    this.answer = '';

    this.clearEvaluation();
    this.resetTimer();

    const start = performance.now();

    this.ai.generateQuestion(this.topic, this.difficulty).subscribe({
      next: (res) => {
        this.timeTakenMs = Math.round(performance.now() - start);
        this.modelUsed = res?.modelUsed || '';

        const parsed = this.parseGenerateOutput(res?.output || '');
        this.question = parsed.question;
        this.keyPoints = parsed.keyPoints;
        this.followUps = parsed.followUps;

        this.loadingQ = false;

        // ✅ auto start timer
        this.startTimer();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg =
          err?.error?.details?.error?.message ||
          err?.error?.error ||
          'Something went wrong generating question.';
        this.loadingQ = false;
      }
    });
  }

  // ---------------- EVALUATE ----------------
  evaluate(): void {
    if (!this.question.trim() || !this.answer.trim()) return;

    this.loadingEval = true;
    this.errorMsg = '';

    const start = performance.now();

    this.ai.evaluateAnswer(this.question, this.answer).subscribe({
      next: (res) => {
        this.timeTakenMs = Math.round(performance.now() - start);
        this.modelUsed = res?.modelUsed || '';

        const parsed = this.parseEvaluateOutput(res?.output || '');
        this.score = parsed.score;
        this.feedback = parsed.feedback;
        this.missingPoints = parsed.missingPoints;
        this.idealAnswer = parsed.idealAnswer;
        this.nextQuestion = parsed.nextQuestion;

        // ✅ streak saved only on browser
        const scoreNumber = Number((this.score || '').split('/')[0]);
        if (!isNaN(scoreNumber) && scoreNumber >= 7 && isPlatformBrowser(this.platformId)) {
          this.streak += 1;
          localStorage.setItem('aiInterviewStreak', String(this.streak));
        }

        this.stopTimer();
        this.loadingEval = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg =
          err?.error?.details?.error?.message ||
          err?.error?.error ||
          'Something went wrong evaluating answer.';
        this.loadingEval = false;
      }
    });
  }

  clearEvaluation(): void {
    this.score = '';
    this.feedback = '';
    this.missingPoints = [];
    this.idealAnswer = '';
    this.nextQuestion = '';
  }

  copy(text: string): void {
    if (!text?.trim()) return;

    // ✅ browser safe
    if (!isPlatformBrowser(this.platformId)) return;

    navigator.clipboard.writeText(text);
  }

  // ---------------- PARSERS ----------------
  private parseGenerateOutput(text: string) {
    const src = (text || '').trim();

    const question = this.getBlock(src, 'QUESTION', ['KEY_POINTS']).trim();
    const keyPointsRaw = this.getBlock(src, 'KEY_POINTS', ['FOLLOW_UPS']);
    const followUpsRaw = this.getBlock(src, 'FOLLOW_UPS', []);

    const normalizeList = (raw: string) =>
      raw
        .split('\n')
        .map(x => x.replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean);

    return {
      question,
      keyPoints: normalizeList(keyPointsRaw),
      followUps: normalizeList(followUpsRaw)
    };
  }

  private parseEvaluateOutput(text: string) {
    const src = (text || '').trim();

    const score = this.getBlock(src, 'SCORE', ['FEEDBACK']).trim();
    const feedback = this.getBlock(src, 'FEEDBACK', ['MISSING_POINTS']).trim();
    const missingPointsRaw = this.getBlock(src, 'MISSING_POINTS', ['IDEAL_ANSWER']);
    const idealAnswer = this.getBlock(src, 'IDEAL_ANSWER', ['NEXT_QUESTION']).trim();
    const nextQuestion = this.getBlock(src, 'NEXT_QUESTION', []).trim();

    const missingPoints = missingPointsRaw
      .split('\n')
      .map(x => x.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean);

    return { score, feedback, missingPoints, idealAnswer, nextQuestion };
  }

  private getBlock(text: string, label: string, nextLabels: string[]) {
    const start = new RegExp(`---${label}---`, 'i');
    const end = nextLabels.length ? new RegExp(`---(${nextLabels.join('|')})---`, 'i') : null;

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
