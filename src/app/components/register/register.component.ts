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
  selectedRole: string = 'ADMIN';

    constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.passwordsMatch()) {
      this.errorMessage = 'As senhas não coincidem';
      return ;
    }

    const userData: User = {
      fullname: this.fullName,
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password
      // Adicione outros campos conforme necessário pelo seu backend
    };

      this.authService.registerUser(userData).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido:', response);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Erro no registro:', err);
        this.errorMessage = err.error?.message || 'Erro ao registrar. Tente novamente.';
      }
    });
  }

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
