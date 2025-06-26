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
         alert('✅ Cadastro realizado com sucesso!\nVocê será redirecionado para a página de login.');
         this.router.navigate(['/login']);
       },
       error: (err) => {
         let errorMsg = '❌ Erro no cadastro:\n';

         if (err.status === 400) {
           errorMsg += 'Dados inválidos. Verifique as informações.';
         } else {
           errorMsg += 'Campos inválidos. Verifique as informações e Tente novamente.';
         }

         alert(errorMsg);
       }
     });
   }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }
}
