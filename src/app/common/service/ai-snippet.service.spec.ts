import { TestBed } from '@angular/core/testing';

import { AiSnippetService } from './ai-snippet.service';

describe('AiSnippetService', () => {
  let service: AiSnippetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiSnippetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
