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

export const DEFAULT_BILL: Bill = {
    dataVencimento:  '',
    idUsuario: 0,
    receberNotificacao: false,
    tipoConta: '',
    valorConta: 0
};
