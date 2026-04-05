import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeExamResultViewComponent } from './take-exam-result-view.component';

describe('TakeExamResultViewComponent', () => {
  let component: TakeExamResultViewComponent;
  let fixture: ComponentFixture<TakeExamResultViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakeExamResultViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeExamResultViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
