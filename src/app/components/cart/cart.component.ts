import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Cart} from '../../interfaces/Cart';
import {CartService} from '../../services/cart.service';
import {AuthenticationService} from '../../services/authentication.service';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';
import {UpdateCartRequest} from '../../interfaces/UpdateCartRequest.interface';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {CheckoutRequest, CheckoutResponse, CheckoutService} from '../../services/checkout.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CheckoutComponent} from '../checkout/checkout.component';
import {ApiResponseModalComponent} from '../api-response-modal/api-response-modal.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CurrencyPipe,
    FormsModule,
    NgOptimizedImage,
    MatDialogModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})

export class CartComponent implements OnInit {
  @ViewChild('checkoutModal') checkoutModal!: CheckoutComponent;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  cart: Cart | null = null;
  newQuantity: number = 1;
  error: string | null = null;
  successMessage: string | null = null;
  loading: boolean = false;
  apiResponse: any;

  constructor(
    private cartService: CartService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private router: Router,
    private checkoutService: CheckoutService,
    private snackBar: MatSnackBar
  ) {
  }
  openModal(): void {
    this.isOpen = true;
    this.loadCart();
  }

  showApiResponseModal() {
    this.dialog.open(ApiResponseModalComponent, {
      width: '80%',
      maxWidth: '800px',
      data: {
        response: this.apiResponse,
      },
      panelClass: 'api-response-modal'
    });
  }

  closeModal(): void {
    this.isOpen = false;
    this.closed.emit();
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
    if (!this.cart) {
      this.error = 'Carrinho não carregado. Tente recarregar a página.';
      this.successMessage = null;
      return;
    }

    if (this.newQuantity < 1) {
      this.error = 'A quantidade deve ser pelo menos 1';
      this.successMessage = null;
      return;
    }

    // Verificação adicional para propriedades obrigatórias
    if (typeof this.cart.productId !== 'number') {
      this.error = 'ID do produto inválido';
      return;
    }

    // Usar productName do cart ou do product
    const productName = this.cart.productName || this.cart.product?.name;
    if (!productName) {
      this.error = 'Nome do produto não disponível';
      return;
    }

    this.loading = true;

    const request: UpdateCartRequest = {
      productId: this.cart.productId,
      productName: productName,
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

  finalizarCompra(): void {
    if (!this.cart) {
      this.snackBar.open('Carrinho não carregado', 'Fechar', { duration: 3000 });
      return;
    }

    // Validação dos campos obrigatórios
    if (!this.cart.id || !this.cart.productId || !this.cart.userId) {
      this.snackBar.open('Dados incompletos para finalizar compra', 'Fechar', { duration: 3000 });
      return;
    }

    // Verifica se o total está calculado
    if (this.cart.total === undefined || this.cart.total === null) {
      this.snackBar.open('Total do carrinho não calculado', 'Fechar', { duration: 3000 });
      return;
    }

    this.loading = true;

    // Preparação dos dados com tipos corretos
    const checkoutData: CheckoutRequest = {
      cartId: this.cart.id,
      productId: this.cart.productId,
      total: this.formatTotal(this.cart.total), // Conversão para string formatada
      quantity: this.cart.quantity,
      userId: this.cart.userId
    };

    this.checkoutService.processarCheckout(checkoutData).subscribe({
      next: (response) => {
        this.loading = false;
        this.handleCheckoutSuccess(response);
      },
      error: (err) => {
        this.loading = false;
        this.handleCheckoutError(err);
      }
    });
  }

// Método auxiliar para formatar o total como string
  private formatTotal(total: number): string {
    // Formata para 2 casas decimais e converte para string
    return total.toFixed(2);
  }

  private handleCheckoutSuccess(response: CheckoutResponse): void {
    this.snackBar.open('Pedido criado com sucesso!', 'Fechar', { duration: 2000 });
    this.openCheckoutModal(response);
    this.cart = null; // Limpa o carrinho após sucesso
  }

  private handleCheckoutError(err: any): void {
    console.error('Erro ao finalizar compra:', err);
    const errorMessage = err.error?.message || err.message || 'Erro ao finalizar compra';
    this.snackBar.open(errorMessage, 'Fechar', { duration: 3000 });
  }

  private openCheckoutModal(checkoutResponse: CheckoutResponse): void {
    const dialogRef = this.dialog.open(CheckoutComponent, {
      width: '600px',
    });

    dialogRef.componentInstance.checkoutData = checkoutResponse;


    dialogRef.afterClosed().subscribe(() => {
      // Ações após fechar o modal, se necessário
    });
  }
//  Está comentado para inserir modal customizado futuramente
  // removeCart(): void {
  //   if (!this.authService.isAuthenticated()) {
  //     this.error = 'Você precisa estar logado para remover o carrinho';
  //     return;
  //   }
  //
  //   if (!this.cart?.id) {
  //     this.error = 'Carrinho não carregado ou ID inválido';
  //     return;
  //   }
  //
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //     data: {
  //       title: 'Confirmar Remoção',
  //       message: 'Tem certeza que deseja remover este item do carrinho?',
  //       confirmText: 'Remover',
  //       cancelText: 'Cancelar'
  //     }
  //   });
  //
  //   dialogRef.afterClosed().subscribe(confirmed => {
  //     if (confirmed) {
  //       this.loading = true;
  //       this.error = null;
  //       this.successMessage = null;
  //
  //       this.cartService.removeCart(this.cart!.id!).subscribe({
  //         next: () => {
  //           this.cart = null;
  //           this.newQuantity = 1;
  //           this.successMessage = 'Carrinho removido com sucesso!';
  //           this.loading = false;
  //           this.closeModal();
  //         },
  //         error: (err) => {
  //           this.error = err.message || 'Erro ao remover carrinho';
  //           this.loading = false;
  //           console.error('Erro detalhado:', err);
  //         }
  //       });
  //     }
  //   });
  // }

  removeCartWithoutDialog(): void {
    if (!this.authService.isAuthenticated()) {
      this.error = 'Você precisa estar logado para remover o carrinho';
      return;
    }

    if (!this.cart) {
      this.error = 'Carrinho não carregado';
      return;
    }

    // Confirmação simples com confirm()
    const confirmRemoval = confirm('Tem certeza que deseja remover este item do carrinho?');

    if (confirmRemoval) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      const cartId = this.cart.id || this.cart.productId;

      this.cartService.removeCart(cartId).subscribe({
        next: () => {
          this.cart = null;
          this.newQuantity = 1;
          this.successMessage = 'Carrinho removido com sucesso!';
          this.loading = false;

          setTimeout(() => {
            this.closeModal();
          }, 1500);
        },
        error: (err) => {
          this.error = err.error?.message || err.message || 'Erro ao remover carrinho';
          this.loading = false;
          console.error('Erro ao remover carrinho:', err);
        }
      });
    }
  }

  // finalizarCompra() {
  //   // Navegar para página de checkout passando dados via query params
  //   this.router.navigate(['/checkout', this.cartId, this.productId, this.total]);
  // }
  protected readonly parseInt = parseInt;
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

