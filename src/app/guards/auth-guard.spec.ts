import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth-guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when logged in', () => {
    spyOn(sessionStorage, 'getItem').and.callFake((key) => {
      if (key === 'isLoggedIn') return 'true';
      return null;
    });
    const canActivate = guard.canActivate({} as any, { url: '/dashboard' } as any);
    expect(canActivate).toBeTrue();
  });

  it('should deny access and redirect when not logged in', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    const canActivate = guard.canActivate({} as any, { url: '/dashboard' } as any);
    expect(canActivate).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
