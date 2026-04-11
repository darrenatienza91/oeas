import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeExamCameraViewComponent } from './take-exam-camera-view.component';

describe('TakeExamCameraViewComponent', () => {
  let component: TakeExamCameraViewComponent;
  let fixture: ComponentFixture<TakeExamCameraViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakeExamCameraViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeExamCameraViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
