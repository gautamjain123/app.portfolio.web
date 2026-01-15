import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

export interface AiLabResponse {
  output: string;
  modelUsed?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiLabService {
  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    return environment.apiBaseUrl
      ? `${environment.apiBaseUrl}/api/ai-lab`
      : `/api/ai-lab`;
  }

  /**
   * ✅ Interview Style Code Review
   * - Detects code type (HTML/CSS/TS/Angular)
   * - Provides Issues, Improvements
   * - Generates Better Code (full code)
   * - Adds Interview Questions + Answers
   */
codeInterviewReview(code: string): Observable<AiLabResponse> {
  return this.http.post<AiLabResponse>(this.getApiUrl(), {
    action: 'codeInterviewReview',
    payload: { code }
  });
}


}
