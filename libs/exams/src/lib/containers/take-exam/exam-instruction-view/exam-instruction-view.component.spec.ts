import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamInstructionViewComponent } from './exam-instruction-view.component';

describe('ExamInstructionViewComponent', () => {
  let component: ExamInstructionViewComponent;
  let fixture: ComponentFixture<ExamInstructionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamInstructionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamInstructionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
