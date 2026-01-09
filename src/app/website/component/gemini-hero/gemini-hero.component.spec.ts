import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeminiHeroComponent } from './gemini-hero.component';

describe('GeminiHeroComponent', () => {
  let component: GeminiHeroComponent;
  let fixture: ComponentFixture<GeminiHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeminiHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeminiHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
