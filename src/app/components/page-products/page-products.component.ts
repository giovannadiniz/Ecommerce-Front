import {CommonModule} from '@angular/common';
import {Component, ViewChild} from '@angular/core';
import {ListProductsService} from '../../services/list-products.service';
import {Product} from '../../../domain/product';
import {MatIconModule} from '@angular/material/icon';
import {AuthenticationService} from '../../services/authentication.service';
import {CartService} from '../../services/cart.service';
import {Router} from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {CartComponent} from '../cart/cart.component';

@Component({
  selector: 'app-page-products',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    CartComponent,
  ],
  providers: [ListProductsService],
  templateUrl: './page-products.component.html',
  styleUrls: ['./page-products.component.scss']
})
export class PageProductsComponent {
  @ViewChild('cartModal') cartModal!: CartComponent;
  products!: Product[];
  quantities: { [key: number]: number } = {};

  constructor(private productService: ListProductsService, private authService: AuthenticationService, private cartService: CartService, private router: Router, private snackBar: MatSnackBar) {
    // Injeção de dependências para serviços necessários
  }

  ngOnInit() {
    this.getAllProducts();
    // Inicializa as quantidades
    this.productService.getAllProducts().subscribe(products => {
      products.forEach(product => {
        if (typeof product.id === 'number') {
          this.quantities[product.id] = 1;
        }
      });
    });
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

  ngAfterViewInit() {
    // ViewChild estará disponível aqui
    console.log('CartModal ViewChild:', this.cartModal);
  }

  addToCart(productId: number, productName: string | undefined): void {
    this.cartService.addToCart(productId, productName).subscribe({
      next: (cart) => {
        this.snackBar.open('Produto adicionado ao carrinho!', 'Fechar', { duration: 2000 });

        // Abre o modal do carrinho após adicionar o produto
        this.cartModal.openModal();
      },
      error: (err) => {
        console.error('Erro ao adicionar ao carrinho:', err);
        this.snackBar.open(err.message || 'Erro ao adicionar ao carrinho', 'Fechar', { duration: 3000 });
      }
    });
  }



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
