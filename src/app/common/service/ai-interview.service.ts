import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

export interface AiInterviewResponse {
  output: string;
  modelUsed?: string;
}

@Injectable({ providedIn: 'root' })
export class AiInterviewService {
  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    return environment.apiBaseUrl
      ? `${environment.apiBaseUrl}/api/ai-interview`
      : `/api/ai-interview`;
  }

  generateQuestion(topic: string, difficulty: 'easy' | 'medium' | 'hard'): Observable<AiInterviewResponse> {
    return this.http.post<AiInterviewResponse>(this.getApiUrl(), {
      action: 'generate',
      payload: { topic, difficulty }
    });
  }

  evaluateAnswer(question: string, answer: string): Observable<AiInterviewResponse> {
    return this.http.post<AiInterviewResponse>(this.getApiUrl(), {
      action: 'evaluate',
      payload: { question, answer }
    });
  }
}
