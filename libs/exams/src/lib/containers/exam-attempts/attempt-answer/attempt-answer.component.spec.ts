import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttemptAnswerComponent } from '../exam-item-points/exam-item-points.component';

describe('AttemptAnswerComponent', () => {
  let component: AttemptAnswerComponent;
  let fixture: ComponentFixture<AttemptAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttemptAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttemptAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
