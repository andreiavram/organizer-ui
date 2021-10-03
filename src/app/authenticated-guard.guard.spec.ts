import { TestBed } from '@angular/core/testing';

import { AuthenticatedGuardGuard } from './authenticated-guard.guard';

describe('AuthenticatedGuardGuard', () => {
  let guard: AuthenticatedGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthenticatedGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
