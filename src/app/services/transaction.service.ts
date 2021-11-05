import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Transaction, TransactionResponse } from '../types/Transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private http: HttpClient,
  ) { }

  async createTransaction(transaction: Transaction): Promise<TransactionResponse> {
    console.log('🚀 -> TransactionService -> createTransaction -> params', transaction);
    const url = `${environment.BASE_URL}/movimentacao/cadastrar`;
    const body = {
      idProduto: transaction.idProduto ? transaction.idProduto : 0,
      idUsuario: transaction.idUsuario,
      ordem: transaction.ordem,
      tipoMovimentacao: transaction.type,
      valor: transaction.valor
    };

    try {
      const response = await this.http
      .post<TransactionResponse>(url, body)
      .toPromise();
      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async updateTransaction(editedTransaction: TransactionResponse) {
    console.log('not implemented yet', editedTransaction);
  }

  async deleteTransaction(transactionId: number) {
    console.log('not implemented yet', transactionId);
  }

  async getTransactionsToShow() {
    console.log('not implemented yet');
    return [];
  }

  logError(error: Error) {
    console.error('ERROR on transaction-service:', error);
  }
}
