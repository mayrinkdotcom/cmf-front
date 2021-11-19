import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CategoryService } from 'src/app/services/category.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { CategoryResponse, DEFAULT_CATEGORY } from 'src/app/types/Category';
import { Transaction, TransactionResponse } from 'src/app/types/Transaction';

import { ProductService } from '../../../services/product.service';
import { ProductResponse } from '../../../types/Product';

@Component({
  selector: 'app-transaction-data',
  templateUrl: './transaction-data.component.html',
  styleUrls: ['./transaction-data.component.scss'],
})
export class TransactionDataComponent implements OnInit, AfterViewInit {

  @Input() transactionToEdit: TransactionResponse;

  transactionDataForm: FormGroup = new FormGroup({
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

    if (!!this.transactionToEdit) {
      console.log(this.transactionToEdit);
      this.populatetransactionDataForm();
    }
  }

  onSaveTransaction() {
    const newExpense: Transaction = {
      idCategoria: this.selectedCategory.idCategoria,
      ordem: this.selectedCategory.ordem,
      tipoMovimentacao: this.transactionDataForm.get('description').value,
      idUsuario: this.userService.getLoggedUser().idUsuario,
      valor: this.transactionDataForm.get('value').value,
    };

    if (this.transactionDataForm.get('hasLinkedProduct').value) {
      newExpense.idProduto = this.transactionDataForm.get('productId').value;
      newExpense.productQty = this.transactionDataForm.get('productQty').value;
    }
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

      this.closeModal(true);

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

  closeModal(emitRefresh?: boolean) {
    if (emitRefresh) {
      this.modalController.dismiss(this.transactionDataForm.value);
    } else {
      this.modalController.dismiss();
    }
  }

  async refreshAvailableProducts() {
    this.availableProducts = await this.productService.getAvailableProducts();
  }

  async refreshAvailableCategories() {
    this.availableCategories = await this.categoryService.getAvailableCategories();
  }

  async onChangeCategory() {
    this.selectedCategory = this.availableCategories
      .find(category => category.idCategoria === this.transactionDataForm.get('category').value);

    this.transactionDataForm.get('category').setValue(this.selectedCategory.idCategoria);
  }

  populatetransactionDataForm() {
    this.transactionDataForm.get('category').setValue(this.transactionToEdit.idCategoria);
    this.transactionDataForm.get('description').setValue(this.transactionToEdit.tipoMovimentacao);
    this.transactionDataForm.get('value').setValue(this.transactionToEdit.valor);
    if (this.transactionToEdit.idProduto) {
      this.transactionDataForm.get('hasLinkedProduct').setValue(true);
      this.transactionDataForm.get('productId').setValue(this.transactionToEdit.idProduto);
      this.transactionDataForm.get('productQty').setValue(this.transactionToEdit.productQty);
    }
  }
}
