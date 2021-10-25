export interface Bill {
    dataVencimento: string;
    idUsuario: number;
    receberNotificacao: boolean;
    tipoConta: string;
    valorConta: number;
};

export interface BillResponse extends Bill {
    idConta: number;
}
