export interface Product {
    nome: string;
    quantidade: number;
}

export interface ProductResponse extends Product {
    idProduto: number;
}

export const DEFAULT_PRODUCT: ProductResponse = {
    nome: 'Produto',
    quantidade: 0,
    idProduto: 0,
};
