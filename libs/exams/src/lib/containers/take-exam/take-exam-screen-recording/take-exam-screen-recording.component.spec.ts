import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeExamScreenRecordingComponent } from './take-exam-screen-recording.component';

describe('TakeExamScreenRecordingComponent', () => {
  let component: TakeExamScreenRecordingComponent;
  let fixture: ComponentFixture<TakeExamScreenRecordingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakeExamScreenRecordingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeExamScreenRecordingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
