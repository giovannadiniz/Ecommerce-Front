import {Component, Input, OnInit} from '@angular/core';
import {CheckoutRequest, CheckoutResponse, CheckoutService} from '../../services/checkout.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {ApiResponseModalComponent} from '../api-response-modal/api-response-modal.component';

@Component({
  selector: 'app-checkout',
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  @Input() checkoutData!: CheckoutResponse;
  loading: boolean = false;
  error: string | null = null;
  apiResponse: any;

  constructor(
    private checkoutService: CheckoutService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog // Injete o MatDialog
  ) {}

  ngOnInit() {
    if (!this.checkoutData) {
      this.error = 'Dados de checkout não fornecidos';
    } else {
      this.apiResponse = this.checkoutData; // Ou obtenha a resposta completa de onde você precisa
    }
  }

  processarPedido(dadosCheckout: CheckoutRequest) {
    this.loading = true;
    this.error = null;

    this.checkoutService.processarCheckout(dadosCheckout).subscribe({
      next: (response: CheckoutResponse) => {
        console.log('=== RESPONSE DO CHECKOUT ===');
        console.log('Response completo:', response);
        console.log('ID:', response.id);
        console.log('Status:', response.status);
        console.log('Total:', response.total);
        console.log('QR Code:', response.qrCode);
        console.log('============================');

        // Armazena o response para usar no template
        this.checkoutData = response;
        this.loading = false;

        // Opcional: Redirecionar para página de pagamento
        // this.router.navigate(['/checkout', response.id]);
      },
      error: (error) => {
        console.error('Erro ao processar checkout:', error);

        // Tratamento específico para erro de autenticação
        if (error.message === 'FORBIDDEN') {
          this.error = 'Sessão expirada. Faça login novamente.';
        } else {
          this.error = 'Erro ao processar pedido. Tente novamente.';
        }

        this.loading = false;
      }
    });
  }

  copiarPixCode() {
    if (this.checkoutData?.qrCode) {
      navigator.clipboard.writeText(this.checkoutData.qrCode).then(() => {
        this.snackBar.open('PIX copiado!', 'Fechar', { duration: 2000 });
      }).catch(err => {
        console.error('Erro ao copiar PIX:', err);
        this.snackBar.open('Erro ao copiar PIX', 'Fechar', { duration: 3000 });
      });
    }
  }

  consultarStatus() {
    if (this.checkoutData?.id) {
      this.loading = true;
      this.checkoutService.consultarPedido(this.checkoutData.id).subscribe({
        next: (response) => {
          this.checkoutData = response;
          this.loading = false;
          if (response.status === 'PAGO') {
            this.snackBar.open('Pagamento confirmado!', 'Fechar', { duration: 3000 });
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao consultar status:', error);
          this.snackBar.open('Erro ao verificar pagamento', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
  //
  // loadCheckoutData(id: string) {
  //   this.loading = true;
  //   this.error = null;
  //
  //   console.log('Carregando dados do checkout para ID:', id);
  //
  //   this.checkoutService.getCheckoutById(id).subscribe({
  //     next: (data: CheckoutResponse) => {
  //       console.log('Dados recebidos do servidor:', data);
  //       this.checkoutData = data;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error('Erro ao carregar checkout:', err);
  //       this.error = 'Erro ao carregar os dados do pedido';
  //       this.loading = false;
  //     }
  //   });
  // }

  // consultarStatus() {
  //   if (this.checkoutData && this.route.snapshot.paramMap.get('id')) {
  //     const checkoutId = this.route.snapshot.paramMap.get('id')!;
  //     this.loadCheckoutData(checkoutId);
  //   }
  // }

  // Método para gerar QR Code usando uma biblioteca online (opcional)
  generateQRCodeImage(): string {
    if (this.checkoutData?.qrCode) {
      // Usando QR Server (serviço gratuito) - você pode trocar por outro serviço
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(this.checkoutData.qrCode)}`;
    }
    return '';
  }
}
