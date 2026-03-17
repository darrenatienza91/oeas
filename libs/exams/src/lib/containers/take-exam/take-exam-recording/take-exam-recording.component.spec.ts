import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeExamRecordingComponent } from './take-exam-recording.component';

describe('TakeExamRecordingComponent', () => {
  let component: TakeExamRecordingComponent;
  let fixture: ComponentFixture<TakeExamRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakeExamRecordingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeExamRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
