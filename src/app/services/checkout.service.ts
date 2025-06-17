import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Product} from '../../domain/product';
import {AuthenticationService} from './authentication.service';
import {catchError} from 'rxjs/operators';

export interface CheckoutRequest {
  cartId: number;
  userId: number;
  productId: number;
  total: string;
  quantity: number;
}


export interface CheckoutResponse {
  id?: number;
  product: Product;
  quantity: number;
  total: string;
  status: string;
  qrCode: string;
  qrCodeImage?: string;
  txid?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost:8080/ecommerce'; // Ajuste conforme sua URL

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getCheckoutById(id: string): Observable<CheckoutResponse> {
    const headers = this.getHeaders(); // ou como você faz a autenticação
    return this.http.get<CheckoutResponse>(`${this.apiUrl}/checkout/${id}`, { headers });
  }

  processarCheckout(checkoutData: CheckoutRequest): Observable<CheckoutResponse> {

    // Debug: Mostra o token e seu tempo de expiração
    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token expira em:', new Date(payload.exp * 1000));
    }

    return this.http.post<CheckoutResponse>(
      `${this.apiUrl}/checkout/processar`,
      {
        ...checkoutData,
        idCart: checkoutData.cartId // Garante que o campo está com o nome esperado pelo backend
      },
      { headers: this.getHeaders() }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.authService.logout();
          return throwError(() => new Error('FORBIDDEN'));
        }
        return throwError(() => error);
      })
    );
  }

  consultarPedido(orderId: number): Observable<CheckoutResponse> {
    return this.http.get<CheckoutResponse>(`${this.apiUrl}/orders/${orderId}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido';
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do servidor
      errorMessage = `Código: ${error.status}\nMensagem: ${error.message}`;

      // Tratamento específico para 403
      // if (error.status === 403) {
      //   errorMessage = 'Acesso negado. Verifique suas credenciais.';
      //   // Opcional: fazer logout se o token for inválido
      //   this.authService.logout();
      // }
    }
    return throwError(() => new Error(errorMessage));
  }
}
