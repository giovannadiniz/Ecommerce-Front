import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import { PageProductsComponent } from './components/page-products/page-products.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registro'
  },
  {
    path: '',
    component: PageProductsComponent,
    title: 'Home'
  }
  ,
];
