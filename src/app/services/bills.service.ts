import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Bill, BillResponse } from '../types/Bill';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  async createBill(params: any): Promise<BillResponse> {
    console.log('Not implemented yet');
    console.log('🚀 -> BillsService -> createBill -> params', params);

    const url = `${environment.BASE_URL}/conta/cadastrar`;
    const body: Bill = {
      dataVencimento: '2021-10-21',
      idUsuario: 3,
      receberNotificacao: true,
      tipoConta: 'teste pra dar certo',
      valorConta: 10
    };

    try {
      const response = await this.httpClient
        .post<BillResponse>(url, body)
        .toPromise();

      return response;
    } catch (error) {
      console.error('ERROR on createBill: ', error);
      throw error;
    }

  }

}
