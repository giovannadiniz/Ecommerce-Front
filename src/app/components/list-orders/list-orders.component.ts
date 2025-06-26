import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../interfaces/OrderResponse';
import { Router } from '@angular/router';
import { OrderService } from '../../services/OrderService';
import { AuthenticationService } from '../../services/authentication.service';
import {NgClass, CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common';
import { RouterLink } from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-list-orders',
  standalone: true,
  imports: [
    NgClass,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    DecimalPipe,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './list-orders.component.html',
  styleUrl: './list-orders.component.scss'
})
export class ListOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = true;
  error = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';

    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        console.log('Orders received:', orders); // Debug
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar pedidos:', error);
        this.error = 'Erro ao carregar seus pedidos. Tente novamente.';
        this.loading = false;

        // Se não autorizado, redirecionar para login
        if (error.status === 401 || error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'PENDING': 'bg-warning text-dark',
      'PAID': 'bg-success text-white',
      'PROCESSING': 'bg-primary text-white',
      'SHIPPED': 'bg-info text-white',
      'DELIVERED': 'bg-success text-white',
      'CANCELLED': 'bg-danger text-white',
      'EXPIRED': 'bg-secondary text-white',
      'FAILED': 'bg-danger text-white'
    };

    return statusClasses[status?.toUpperCase()] || 'bg-light text-dark';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'PENDING': 'Aguardando Pagamento',
      'PAID': 'Pago',
      'PROCESSING': 'Processando',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregue',
      'CANCELLED': 'Cancelado',
      'EXPIRED': 'Expirado',
      'FAILED': 'Falhou'
    };

    return statusTexts[status?.toUpperCase()] || status;
  }

  isPendingPayment(status: string): boolean {
    return status?.toUpperCase() === 'PENDING';
  }

  isPaid(status: string): boolean {
    const paidStatuses = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    return paidStatuses.includes(status?.toUpperCase());
  }

  isCancelled(status: string): boolean {
    const cancelledStatuses = ['CANCELLED', 'EXPIRED', 'FAILED'];
    return cancelledStatuses.includes(status?.toUpperCase());
  }

  canCancelOrder(status: string): boolean {
    const cancellableStatuses = ['PENDING'];
    return cancellableStatuses.includes(status?.toUpperCase());
  }


  canReorderOrder(status: string): boolean {
    const reorderableStatuses = ['DELIVERED', 'CANCELLED', 'EXPIRED', 'FAILED'];
    return reorderableStatuses.includes(status?.toUpperCase());
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  cancelOrder(orderId: number): void {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
      this.orderService.cancelOrder(orderId).subscribe({
        next: () => {
          // Atualiza a lista após cancelar
          this.loadOrders();
          alert('Pedido cancelado com sucesso!');
        },
        error: (error) => {
          console.error('Erro ao cancelar pedido:', error);
          alert('Erro ao cancelar pedido. Tente novamente.');
        }
      });
    }
  }


  reorder(productId: string | undefined, quantity: number): void {
    if (confirm('Deseja adicionar este produto ao carrinho novamente?')) {
      this.router.navigate(['/products', productId], {
        queryParams: { quantity: quantity }
      });
    }
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Código PIX copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar:', err);
      alert('Erro ao copiar código PIX');
    });
  }

}
