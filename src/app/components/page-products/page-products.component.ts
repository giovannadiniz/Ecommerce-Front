import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { ListProductsService } from '../../services/list-products.service';
import { Product } from '../../../domain/product';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-products',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ], 
  providers: [ListProductsService], 
  templateUrl: './page-products.component.html',
  styleUrls: ['./page-products.component.scss']
})
export class PageProductsComponent {
    products!: Product[];

  constructor(private productService: ListProductsService) {}

  ngOnInit(){
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
}
