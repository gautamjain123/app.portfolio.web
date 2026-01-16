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
  styleUrls: ['./interview-arena.component.scss']
})
export class InterviewArenaComponent implements OnDestroy {
  topic = 'Angular';
  difficulty: Difficulty = 'medium';

  loadingQ = false;
  loadingEval = false;
  errorMsg = '';
  testCompletedMsg = '';

  // ✅ TEST MODE
  totalQuestions = 10;
  currentQuestionNo = 0; // 0 = not started, 1..10 running
  isTestMode = false;

  // question section
  question = '';
  keyPoints: string[] = [];

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

  // ✅ lock answer after evaluation
  isAnswerLocked = false;

  constructor(
    private ai: AiInterviewService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
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

  // ---------------- TEST CONTROL ----------------
  startTest(): void {
    this.isTestMode = true;
    this.testCompletedMsg = '';
    this.errorMsg = '';

    this.currentQuestionNo = 0;
    this.question = '';
    this.answer = '';
    this.keyPoints = [];

    this.clearEvaluation();
    this.resetTimer();
    this.isAnswerLocked = false;

    // ✅ start with question 1
    this.generateQuestion();
  }

  private finishTest(): void {
    this.isTestMode = false;
    this.isAnswerLocked = true;
    this.stopTimer();

    this.testCompletedMsg = `✅ Test completed! You finished ${this.totalQuestions}/${this.totalQuestions} questions.`;
  }

  // ---------------- QUESTION (Practice + Test) ----------------
  generateQuestion(): void {
    // ✅ stop if test ended
    if (this.isTestMode && this.currentQuestionNo >= this.totalQuestions) {
      this.finishTest();
      return;
    }

    this.loadingQ = true;
    this.errorMsg = '';
    this.testCompletedMsg = '';

    this.question = '';
    this.keyPoints = [];
    this.answer = '';

    this.clearEvaluation();
    this.resetTimer();
    this.isAnswerLocked = false;

    const start = performance.now();

    this.ai.generateQuestion(this.topic, this.difficulty).subscribe({
      next: (res) => {
        this.timeTakenMs = Math.round(performance.now() - start);
        this.modelUsed = res?.modelUsed || '';

        const parsed = this.parseGenerateOutput(res?.output || '');
        this.question = parsed.question;
        this.keyPoints = parsed.keyPoints;

        // ✅ increase count ONLY in test mode
        if (this.isTestMode) {
          this.currentQuestionNo++;
        }

        this.loadingQ = false;
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
    if (this.isAnswerLocked) return;
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

        // ✅ LOCK answer after evaluation
        this.isAnswerLocked = true;

        // ✅ streak update
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

  // ---------------- NEXT (only for test mode) ----------------
  next(): void {
    if (!this.isTestMode) return;

    // ✅ If reached end, finish
    if (this.currentQuestionNo >= this.totalQuestions) {
      this.finishTest();
      return;
    }

    // reset for next question
    this.answer = '';
    this.keyPoints = [];
    this.clearEvaluation();
    this.isAnswerLocked = false;

    this.resetTimer();

    // ✅ if ai returned nextQuestion use it, else generate fresh
    if (this.nextQuestion?.trim()) {
      this.question = this.nextQuestion;
      this.nextQuestion = '';
      this.startTimer();

      // ✅ progress
      this.currentQuestionNo++;
    } else {
      this.generateQuestion();
    }

    // ✅ smooth scroll to question (avoid page jump)
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.querySelector('.arena-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  // ---------------- HELPERS ----------------
  clearEvaluation(): void {
    this.score = '';
    this.feedback = '';
    this.missingPoints = [];
    this.idealAnswer = '';
    this.nextQuestion = '';
  }

  copy(text: string): void {
    if (!text?.trim()) return;
    if (!isPlatformBrowser(this.platformId)) return;
    navigator.clipboard.writeText(text);
  }

  // ---------------- PARSERS ----------------
  private parseGenerateOutput(text: string) {
    const src = (text || '').trim();

    const question = this.getBlock(src, 'QUESTION', ['KEY_POINTS']).trim();

    // ✅ ignore followups completely
    const keyPointsRaw = this.getBlock(src, 'KEY_POINTS', ['FOLLOW_UPS']);

    const normalizeList = (raw: string) =>
      raw
        .split('\n')
        .map((x) => x.replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean);

    return {
      question,
      keyPoints: normalizeList(keyPointsRaw)
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
      .map((x) => x.replace(/^[-*•]\s*/, '').trim())
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
