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
    const url = `${environment.BASE_URL}/movimentacao/cadastrar`;
    const body: Transaction = {
      idUsuario: transaction.idUsuario,
      idCategoria: transaction.idCategoria,
      tipoMovimentacao: transaction.tipoMovimentacao,
      ordem: transaction.ordem,
      valor: transaction.valor,
      idProduto: transaction.idProduto,
      productQty: transaction.productQty,
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
    const url = `${environment.BASE_URL}/movimentacao/deletar/{id}`;

    try {
      const response = await this.http
      .delete<null>(url, {params: {id: transactionId}})
      .toPromise();

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async getTransactionsByDate(initDate: string, finalDate?: string) {
    const url = `${environment.BASE_URL}/movimentacao/buscar-movimentacao-por-data/{dataInicial}/{dataFinal}`;

    if (!finalDate) {
      finalDate = new Date().toISOString().slice(0, 10);
    }
    try {
      const response = await this.http
      .get<TransactionResponse[]>(url, {params: { dataInicial: initDate, dataFinal: finalDate}})
      .toPromise();

      return response ? response : [];
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  logError(error: Error) {
    console.error('ERROR on transaction-service:', error);
  }
}
