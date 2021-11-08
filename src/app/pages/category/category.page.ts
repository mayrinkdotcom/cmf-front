import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { TopbarService } from 'src/app/services/topbar.service';
import { CategoryResponse, Category } from 'src/app/types/Category';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit, AfterViewInit {

  categories: CategoryResponse[] = [];

  constructor(
    private categoryService: CategoryService,
    private topbarService: TopbarService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.topbarService.configBackButton(true, '/home');
    console.log(this.categories);
  }

  ngAfterViewInit() {
    this.refreshAvailableCategories();
  }

  async onClickAddCategory() {
    const m = await this.modalController.create({
      component: CreateCategoryComponent,
      backdropDismiss: true,
    });
    m.present();
    this.refreshAvailableCategories();
  }

  async onEditCategory(category: CategoryResponse) {
      const m = await this.modalController.create({
        component: EditCategoryComponent,
        componentProps: {idCategoria: category.idCategoria},
        backdropDismiss: true,
      });
      m.present();
      this.refreshAvailableCategories();
  }

   async onDeleteCategory(item: CategoryResponse) {
    const alert = await this.toastController.create({
      header: 'Atenção!',
      message: 'Deseja realmente excluir ' + item.nome + '? Essa ação não pode ser desfeita!',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => alert.dismiss(),
        },
        {
          text: 'Confirmar',
          handler: () => this.deleteCategory(item.idCategoria),
        }
      ]
    });
    alert.present();
  }

  async deleteCategory(categoryId: number) {
    const l = await this.loadingController.create({
      message: 'Excluindo categoria...',
    });

    l.present();
    try {
      const res = await this.categoryService.deleteCategory(categoryId);
      l.dismiss();
      this.refreshAvailableCategories();
      const t = await this.toastController.create({
        message: 'Categoria excluída com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();
    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha ao deletar a Categoria, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.log('🚀 -> CategoryPage -> onDeleteCategory -> error', error);
      throw error;
    }
  }

  async refreshAvailableCategories() {
    const categoriesUnordered = await this.categoryService.getAvailableCategories();
    this.categories = categoriesUnordered.sort((a, b) => a.nome.localeCompare(b.nome));
  }

}
