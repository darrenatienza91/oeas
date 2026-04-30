import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAttemptRecordingComponent } from '../exam-recording/exam-recording.component';

describe('ExamAttemptRecordingComponent', () => {
  let component: ExamAttemptRecordingComponent;
  let fixture: ComponentFixture<ExamAttemptRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamAttemptRecordingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAttemptRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
