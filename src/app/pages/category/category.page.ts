import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { TopbarService } from 'src/app/services/topbar.service';
import { CategoryResponse, Category } from 'src/app/types/Category';

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
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.topbarService.configBackButton(true, '/home');
  }

  ngAfterViewInit() {
    this.refreshAvailableCategories();
  }

  async onClickAddCategory() {

    const alert = await this.alertController.create({
      header: 'Adicionar categoria',
      inputs: [
         {
           label: 'Nome',
           placeholder: 'Nome',
           name: 'nome',
           type: 'text',
         },
         {
          name: 'Ordem',
          type: 'radio',
          label: 'ENTRADA',
          value: 'ENTRADA',
          checked: false
        },
        {
          name: 'Ordem',
          type: 'radio',
          label: 'SAIDA',
          value: 'SAIDA',
          checked: false
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => alert.dismiss(),
        },
        {
          text: 'Adicionar',
          handler: (inputs) => this.saveCategory(inputs),
        },
      ]
    });

    alert.present();
  }

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

  editCategories() {
    console.log('Not implemented yet');
  }

  async refreshAvailableCategories() {
    const categoriesUnordered = await this.categoryService.getAvailableCategories();
    this.categories = categoriesUnordered.sort((a, b) => a.nome.localeCompare(b.nome));
  }

}
