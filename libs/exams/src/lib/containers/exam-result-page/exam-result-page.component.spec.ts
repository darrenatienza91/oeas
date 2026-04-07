import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamResultPageComponent } from '../take-exam-result/take-exam-result.component';

describe('ExamResultPageComponent', () => {
  let component: ExamResultPageComponent;
  let fixture: ComponentFixture<ExamResultPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamResultPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
