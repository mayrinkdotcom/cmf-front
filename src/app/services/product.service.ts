import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Product, ProductResponse } from '../types/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
  ) { }

  async getAvailableProducts(): Promise<ProductResponse[]> {
    const url = `${environment.BASE_URL}/produto/buscar-todos`;

    try {
      const response = await this.http
      .get<ProductResponse[]>(url)
      .toPromise();

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async createProduct(newProduct: Product): Promise<ProductResponse> {
    const url = `${environment.BASE_URL}/produto/cadastrar`;

    const body: Product = newProduct;

    try {
      const response = await this.http
      .post<ProductResponse>(url, body)
      .toPromise();

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async updateProduct(editedProduct: Product) {
    const url = `${environment.BASE_URL}/produto/atualizar`;

    const body: Product = editedProduct;

    try {
      const response = await this.http
      .put<ProductResponse>(url, body)
      .toPromise();

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async deleteProduct(productId: number) {
    const url = `${environment.BASE_URL}/produto/deletar/{id}?id=${productId}`;

    try {
      const response = await this.http
      .delete<null>(url)
      .toPromise();

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  logError(error: Error) {
    console.error('ERROR on product-service:', error);
  }
}
