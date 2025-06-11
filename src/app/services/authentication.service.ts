import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../domain/user';
import {Observable, tap, throwError} from 'rxjs';
import { LoginResponse } from '../interfaces/LoginResponse';
import { LoginRequest } from '../interfaces/LoginRequest';
import {Cart} from '../interfaces/Cart';
import {Router} from '@angular/router';
import {NavigationState} from '../interfaces/NavigationState';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly apiUrl = 'http://localhost:8080/ecommerce/auth';
  private readonly apiCartUrl = 'http://localhost:8080/ecommerce/cart';
  private tokenKey = 'auth_token';


  constructor(private http: HttpClient, private router: Router) { }

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
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Método para adicionar ao carrinho com verificação de autenticação
  addToCart(productId: number): Observable<Cart> {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login'], {
        state: {
          returnUrl: this.router.url,
          intent: 'add-to-cart',
          productId: productId
        } as NavigationState // Cast para o tipo correto
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
