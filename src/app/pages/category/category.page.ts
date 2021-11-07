import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { TopbarService } from 'src/app/services/topbar.service';
import { CategoryResponse, Category } from 'src/app/types/Category';
import { CreateCategoryComponent } from './create-category/create-category.component';

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
  }

  async editCategories() {
      const m = await this.modalController.create({
        component: CreateCategoryComponent,
        componentProps: {},
        backdropDismiss: true,
      });
      m.present();
  }

  async refreshAvailableCategories() {
    const categoriesUnordered = await this.categoryService.getAvailableCategories();
    this.categories = categoriesUnordered.sort((a, b) => a.nome.localeCompare(b.nome));
  }

}
