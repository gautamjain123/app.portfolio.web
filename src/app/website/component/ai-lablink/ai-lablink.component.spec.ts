import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiLablinkComponent } from './ai-lablink.component';

describe('AiLablinkComponent', () => {
  let component: AiLablinkComponent;
  let fixture: ComponentFixture<AiLablinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiLablinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiLablinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
