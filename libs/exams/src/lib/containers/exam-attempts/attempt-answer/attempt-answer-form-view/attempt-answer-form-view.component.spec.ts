import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttemptAnswerFormViewComponent } from '../../exam-item-points/exam-item-points-form-view/exam-item-points-form-view.component';

describe('AttemptAnswerFormViewComponent', () => {
  let component: AttemptAnswerFormViewComponent;
  let fixture: ComponentFixture<AttemptAnswerFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttemptAnswerFormViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttemptAnswerFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
