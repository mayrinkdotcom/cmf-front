export interface Category{
  nome: string;
  ordem: 'ENTRADA' | 'SAIDA' | '';
}

export class CategoryResponse implements Category{
  nome: string;
  ordem: 'ENTRADA' | 'SAIDA' | '';
  idCategoria: number;
}
