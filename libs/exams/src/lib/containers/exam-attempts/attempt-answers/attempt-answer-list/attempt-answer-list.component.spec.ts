import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttemptAnswerListComponent } from './attempt-answer-list.component';

describe('AttemptAnswerListComponent', () => {
  let component: AttemptAnswerListComponent;
  let fixture: ComponentFixture<AttemptAnswerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttemptAnswerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttemptAnswerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
