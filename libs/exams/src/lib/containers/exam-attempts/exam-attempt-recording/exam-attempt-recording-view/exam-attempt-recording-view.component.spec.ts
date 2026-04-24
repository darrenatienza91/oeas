import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAttemptRecordingViewComponent } from '../exam-recording-view/exam-recording-view.component';

describe('ExamAttemptRecordingViewComponent', () => {
  let component: ExamAttemptRecordingViewComponent;
  let fixture: ComponentFixture<ExamAttemptRecordingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamAttemptRecordingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAttemptRecordingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
