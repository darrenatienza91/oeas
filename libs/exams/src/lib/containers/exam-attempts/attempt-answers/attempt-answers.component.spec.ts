import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttemptAnswersComponent } from './attempt-answers.component';

describe('AttemptAnswersComponent', () => {
  let component: AttemptAnswersComponent;
  let fixture: ComponentFixture<AttemptAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttemptAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttemptAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
