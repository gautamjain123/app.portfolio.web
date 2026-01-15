import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewArenaComponent } from './interview-arena.component';

describe('InterviewArenaComponent', () => {
  let component: InterviewArenaComponent;
  let fixture: ComponentFixture<InterviewArenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterviewArenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterviewArenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
