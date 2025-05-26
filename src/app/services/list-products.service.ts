import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../domain/product';


@Injectable({
  providedIn: 'root'
})
export class ListProductsService {
  private readonly apiUrl = 'http://localhost:8080/ecommerce/product'; // Ajuste a URL conforme necessário

  constructor(private http: HttpClient) { }

  /**
   * Lista todos os produtos (não paginado)
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

}