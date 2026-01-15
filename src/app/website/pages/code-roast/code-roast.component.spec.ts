import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeRoastComponent } from './code-roast.component';

describe('CodeRoastComponent', () => {
  let component: CodeRoastComponent;
  let fixture: ComponentFixture<CodeRoastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeRoastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeRoastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
