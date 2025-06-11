import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {ListProductsService} from '../../services/list-products.service';
import {Product} from '../../../domain/product';
import {MatIconModule} from '@angular/material/icon';
import {AuthenticationService} from '../../services/authentication.service';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {Observable} from 'rxjs';
import {Cart} from '../../interfaces/Cart';

@Component({
  selector: 'app-page-products',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  providers: [ListProductsService],
  templateUrl: './page-products.component.html',
  styleUrls: ['./page-products.component.scss']
})
export class PageProductsComponent {
  products!: Product[];
  quantities: { [key: number]: number } = {};

  constructor(private productService: ListProductsService, private authService: AuthenticationService, private cartService: CartService, private router: Router, private snackBar: MatSnackBar) {
    // Injeção de dependências para serviços necessários
  }

  ngOnInit() {
    this.getAllProducts();
  }

  private getAllProducts(): void {
    this.productService.getAllProducts().subscribe(
      (response) => {
        this.products = response;
        console.log(this.products);
      },
      (error) => {
        console.error('Erro ao buscar os dados:', error);
      }
    );
  }

  addToCart(productId: number, productName: string | undefined): void {
    this.cartService.addToCart(productId, productName).subscribe({
      next: (cart) => {
        alert('Produto adicionado ao carrinho');

        this.router.navigate(['/cart']);
      },
      error: (err) => {
        if (err.message !== 'Usuário não autenticado') {
          alert('Erro ao adicionar ao carrinho, usuário precisa estar autenticado.');
          // Tratamento de erro
        }
      }
    });


    // const quantity = this.quantities[product.id] || 1;
    //
    // if (quantity < 1 || quantity > product.quantityP) {
    //   this.snackBar.open('Quantidade inválida', 'Fechar', {
    //     duration: 3000
    //   });
    //   return;
    // }

    // this.cartService.addToCart(product.id, quantity).subscribe({
    //   next: () => {
    //     this.snackBar.open('Produto adicionado ao carrinho!', 'Fechar', {
    //       duration: 2000
    //     });
    //   },
    //   error: (err) => {
    //     console.error('Erro ao adicionar ao carrinho:', err);
    //     this.snackBar.open('Erro ao adicionar ao carrinho', 'Fechar', {
    //       duration: 3000
    //     });
    //   }
    // });
  }

  increaseQuantity(productId: number, stock: number): void {
    if (this.quantities[productId] < stock) {
      this.quantities[productId]++;
    }
  }

  decreaseQuantity(productId: number): void {
    if (this.quantities[productId] > 1) {
      this.quantities[productId]--;
    }
  }

  protected readonly parseInt = parseInt;
}
