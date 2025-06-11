import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LoginRequest } from '../../interfaces/LoginRequest';
import { LoginResponse } from '../../interfaces/LoginResponse';
import {NavigationState} from '../../interfaces/NavigationState';


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

  constructor(private router: Router, private authService: AuthenticationService) {
  }

  onSubmit() {
    const loginData: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.loginUser(loginData).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login bem-sucedido:', response);

        if (response.token) {
          this.authService.setToken(response.token);
        }

        // Obtém o estado com tipagem segura
        const navigation = this.router.getCurrentNavigation();
        const navigationState = navigation?.extras?.state as NavigationState;

        if (navigationState?.intent === 'add-to-cart' && navigationState.productId) {
          this.authService.completePendingCartAction(navigationState.productId).subscribe({
            next: (cart) => {
              console.log('Produto adicionado ao carrinho após login', cart);
              this.router.navigate(['/cart']);
            },
            error: (err) => {
              console.error('Erro ao adicionar ao carrinho:', err);
              this.router.navigate([navigationState.returnUrl || '']);
            }
          });
        } else {
          const returnUrl = navigationState?.returnUrl || '';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (error: any) => {
        console.error('Erro no login:', error);
        this.errorMessage = 'Usuário ou senha inválidos. Tente novamente.';
      }
    });
  }
}



