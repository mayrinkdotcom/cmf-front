import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { TopbarService } from 'src/app/services/topbar.service';
import { DEFAULT_PRODUCT, Product, ProductResponse } from 'src/app/types/Product';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  availableProducts: ProductResponse[] = [
    DEFAULT_PRODUCT,
    DEFAULT_PRODUCT,
    DEFAULT_PRODUCT
  ];

  constructor(
    private productService: ProductService,
    private topbarService: TopbarService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  async ngOnInit() {
    this.refreshAvailableProducts();
    this.topbarService.configBackButton(true, '/home');
  }

  async onClickAddProduct() {

    const alert = await this.alertController.create({
      header: 'Adicionar produto',
      inputs: [
        {
          label: 'Nome',
          placeholder: 'Nome',
          name: 'nome',
          type: 'text',
        },
        {
          label: 'Quant.',
          placeholder: 'Quant.',
          name: 'quantidade',
          type: 'number',
        }
      ],
      buttons: [
        {
          text: 'Adicionar',
          handler: (inputs) => this.saveProduct(inputs),
        }
      ]
    });

    alert.present();
  }

  async saveProduct(newProduct: Product) {
    const l = await this.loadingController.create({
      message: 'Adicionando produto...',
    });
    l.present();

    try {
      const response = await this.productService.createProduct(newProduct);
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Produto criado com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();

      this.refreshAvailableProducts();

    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha na criação do produto, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.log('🚀 -> ProductsPage -> onAddProduct -> error', error);
      throw error;
    }
  }

  editProduct() {
    console.log('Not implemented yet');
  }

  async refreshAvailableProducts() {
    const productsUnordered = await this.productService.getAvailableProducts();
    this.availableProducts = productsUnordered.sort((a, b) => a.nome.localeCompare(b.nome));
  }

}
