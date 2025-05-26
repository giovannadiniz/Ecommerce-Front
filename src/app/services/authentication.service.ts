import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../domain/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly apiUrl = 'http://localhost:8080/ecommerce/auth'; // Ajuste a URL conforme necessário

    constructor(private http: HttpClient) { }

      registerUser(userData: User): Observable<User> {
       return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }
}
