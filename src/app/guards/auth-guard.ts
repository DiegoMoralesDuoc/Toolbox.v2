import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {  console.log('AuthGuard instantiated');}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    console.log('AuthGuard: url=', state.url, 'isLoggedIn=', isLoggedIn);

    if (!isLoggedIn && state.url !== '/login') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;

  }

  
}
