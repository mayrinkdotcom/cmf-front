/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { Category, CategoryResponse } from 'src/app/types/Category';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {

  categories: CategoryResponse[] = [];

  constructor(
    private loadingController: LoadingController,
    private categoryService: CategoryService,
    private toastController: ToastController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  nomeCategoria: string;
  ordemCategoria: 'ENTRADA' | 'SAIDA';
  async saveCategory() {
    const l = await this.loadingController.create({
      message: 'Adicionando categoria...',
    });
    l.present();

    try {
      const newCategory: Category = {
        nome: this.nomeCategoria,
        ordem: this.ordemCategoria
      };
      console.log(newCategory);
      const response = await this.categoryService.createCategory(newCategory);
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Categoria criada com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();
      this.closeModal();
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
  async refreshAvailableCategories() {
    const categoriesUnordered = await this.categoryService.getAvailableCategories();
    this.categories = categoriesUnordered.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  setOrderValue($event){
    this.ordemCategoria = $event.target.value;
    console.log(this.ordemCategoria);
  }

  closeModal(){
    this.modalController.dismiss();
  }
}
