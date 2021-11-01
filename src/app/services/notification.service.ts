import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Notification, NotificationResponse } from '../types/Notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  async getAllUserNotifications(userId: number): Promise<NotificationResponse[]> {
    const url = `${environment.BASE_URL}/notificacao/buscar-por-usuario/{usuarioId}?usuarioId=${userId}`;

    try {
      const response = await this.httpClient
      .get<NotificationResponse[]>(url)
      .toPromise();
    return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  async createNotification(newNotification: Notification) {
    const url = `${environment.BASE_URL}/notificacao/cadastrar`;
    const body: Notification = newNotification;
    try {
      const response = await this.httpClient
        .post<NotificationResponse>(url, body)
        .toPromise();
      return response;
    } catch (error) {
      this.logError(error);
      throw error;
    }
  }

  logError(error: Error) {
    console.error('ERROR on notification-service:', error);
  }
}
