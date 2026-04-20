import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttemptAnswerListViewComponent } from './attempt-answer-list-view.component';

describe('AttemptAnswerListViewComponent', () => {
  let component: AttemptAnswerListViewComponent;
  let fixture: ComponentFixture<AttemptAnswerListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttemptAnswerListViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttemptAnswerListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
