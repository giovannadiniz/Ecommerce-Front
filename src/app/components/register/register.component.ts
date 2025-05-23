import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  onSubmit() {
    console.log('Registration data:', {
      fullName: this.fullName,
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password
    });
    // Adicione aqui a lógica de registro
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }
}
