import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoastMode } from '../../website/pages/code-roast/code-roast.component';
import { environment } from '../../../enviroment/enviroment';

export interface AiLabResponse {
  output: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiLabService {
  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    // ✅ In production: apiBaseUrl = '' so it will use same origin
    // ✅ In development: apiBaseUrl = 'https://buildwithgautam.com'
    return environment.apiBaseUrl
      ? `${environment.apiBaseUrl}/api/ai-lab`
      : `/api/ai-lab`;
  }

  codeRoast(code: string, mode: RoastMode): Observable<AiLabResponse> {
    return this.http.post<AiLabResponse>(this.getApiUrl(), {
      action: 'codeRoast',
      payload: { code, mode }
    });
  }

  generateSnippet(prompt: string): Observable<AiLabResponse> {
    return this.http.post<AiLabResponse>(this.getApiUrl(), {
      action: 'snippet',
      payload: { prompt }
    });
  }

  interviewQuestion(
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard'
  ): Observable<AiLabResponse> {
    return this.http.post<AiLabResponse>(this.getApiUrl(), {
      action: 'interview_question',
      payload: { topic, difficulty }
    });
  }

  interviewEvaluate(question: string, answer: string): Observable<AiLabResponse> {
    return this.http.post<AiLabResponse>(this.getApiUrl(), {
      action: 'interview_evaluate',
      payload: { question, answer }
    });
  }
}
