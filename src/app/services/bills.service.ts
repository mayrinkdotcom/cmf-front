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

  async createBill(params: Bill): Promise<BillResponse> {
    const url = `${environment.BASE_URL}/conta/cadastrar`;
    const body: Bill = params;

    try {
      console.log(body);
      const response = await this.httpClient
        .post<BillResponse>(url, body)
        .toPromise();

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async getAllUserBills(userId: number): Promise<BillResponse[]> {
    const url = `${environment.BASE_URL}/conta/buscar-por-usuario/{usuarioId}?usuarioId=${userId}`;

    try {
      const response = await this.httpClient
        .get<BillResponse[]>(url)
        .toPromise();
      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async getAvailableBills(usuarioId: number): Promise<BillResponse[]> {
    const url = `${environment.BASE_URL}/conta/buscar-por-usuario/{usuarioId}`;

    try {
      const response = await this.httpClient
      .get<BillResponse[]>(url, {params: {usuarioId}})
      .toPromise();

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async deleteBill(contaId: number): Promise<BillResponse>{
    console.log(contaId);
    const url = `${environment.BASE_URL}/conta/deletar/{id}?id=${contaId}`;

    try{
      const response = await this.httpClient.delete<BillResponse>(url).toPromise();
      return response;
    } catch(error){
      this.logError(error);
      throw error;
    }
  }

  logError(error: Error) {
    console.error('ERROR on bills-service:', error);
  }
}
