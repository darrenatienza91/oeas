import { TestBed } from '@angular/core/testing';

import { VideoRecorderFacadeService } from './video-recorder-facade.service';

describe('VideoRecorderFacadeService', () => {
  let service: VideoRecorderFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoRecorderFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
