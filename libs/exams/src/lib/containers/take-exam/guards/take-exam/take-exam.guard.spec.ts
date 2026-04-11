import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { takeExamGuard } from './take-exam.guard';

describe('takeExamGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => takeExamGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
