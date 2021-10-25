import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  async createBill(params: any): Promise<any> {
    console.log('Not implemented yet');
    console.log('🚀 -> BillsService -> createBill -> params', params);

    const url = `${environment.BASE_URL}/conta/cadastrar`;
    const body = {
      dataVencimento: params.vencimento,
      idUsuario: 3,
      receberNotificacao: true,
      tipoConta: params.descricao,
      valorConta: params.valor
    };

    try {
      console.log(body);
      const response = await this.httpClient
        .post<any>(url, body)
        .toPromise();

      return response;
    } catch (error) {
      console.error('ERROR on createBill: ', error);
      throw error;
    }

  }

}
