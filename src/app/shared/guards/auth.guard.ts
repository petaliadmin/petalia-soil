import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  router.navigate(['/admin/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

/**
 * Guard to protect routes that require admin role
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/admin/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (!authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  return true;
};

/**
 * Guard to protect routes that require owner role (or admin)
 */
export const ownerGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/admin/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (!authService.isOwner()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};

/**
 * Guard that redirects authenticated users away from login page
 */
export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  return true;
};
