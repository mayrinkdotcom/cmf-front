export interface Notification {
    dataLembrete: string;
    idConta: number;
    idUsuario: number;
}

export interface NotificationResponse extends Notification {
    idNotificacao: number;
}
