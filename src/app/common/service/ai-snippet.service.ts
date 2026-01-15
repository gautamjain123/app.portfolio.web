import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/enviroment';

export interface AiSnippetResponse {
  output: string;
  modelUsed?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiSnippetService {
  constructor(private http: HttpClient) {}

  private getApiUrl(): string {
    return environment.apiBaseUrl
      ? `${environment.apiBaseUrl}/api/ai-snippet`
      : `/api/ai-snippet`;
  }

  generateSnippet(prompt: string): Observable<AiSnippetResponse> {
    return this.http.post<AiSnippetResponse>(this.getApiUrl(), { prompt });
  }
}
