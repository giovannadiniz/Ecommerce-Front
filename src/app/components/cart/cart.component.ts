import {Component, OnInit} from '@angular/core';
import {Cart} from '../../interfaces/Cart';
import {CartService} from '../../services/cart.service';
import {AuthenticationService} from '../../services/authentication.service';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.error = 'Você precisa estar logado para ver o carrinho';
      this.loading = false;
      return;
    }

    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar o carrinho';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateQuantity(newQuantity: number): void {
    if (!this.cart) return;

    if (newQuantity < 1 || (this.cart.product && newQuantity > this.cart.quantity)) {
      return;
    }

    this.loading = true;
    this.cartService.updateCart(this.cart.productId, newQuantity).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao atualizar o carrinho';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // clearCart(): void {
  //   this.loading = true;
  //   this.cartService.clearCart().subscribe({
  //     next: () => {
  //       this.cart = null;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.error = 'Erro ao limpar o carrinho';
  //       this.loading = false;
  //       console.error(err);
  //     }
  //   });
  // }
  //
  // removeCart(): void {
  //   this.loading = true;
  //   this.cartService.removeCart().subscribe({
  //     next: () => {
  //       this.cart = null;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.error = 'Erro ao remover o carrinho';
  //       this.loading = false;
  //       console.error(err);
  //     }
  //   });
  // }
}

