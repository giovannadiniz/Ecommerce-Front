import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../domain/user';
import { Observable } from 'rxjs';
import { LoginResponse } from '../interfaces/LoginResponse';
import { LoginRequest } from '../interfaces/LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly apiUrl = 'http://localhost:8080/ecommerce/auth'; 

    constructor(private http: HttpClient) { }

      registerUser(userData: User): Observable<User> {
       return this.http.post<User>(`${this.apiUrl}/register`, userData);
  }
      loginUser(loginData: LoginRequest): Observable<LoginResponse> {
      return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData);
      }
}
