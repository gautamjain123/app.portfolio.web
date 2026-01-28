import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreePreloaderComponent } from './three-preloader.component';

describe('ThreePreloaderComponent', () => {
  let component: ThreePreloaderComponent;
  let fixture: ComponentFixture<ThreePreloaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreePreloaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreePreloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
