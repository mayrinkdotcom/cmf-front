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
    category: new FormControl(false, [
      Validators.required,
    ]),
    order: new FormControl(false, [
      Validators.required,
    ]),
    value: new FormControl(false, [
      Validators.required,
    ]),
    hasLinkedProduct: new FormControl(false),
    productId: new FormControl(false),
    productQty: new FormControl(false),
  });

  availableProducts: ProductResponse[];

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private userService: UserService,
    private transactionService: TransactionService,
    private productService: ProductService,
  ) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.refreshAvailableProducts();
  }

  onSaveTransaction() {
    const newExpense: Transaction = {
      ordem: this.addTransactionForm.get('order').value,
      idUsuario: this.userService.getLoggedUser().idUsuario,
      valor: this.addTransactionForm.get('value').value,
    };

    if (this.addTransactionForm.get('hasLinkedProduct')) {
      newExpense.idProduto = this.addTransactionForm.get('productId').value;
      newExpense.productQty = this.addTransactionForm.get('productQty').value;
    }
    console.log('🚀 -> AddTransactionComponent -> onSaveTransaction -> newExpense', newExpense);
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

}
