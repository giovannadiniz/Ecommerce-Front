import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {CartComponent} from '../cart/cart.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    CartComponent
  ],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isLoggedIn = true;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
    // Verificar o status de login
    // this.authService.isLoggedIn$.subscribe(loggedIn => {
    //   this.isLoggedIn = loggedIn;
    // });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
