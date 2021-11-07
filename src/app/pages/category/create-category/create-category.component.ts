import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/types/Category';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  loadingController: any;
  categoryService: any;
  toastController: any;

  constructor() { }

  ngOnInit() {}
  async saveCategory(newCategory: Category) {
    const l = await this.loadingController.create({
      message: 'Adicionando categoria...',
    });
    l.present();

    try {
      console.log(newCategory);
      const response = await this.categoryService.createCategory(newCategory);
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Categoria criada com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();

      this.refreshAvailableCategories();

    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha na criação da categoria, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.log('🚀 -> CategoryPage -> onAddCategory -> error', error);
      throw error;
    }
  }
  refreshAvailableCategories() {
    throw new Error('Method not implemented.');
  }
}
