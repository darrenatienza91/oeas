import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamAttemptsComponent } from './exam-attempts.component';

describe('ExamAttemptsComponent', () => {
  let component: ExamAttemptsComponent;
  let fixture: ComponentFixture<ExamAttemptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamAttemptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamAttemptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
