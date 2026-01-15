import { TestBed } from '@angular/core/testing';

import { AiInterviewService } from './ai-interview.service';

describe('AiInterviewService', () => {
  let service: AiInterviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiInterviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
