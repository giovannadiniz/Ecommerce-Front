import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { User } from '../../domain/user';
import {Observable, tap, throwError} from 'rxjs';
import { LoginResponse } from '../interfaces/LoginResponse';
import { LoginRequest } from '../interfaces/LoginRequest';
import {Cart} from '../interfaces/Cart';
import {Router} from '@angular/router';
import {NavigationState} from '../interfaces/NavigationState';
import { JwtHelperService } from '@auth0/angular-jwt';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private jwtHelper = new JwtHelperService();
  private readonly apiUrl = 'http://localhost:8080/ecommerce/auth';
  private readonly apiCartUrl = 'http://localhost:8080/ecommerce/cart';
  private tokenKey = 'auth_token';


  constructor(private http: HttpClient, private router: Router,  @Inject(PLATFORM_ID) private platformId: Object) { }

      registerUser(userData: User): Observable<User> {
       return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }
  loginUser(loginData: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
      }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (e) {
      console.error('Erro ao verificar token:', e);
      return true;
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated() && !this.isTokenExpired();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    window.location.href = '/login';
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return this.getToken() !== null;
    }
    return false;
  }

  addToCart(productId: number): Observable<Cart> {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login'], {
        state: {
          returnUrl: this.router.url,
          intent: 'add-to-cart',
          productId: productId
        } as NavigationState
      });
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.post<Cart>(`${this.apiCartUrl}`, { productId }, { headers });
  }

  completePendingCartAction(productId: number): Observable<Cart> {
    return this.addToCart(productId);
  }

}
