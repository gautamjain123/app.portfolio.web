import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnippetGeneratorComponent } from './snippet-generator.component';

describe('SnippetGeneratorComponent', () => {
  let component: SnippetGeneratorComponent;
  let fixture: ComponentFixture<SnippetGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnippetGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
