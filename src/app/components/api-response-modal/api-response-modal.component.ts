import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent} from '@angular/material/dialog';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-api-response-modal',
  template: `
    <h2 mat-dialog-title>Resposta Completa da API</h2>
    <mat-dialog-content>
      <div class="response-container">
        <h3>Dados da Requisição</h3>
        <pre>{{ data.request | json }}</pre>

        <h3>Resposta da API</h3>
        <pre>{{ data.response | json }}</pre>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Fechar</button>
      <button mat-button color="primary" (click)="copyToClipboard()">Copiar JSON</button>
    </mat-dialog-actions>
  `,
  imports: [
    JsonPipe,
    MatDialogContent,
    MatDialogActions
  ],
  styles: [`
    .response-container {
      font-family: monospace;

      pre {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 4px;
        overflow-x: auto;
      }
    }
  `]
})
export class ApiResponseModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  copyToClipboard() {
    const jsonStr = JSON.stringify(this.data.response, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      // Você pode adicionar um snackbar aqui se quiser
    });
  }
}
