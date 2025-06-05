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
  private readonly apiUrl = 'http://localhost:8080/ecommerce/cart';

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService) {
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  addToCart(productId: number | undefined, quantity: number = 1): Observable<Cart> {
    if (!productId) {
      return throwError(() => new Error('Product ID is required'));
    }

    const body = {
      productId: productId,
      quantity: quantity
    };

    return this.http.post<Cart>(
      `${this.apiUrl}/add`,
      body,
      {headers: this.getHeaders()}
    );
  }

  /**
   * Obtém o carrinho do usuário autenticado
   */
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(
      `${this.apiUrl}/my-cart`,
      {headers: this.getHeaders()}
    );
  }

  /**
   * Atualiza a quantidade de um produto no carrinho
   * @param productId ID do produto
   * @param quantity Nova quantidade
   */
  updateCart(productId: number, quantity: number): Observable<Cart> {
    const body = {
      productId: productId,
      quantity: quantity
    };

    return this.http.put<Cart>(
      `${this.apiUrl}/update-quantity`,
      body,
      {headers: this.getHeaders()}
    );
  }

  /**
   * Limpa o carrinho (remove produtos mas mantém o carrinho)
   */
  // clearCart(): Observable<string> {
  //   return this.http.delete<string>(
  //     `${this.apiUrl}/clear`,
  //     {
  //       headers: this.getHeaders(),
  //       responseType: 'text' as 'json' // Para receber string response
  //     }
  //   ).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  /**
   * Remove completamente o carrinho do usuário
   */
  // removeCart(): Observable<string> {
  //   return this.http.delete<string>(
  //     `${this.apiUrl}/remove`,
  //     {
  //       headers: this.getHeaders(),
  //       responseType: 'text' as 'json' // Para receber string response
  //     }
  //   ).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  /**
   * Verifica se o usuário tem um carrinho
   */
  hasCart(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.getCart().subscribe({
        next: (cart) => {
          observer.next(!!cart);
          observer.complete();
        },
        error: (error) => {
          if (error.status === 404) {
            observer.next(false);
            observer.complete();
          } else {
            observer.error(error);
          }
        }
      });
    });
  }

  // /**
  //  * Método auxiliar para adicionar produto com validação
  //  */
  // addProductToCart(product: Product, quantity: number = 1): Observable<Cart> {
  //   if (!product || !product.id) {
  //     return throwError(() => new Error('Invalid product'));
  //   }
  //
  //   console.log(`Adding product ${product.id} to cart with quantity ${quantity}`);
  //
  //   return this.addToCart(product.id, quantity);
  // }

  /**
   * Método para incrementar quantidade de um produto
   */
  incrementProductQuantity(productId: number, currentQuantity: number): Observable<Cart> {
    return this.updateCart(productId, currentQuantity + 1);
  }

  /**
   * Método para decrementar quantidade de um produto
   */
  decrementProductQuantity(productId: number, currentQuantity: number): Observable<Cart> {
    if (currentQuantity <= 1) {
      return throwError(() => new Error('Quantity cannot be less than 1'));
    }

    return this.updateCart(productId, currentQuantity - 1);
  }

  /**
   * Obtém o número total de itens no carrinho
   */
  getCartItemCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.getCart().subscribe({
        next: (cart) => {
          observer.next(cart?.quantity || 0);
          observer.complete();
        },
        error: (error) => {
          if (error.status === 404) {
            observer.next(0);
            observer.complete();
          } else {
            observer.error(error);
          }
        }
      });
    });
  }

  /**
   * Obtém o valor total do carrinho
   */
  getCartTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.getCart().subscribe({
        next: (cart) => {
          observer.next(cart?.total || 0);
          observer.complete();
        },
        error: (error) => {
          if (error.status === 404) {
            observer.next(0);
            observer.complete();
          } else {
            observer.error(error);
          }
        }
      });
    });
  }

  // private handleError(error: any) {
  //   console.error('CartService error:', error);
  //
  //   // Tratamento específico para diferentes tipos de erro
  //   if (error.status === 401) {
  //     // Token inválido ou expirado
  //     this.authService.logout(); // Assumindo que existe esse método
  //     return throwError(() => new Error('Session expired. Please login again.'));
  //   }
  //
  //   if (error.status === 403) {
  //     return throwError(() => new Error('Access denied.'));
  //   }
  //
  //   if (error.status === 404) {
  //     return throwError(() => new Error('Cart not found.'));
  //   }
  //
  //   if (error.status === 500) {
  //     return throwError(() => new Error('Server error. Please try again later.'));
  //   }
  //
  //   // Erro genérico
  //   const errorMessage = error.error?.message || error.message || 'An unexpected error occurred';
  //   return throwError(() => new Error(errorMessage));
  // }
}
