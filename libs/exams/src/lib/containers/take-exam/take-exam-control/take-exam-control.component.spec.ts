import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeExamControlComponent } from './take-exam-control.component';

describe('TakeExamControlComponent', () => {
  let component: TakeExamControlComponent;
  let fixture: ComponentFixture<TakeExamControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakeExamControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeExamControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
