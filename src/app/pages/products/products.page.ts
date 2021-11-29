import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { TopbarService } from 'src/app/services/topbar.service';
import { Product, ProductResponse } from 'src/app/types/Product';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, AfterViewInit {

  availableProducts: ProductResponse[] = [];

  constructor(
    private productService: ProductService,
    private topbarService: TopbarService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.topbarService.configBackButton(true, '/home');
  }

  ngAfterViewInit() {
    this.refreshAvailableProducts();
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
          text: 'Cancelar',
          handler: () => alert.dismiss(),
        },
        {
          text: 'Adicionar',
          handler: (inputs) => this.saveProduct(inputs),
        },
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

  async onEditProduct(item: ProductResponse) {
    const alert = await this.alertController.create({
      header: 'Editar produto',
      inputs: [
        {
          label: 'Nome',
          placeholder: 'Nome',
          name: 'nome',
          type: 'text',
          value: item.nome,
        },
        {
          label: 'Quant.',
          placeholder: 'Quant.',
          name: 'quantidade',
          type: 'number',
          value: item.quantidade,
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => alert.dismiss(),
        },
        {
          text: 'Salvar',
          handler: async (inputs) => {
            const editedProduct: ProductResponse = {
              idProduto: item.idProduto,
              nome: inputs.nome,
              quantidade: inputs.quantidade,
            };
            this.editProduct(editedProduct);
          },
        },
      ]
    });

    alert.present();
  }

  async editProduct(editedProduct: ProductResponse) {
    const l = await this.loadingController.create({
      message: 'Atualizando produto...',
    });
    l.present();
    try {
      const res = await this.productService.updateProduct(editedProduct);
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Produto atualizado com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();

      this.refreshAvailableProducts();
    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha na edição do produto, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.log('🚀 -> ProductsPage -> onEditProduct -> error', error);
      throw error;
    }
  }

  async onDeleteProduct(item: ProductResponse) {
    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: 'Deseja realmente excluir ' + item.nome + '? Essa ação não pode ser desfeita!',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => alert.dismiss(),
        },
        {
          text: 'Confirmar',
          handler: () => this.deleteProduct(item.idProduto),
        }
      ]
    });
    alert.present();
  }

  async deleteProduct(productId: number) {
    const l = await this.loadingController.create({
      message: 'Excluindo produto...',
    });

    l.present();
    try {
      const res = await this.productService.deleteProduct(productId);
      l.dismiss();
      this.refreshAvailableProducts();
      const t = await this.toastController.create({
        message: 'Produto excluído com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();
    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha na edição do produto, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.log('🚀 -> ProductsPage -> onDeleteProduct -> error', error);
      throw error;
    }
  }

  async refreshAvailableProducts() {
    const productsUnordered = await this.productService.getAvailableProducts();
    this.availableProducts = productsUnordered.sort((a, b) => a.nome.localeCompare(b.nome));
  }

}
