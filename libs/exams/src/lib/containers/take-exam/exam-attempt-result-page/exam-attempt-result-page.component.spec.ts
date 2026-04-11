import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAttemptResultPageComponent } from '../take-exam-result/take-exam-result.component';

describe('ExamAttemptResultPageComponent', () => {
  let component: ExamAttemptResultPageComponent;
  let fixture: ComponentFixture<ExamAttemptResultPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamAttemptResultPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAttemptResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
