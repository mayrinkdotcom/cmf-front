import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { TopbarService } from 'src/app/services/topbar.service';
import { TransactionResponse } from 'src/app/types/Transaction';

import { TransactionService } from './../../services/transaction.service';
import { TransactionDataComponent } from './transaction-data/transaction-data.component';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit, AfterViewInit {

  availableTransactions: TransactionResponse[] = [];
  loading = false;

  constructor(
    private transactionService: TransactionService,
    private topbarService: TopbarService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.topbarService.configBackButton(true, '/home');
  }

  ngAfterViewInit() {
    this.refreshAvailableTransactions();
  }

  async onClickTransactionData() {
    const modal = await this.modalController.create({
      component: TransactionDataComponent,
      backdropDismiss: false,
    });

    modal.present();

    const { data } = await modal.onWillDismiss();

    if (!!data) {
      console.log('🚀 -> ExpensesPage -> onClickTransactionData -> data', data);
      this.refreshAvailableTransactions();
    }
  }

  async onEditTransaction(item: TransactionResponse) {
    console.log('🚀 -> ExpensesPage -> onEditTransaction -> item', item);
    const modal = await this.modalController.create({
      component: TransactionDataComponent,
      componentProps: { transactionToEdit: item },
      backdropDismiss: false,
    });

    modal.present();

    const { data } = await modal.onWillDismiss();

    if (!!data) {
      console.log('🚀 -> ExpensesPage -> onClickTransactionData -> data', data);
      this.refreshAvailableTransactions();
    }
  }

  async editTransaction(editedTransaction: TransactionResponse) {
    const l = await this.loadingController.create({
      message: 'Atualizando movimentação...',
    });
    l.present();
    try {
      const res = await this.transactionService.updateTransaction(editedTransaction);
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Movimentação atualizada com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();

      this.refreshAvailableTransactions();
    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha na edição da movimentação, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.log('🚀 -> TransactionsPage -> onEditTransaction -> error', error);
      throw error;
    }
  }

  async onDeleteTransaction(item: TransactionResponse) {
    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: 'Deseja realmente excluir ' + item.tipoMovimentacao + '? Essa ação não pode ser desfeita!',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => alert.dismiss(),
        },
        {
          text: 'Confirmar',
          handler: () => this.deleteTransaction(item.idMovimentacao),
        }
      ]
    });
    alert.present();
  }

  async deleteTransaction(transactionId: number) {
    const l = await this.loadingController.create({
      message: 'Excluindo movimentação...',
    });

    l.present();
    try {
      const res = await this.transactionService.deleteTransaction(transactionId);
      l.dismiss();
      this.refreshAvailableTransactions();
      const t = await this.toastController.create({
        message: 'Movimentação excluída com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();
    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha na exclusão da movimentação, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.error('🚀 -> TransactionsPage -> onDeleteTransaction -> error', error);
      throw error;
    }
  }

  async refreshAvailableTransactions() {
    this.loading = true;
    try {
      const transactionsUnordered = await this.transactionService.getTransactionsByDate(new Date().toISOString().slice(0, 10));
      this.availableTransactions = transactionsUnordered.sort((a, b) => a?.ordem.localeCompare(b?.ordem));
      console.log('🚀 -> ExpensesPage -> refreshAvailableTransactions -> this.availableTransactions', this.availableTransactions);
      this.loading = false;
    } catch (error) {
      const t = await this.toastController.create({
        message: 'Falha ao carregar movimentações, por favor tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.error('🚀 -> ExpensesPage -> refreshAvailableTransactions -> error', error);
      throw error;
    }
  }

}
