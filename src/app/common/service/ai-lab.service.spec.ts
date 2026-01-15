import { TestBed } from '@angular/core/testing';

import { AiLabService } from './ai-lab.service';

describe('AiLabService', () => {
  let service: AiLabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiLabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
