export interface Transaction {
  idUsuario: number;
  ordem: 'ENTRADA' | 'SAIDA' | '';
  valor: number;
  tipoMovimentacao: string;

  idCategoria: number;

  idProduto?: number;
  productQty?: number;
}

export interface TransactionResponse extends Transaction {
    idMovimentacao: number;
}

export const DEFAULT_TRANSACTION: Transaction = {
  idUsuario: 0,
  idCategoria: 0,
  ordem: '',
  valor: 0,
  tipoMovimentacao: '',
};
