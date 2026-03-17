import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeExamQuestionViewComponent } from './take-exam-question-view.component';

describe('TakeExamQuestionViewComponent', () => {
  let component: TakeExamQuestionViewComponent;
  let fixture: ComponentFixture<TakeExamQuestionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakeExamQuestionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeExamQuestionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
