import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NotificationResponse } from '../types/Notification';

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

  logError(error: Error) {
    console.error('ERROR on notification-service:', error);
  }
}
