import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LoginRequest } from '../../interfaces/LoginRequest';
import { LoginResponse } from '../../interfaces/LoginResponse';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: '/login.component.html',
  styleUrls: ['/login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthenticationService) {}

  onSubmit() {
    const loginData: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.loginUser(loginData).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login bem-sucedido:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.errorMessage = 'Usuário ou senha inválidos. Tente novamente.';
      }
    });
  }

  goRegister(){
    this.router.navigate(['/register']);
  }
  
}
