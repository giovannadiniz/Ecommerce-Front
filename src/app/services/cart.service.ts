import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import {Cart} from '../interfaces/Cart';
import {Product} from '../../domain/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = 'http://localhost:8080/ecommerce/carts';

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  addToCart(productId: string | undefined, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(
      `${this.apiUrl}/my-cart`,
      { productId, quantity },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/my-cart`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCart(productId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/my-cart`,
      { productId, quantity },
      { headers: this.getHeaders() }
    ).pipe(
      catchError(this.handleError)
    );
  }

  clearCart(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/my-cart/clear`, {}, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  removeCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/my-cart`, { headers: this.getHeaders() })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
