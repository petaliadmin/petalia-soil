import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * HTTP interceptor to add JWT token to requests
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Get the auth token
  const authHeader = authService.getAuthHeader();

  // Clone the request with auth header if token exists
  if (authHeader) {
    req = req.clone({
      setHeaders: {
        Authorization: authHeader
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized - token expired or invalid
      if (error.status === 401) {
        // Check if we're not already on the login page
        if (!req.url.includes('/auth/login')) {
          authService.logoutToLogin();
        }
      }
      return throwError(() => error);
    })
  );
};
