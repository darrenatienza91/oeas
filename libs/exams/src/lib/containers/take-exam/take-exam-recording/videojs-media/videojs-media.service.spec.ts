import { TestBed } from '@angular/core/testing';

import { VideojsMediaService } from './videojs-media.service';

describe('VideojsMediaService', () => {
  let service: VideojsMediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideojsMediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
