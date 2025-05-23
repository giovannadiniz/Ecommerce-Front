import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: '/login.component.html',
  styleUrls: ['/login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Login attempt with:', { email: this.email, password: this.password });
    // Aqui você adicionaria a lógica de autenticação
  }

  goRegister(){
    this.router.navigate(['/register']);
  }
}
