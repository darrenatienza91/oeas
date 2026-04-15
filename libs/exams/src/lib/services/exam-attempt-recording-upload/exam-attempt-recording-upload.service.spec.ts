import { TestBed } from '@angular/core/testing';

import { ExamAttemptRecordingUploadService } from './exam-attempt-recording-upload.service';

describe('ExamAttemptRecordingUploadService', () => {
  let service: ExamAttemptRecordingUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamAttemptRecordingUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
