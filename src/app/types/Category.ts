export interface Category{
  nome: string;
  ordem: 'ENTRADA' | 'SAIDA' | '';
}

export interface CategoryResponse extends Category{
  idCategoria: number;
}

export const DEFAULT_CATEGORY: CategoryResponse = {
  nome: 'Categoria',
  ordem: '',
  idCategoria: 0
};
