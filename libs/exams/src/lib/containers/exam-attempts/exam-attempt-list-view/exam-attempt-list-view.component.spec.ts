import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAttemptListViewComponent } from './exam-attempt-list-view.component';

describe('ExamAttemptListViewComponent', () => {
  let component: ExamAttemptListViewComponent;
  let fixture: ComponentFixture<ExamAttemptListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamAttemptListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAttemptListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
