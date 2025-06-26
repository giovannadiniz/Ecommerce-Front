import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../domain/product';


@Injectable({
  providedIn: 'root'
})
export class ListProductsService {
  private readonly apiUrl = 'http://localhost:8080/ecommerce/product';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

}
