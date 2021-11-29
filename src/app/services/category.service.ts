import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Category, CategoryResponse } from '../types/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
  ) { }

  async getAvailableCategories(): Promise<CategoryResponse[]> {
    const url = `${environment.BASE_URL}/categoria/buscar-todas`;

    try {
      const response = await this.http
      .get<CategoryResponse[]>(url)
      .toPromise();

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async createCategory(newCategory: Category): Promise<CategoryResponse> {
    const url = `${environment.BASE_URL}/categoria/cadastrar`;

    const body: Category = newCategory;

    try {
      const response = await this.http
      .post<CategoryResponse>(url, body)
      .toPromise();

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async updateCategory(editedCategory: Category) {
    const url = `${environment.BASE_URL}/categoria/atualizar`;

    const body: Category = editedCategory;
    console.log(body);

    try {
      const response = await this.http
      .put<CategoryResponse>(url, body)
      .toPromise();

      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async deleteCategory(categoryId: number) {
    const url = `${environment.BASE_URL}/categoria/deletar/{id}?id=${categoryId}`;

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
    console.error('ERROR on category-service:', error);
  }
}
