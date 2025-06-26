import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OrderResponse} from '../interfaces/OrderResponse';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/ecommerce/checkout';

  constructor(private http: HttpClient, private authService: AuthenticationService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }


  getMyOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/meusPedidos`, {
      headers: this.getHeaders()
    });
  }


  getMyOrder(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/pedido/${orderId}`, {
      headers: this.getHeaders()
    });
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cancelar/${orderId}`, {}, {
      headers: this.getHeaders()
    });
  }

  reorder(orderId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/refazer/${orderId}`, {}, {
      headers: this.getHeaders()
    });
  }

  trackOrder(orderId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/rastrear/${orderId}`, {
      headers: this.getHeaders()
    });
  }
}
