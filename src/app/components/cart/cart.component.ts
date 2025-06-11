import {Component, OnInit} from '@angular/core';
import {Cart} from '../../interfaces/Cart';
import {CartService} from '../../services/cart.service';
import {AuthenticationService} from '../../services/authentication.service';
import {CurrencyPipe} from '@angular/common';
import {UpdateCartRequest} from '../../interfaces/UpdateCartRequest.interface';
import {FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cart',
  imports: [
    CurrencyPipe,
    FormsModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent implements OnInit {
  cart: Cart | null = null;
  newQuantity: number = 1;
  error: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private cartService: CartService,
    private authService: AuthenticationService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.error = 'Você precisa estar logado para ver o carrinho';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.newQuantity = cart.quantity;
        this.error = null;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Erro ao carregar o carrinho';
        this.loading = false;
        console.error('Erro ao carregar carrinho:', err);
      }
    });
  }

  incrementQuantity(): void {
    this.newQuantity++;
    this.error = null; // Limpa erro ao alterar quantidade
  }

  decrementQuantity(): void {
    if (this.newQuantity > 1) {
      this.newQuantity--;
      this.error = null; // Limpa erro ao alterar quantidade
    }
  }

  updateQuantity(): void {
    if (this.newQuantity < 1) {
      this.error = 'A quantidade deve ser pelo menos 1';
      this.successMessage = null;
      return;
    }

    if (!this.cart.productId || !this.cart.productName) {
      this.error = 'Carrinho inválido. Tente recarregar a página.';
      this.successMessage = null;
      return;
    }

    this.loading = true;
    const request: UpdateCartRequest = {
      productId: this.cart.productId,
      productName: this.cart.productName,
      quantity: this.newQuantity
    };

    this.cartService.updateQuantity(request).subscribe({
      next: (updatedCart) => {
        this.cart = updatedCart;
        this.newQuantity = updatedCart.quantity;
        this.successMessage = 'Quantidade atualizada com sucesso!';
        this.error = null;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Erro ao atualizar quantidade';
        this.successMessage = null;
        this.loading = false;
        console.error('Erro ao atualizar quantidade:', err);
      }
    });
  }

  removeCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.error = 'Você precisa estar logado para remover o carrinho';
      return;
    }

    if (!this.cart || !this.cart.id) {
      this.error = 'Carrinho não carregado ou inválido';
      this.successMessage = null;
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Tem certeza que deseja remover o carrinho?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.cartService.removeCart(this.cart!.id).subscribe({
          next: () => {
            this.cart = null; // Define o carrinho como null após a remoção
            this.newQuantity = 1;
            this.successMessage = 'Carrinho removido com sucesso!';
            this.error = null;
            this.loading = false;
          },
          error: (err) => {
            this.error = err.message || 'Erro ao remover carrinho';
            this.successMessage = null;
            this.loading = false;
            console.error('Erro ao remover carrinho:', err);
          }
        });
      }
    });
  }
}
//
//   clearCart(): void {
//     this.loading = true;
//     this.cartService.clearCart().subscribe({
//       next: () => {
//         this.cart = null;
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Erro ao limpar o carrinho';
//         this.loading = false;
//         console.error(err);
//       }
//     });
//   }
//
//   removeCart(): void {
//     this.loading = true;
//     this.cartService.removeCart().subscribe({
//       next: () => {
//         this.cart = null;
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Erro ao remover o carrinho';
//         this.loading = false;
//         console.error(err);
//       }
//     });
//   }
//   protected readonly parseInt = parseInt;
// }

