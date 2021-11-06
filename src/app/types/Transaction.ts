export interface Transaction {
  idUsuario: number;
  ordem: 'ENTRADA' | 'SAIDA' | '';
  valor: number;

  idCategoria?: number;

  idProduto?: number;
  productQty?: number;
}

export interface TransactionResponse extends Transaction {
    idMovimentacao: number;
}

export const DEFAULT_TRANSACTION: Transaction = {
  ordem: '',
  idUsuario: 0,
  valor: 0,
};
