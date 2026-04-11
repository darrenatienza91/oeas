import { TestBed } from '@angular/core/testing';

import { ExamTakerRecordingUploadService } from './exam-taker-recording-upload.service';

describe('ExamTakerRecordingUploadService', () => {
  let service: ExamTakerRecordingUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamTakerRecordingUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
