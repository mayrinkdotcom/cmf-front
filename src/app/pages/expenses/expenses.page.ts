import { TransactionService } from './../../services/transaction.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { TopbarService } from 'src/app/services/topbar.service';
import { Transaction, TransactionResponse } from 'src/app/types/Transaction';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit, AfterViewInit {

  availableTransactions: TransactionResponse[] = [];

  constructor(
    private transactionService: TransactionService,
    private topbarService: TopbarService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.topbarService.configBackButton(true, '/home');
  }

  ngAfterViewInit() {
    this.refreshAvailableTransactions();
  }

  async onClickAddTransaction() {
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
          handler: (inputs) => this.saveTransaction(inputs),
        },
      ]
    });

    alert.present();
  }

  async saveTransaction(newExpense: Transaction) {
    const l = await this.loadingController.create({
      message: 'Adicionando produto...',
    });
    l.present();

    try {
      const response = await this.transactionService.createTransaction(newExpense);
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Produto criado com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();

      this.refreshAvailableTransactions();

    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha na criação do produto, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.log('🚀 -> TransactionsPage -> onAddTransaction -> error', error);
      throw error;
    }
  }

  async onEditTransaction(item: TransactionResponse) {
    const alert = await this.alertController.create({
      header: 'Editar movimentação',
      inputs: [
        {
          label: 'Nome',
          placeholder: 'Nome',
          name: 'nome',
          type: 'text',
          value: item.type,
        },
        {
          label: 'Quant.',
          placeholder: 'Quant.',
          name: 'quantidade',
          type: 'number',
          value: item.valor,
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
            const editedTransaction: TransactionResponse = {
              idUsuario: item.idUsuario,
              ordem: item.ordem,
              idMovimentacao: item.idMovimentacao,
              type: item.type,
              valor: item.valor,
              idProduto: item.idProduto,
              productQty: item.productQty,
            };
            this.editTransaction(editedTransaction);
          },
        },
      ]
    });

    alert.present();
  }

  async editTransaction(editedTransaction: TransactionResponse) {
    const l = await this.loadingController.create({
      message: 'Atualizando produto...',
    });
    l.present();
    try {
      const res = await this.transactionService.updateTransaction(editedTransaction);
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Produto atualizado com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();

      this.refreshAvailableTransactions();
    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha na edição do produto, por favor verifique os dados e tente novamente.',
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
      message: 'Deseja realmente excluir ' + item.idMovimentacao + '? Essa ação não pode ser desfeita!',
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
      message: 'Excluindo produto...',
    });

    l.present();
    try {
      const res = await this.transactionService.deleteTransaction(transactionId);
      l.dismiss();
      this.refreshAvailableTransactions();
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
      console.log('🚀 -> TransactionsPage -> onDeleteTransaction -> error', error);
      throw error;
    }
  }

  async refreshAvailableTransactions() {
    const transactionsUnordered = await this.transactionService.getTransactionsToShow();
    this.availableTransactions = transactionsUnordered.sort((a, b) => a.nome.localeCompare(b.nome));
  }


}
