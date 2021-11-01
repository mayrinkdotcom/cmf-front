export interface Notification {
    dataLembrete: Date;
    idConta: number;
    idUsuario: number;
}

export interface NotificationResponse extends Notification {
    idNotificacao: number;
}
