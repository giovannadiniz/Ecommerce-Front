import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../domain/user';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  fullName: string = '';
  username: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

   onSubmit() {
     this.errorMessage = '';
      this.successMessage = '';

    const userData: User = {
      fullname: this.fullName,
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: 'ADMIN'
    };

    this.authService.registerUser(userData).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido:', response);
        this.successMessage = 'Registro realizado com sucesso! Redirecionando para o login...';
        // Redireciona para o login após 2 segundos para mostrar a mensagem de sucesso
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erro no registro:', err);
        if (err.status === 400) {
          this.errorMessage = 'Usuário já existe. Escolha outro nome de usuário.';
        } else {
          this.errorMessage = 'Erro ao registrar. Tente novamente.';
        }
      }
    });
  }

  //   this.authService.registerUser(userData).subscribe({
  //     next: (response) => {
  //       console.log('Registro bem-sucedido:', response);
  //       this.router.navigate(['/login']);
  //     },
  //     error: (err) => {
  //       console.error('Erro no registro:', err);
  //       this.errorMessage = err.error?.message || 'Erro ao registrar. Tente novamente.';
  //     }
  //   });
  // }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }
}


//     ngOnInit(){
//       this.registerUser();
//     }

//     registerUser(user: User){
//         this.user = new User;
//       }
//     }


//   onSubmit() {
//     console.log('Registration data:', {
//       fullName: this.fullName,
//       username: this.username,
//       email: this.email,
//       phone: this.phone,
//       password: this.password
//     });
//     // Adicione aqui a lógica de registro
//   }

//   passwordsMatch(): boolean {
//     return this.password === this.confirmPassword;
//   }
// }
