import { CategoryService } from 'src/app/services/category.service';
import { CategoryResponse, DEFAULT_CATEGORY } from 'src/app/types/Category';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { Transaction } from 'src/app/types/Transaction';

import { ProductService } from './../../../services/product.service';
import { ProductResponse } from './../../../types/Product';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit, AfterViewInit {

  addTransactionForm: FormGroup = new FormGroup({
    category: new FormControl(null, [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.required,
    ]),
    value: new FormControl(null, [
      Validators.required,
    ]),
    hasLinkedProduct: new FormControl(null),
    productId: new FormControl(null),
    productQty: new FormControl(null),
  });

  availableProducts: ProductResponse[];
  availableCategories: CategoryResponse[];

  selectedCategory: CategoryResponse = DEFAULT_CATEGORY;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private userService: UserService,
    private transactionService: TransactionService,
    private productService: ProductService,
    private categoryService: CategoryService,
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.refreshAvailableProducts();
    this.refreshAvailableCategories();
  }

  onSaveTransaction() {
    const newExpense: Transaction = {
      idCategoria: this.selectedCategory.idCategoria,
      ordem: this.selectedCategory.ordem,
      tipoMovimentacao: this.addTransactionForm.get('description').value,
      idUsuario: this.userService.getLoggedUser().idUsuario,
      valor: this.addTransactionForm.get('value').value,
    };

    if (this.addTransactionForm.get('hasLinkedProduct').value) {
      newExpense.idProduto = this.addTransactionForm.get('productId').value;
      newExpense.productQty = this.addTransactionForm.get('productQty').value;
    }
    console.log('🚀 -> AddTransactionComponent -> onSaveTransaction -> newExpense', newExpense);
    this.saveTransaction(newExpense);
  }

  async saveTransaction(newExpense: Transaction) {
    const l = await this.loadingController.create({
      message: 'Adicionando movimentação...',
    });
    l.present();

    try {
      const response = await this.transactionService.createTransaction(newExpense);
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Movimentação criada com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();

      this.closeModal();

    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha na criação da movimentação, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.error('ERROR on saveTransaction', error);
      throw error;
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async refreshAvailableProducts() {
    this.availableProducts = await this.productService.getAvailableProducts();
  }

  async refreshAvailableCategories() {
    this.availableCategories = await this.categoryService.getAvailableCategories();
  }

  async onChangeCategory() {
    this.selectedCategory = this.availableCategories
      .find(category => category.idCategoria === this.addTransactionForm.get('category').value);

    this.addTransactionForm.get('category').setValue(this.selectedCategory.idCategoria);
  }
}
