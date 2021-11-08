/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { Category, CategoryResponse } from 'src/app/types/Category';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {

  @Input() idCategoria;
  categories: CategoryResponse[] = [];

  constructor(
    private loadingController: LoadingController,
    private categoryService: CategoryService,
    private toastController: ToastController,
    private modalController: ModalController,
  ) { }

  ngOnInit() { }

  nomeCategoria: string;
  ordemCategoria: 'ENTRADA' | 'SAIDA';

  async editCategory() {
    const l = await this.loadingController.create({
      message: 'Atualizando categoria...',
    });
    l.present();

    try {
      const newCategory: CategoryResponse = {
        idCategoria: this.idCategoria,
        nome: this.nomeCategoria,
        ordem: this.ordemCategoria
      };
      const response = await this.categoryService.updateCategory(newCategory);
      l.dismiss();
      this.refreshAvailableCategories();
      const t = await this.toastController.create({
        message: 'Categoria criada com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();
      this.closeModal();

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

  setOrderValue($event) {
    this.ordemCategoria = $event.target.value;
    console.log(this.ordemCategoria);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}

