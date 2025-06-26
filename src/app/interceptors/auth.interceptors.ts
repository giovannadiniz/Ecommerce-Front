import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('authToken');
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next(authReq);
    }
  }
  return next(req);
};
