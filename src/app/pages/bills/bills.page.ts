import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BillsService } from 'src/app/services/bills.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ProductService } from 'src/app/services/product.service';
import { TopbarService } from 'src/app/services/topbar.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { Notification } from 'src/app/types/Notification';
import { BillResponse } from 'src/app/types/Bill';
import { ProductResponse } from 'src/app/types/Product';
import { DEFAULT_TRANSACTION, Transaction } from 'src/app/types/Transaction';
import { UserResponse } from 'src/app/types/User';
import { ComponentBillComponent } from './component-bill/component-bill.component';
import { alertController } from '@ionic/core';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.page.html',
  styleUrls: ['./bills.page.scss'],
})

export class BillsPage implements OnInit {

  addTransaction: FormGroup = new FormGroup(
    {
      transactionType: new FormControl(null, [
        Validators.required,
      ]),
      transactionValue: new FormControl(null, [
        Validators.required,
      ]),
      relatedProduct: new FormControl(false),
      productName: new FormControl(),
      productQuantity: new FormControl()
    },
  );

  bill: BillResponse;
  modalToToggle: HTMLElement;
  newTransaction: Transaction = DEFAULT_TRANSACTION;

  availableProducts: ProductResponse[];

  feesMapping = {
    workers: 1,
    taxes: 2,
    products: 3,
    total: 6
  };

  descricao: string;
  vencimento: Date;
  valor: number;
  checkbox: boolean;
  dataNotificacao: Date;
  idNotificacao: number;

  userLogged: UserResponse;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private transactionService: TransactionService,
    private userService: UserService,
    private productService: ProductService,
    private billsService: BillsService,
    private notificationService: NotificationService,
    private topbarService: TopbarService,
    private modalController: ModalController,
    private allertController: AlertController
  ) { }

  async ngOnInit() {
    this.modalToToggle = document.getElementById('add-transaction');
    this.checkUserLogged();

    this.refreshAvailableProducts();
    this.userLogged = this.userService.getLoggedUser();
    this.topbarService.configBackButton(true, '/home');
  }

  async onClickViewBill(bill: BillResponse){
    const modalBill = await this.modalController.create({
      component: ComponentBillComponent,
      componentProps: {bill, idNotificacao: this.idNotificacao},
      backdropDismiss: true,
    });

    modalBill.present();
    this.refreshAvailableProducts();
  }

  checkUserLogged() {
    if (!window.localStorage.getItem('loggedUser')) {
      this.router.navigate(['external/login']);
    }
  }

  toggleModalVisibility(id: string) {
    this.modalToToggle = document.getElementById(id);
    this.modalToToggle?.classList.toggle('hidden');
    if (this.modalToToggle?.classList.contains('hidden')) {
      this.addTransaction.reset();
    }
  }


  toggleAccordion(id: string) {
    console.log('abre aí', id);
    const content = document.getElementById(id + '-content');
    content.classList.toggle('hidden');
  }

  async onAddTransaction() {
    const l = await this.loadingController.create({
      message: 'Adicionando movimentação...',
    });
    l.present();

    try {
      this.newTransaction = {
        userId: (await this.userService.getUserByEmail('johndoe@ceo.com')).idUsuario,
        order: this.addTransaction.get('transactionType').value,
        value: this.addTransaction.get('transactionValue').value,
        type: this.addTransaction.get('relatedProduct').value ? 'PRODUTO' : 'CONTAS',
        productId: this.addTransaction.get('relatedProduct').value ? this.addTransaction.get('productName').value : null,
        productQty: this.addTransaction.get('relatedProduct').value ? this.addTransaction.get('productQuantity').value : null,
      };

      const response = await this.transactionService.createTransaction(this.newTransaction);
      console.log('🚀 -> BillsPage -> onAddTransaction -> response', response);
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Movimentação criada com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();

    } catch (error) {
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Falha na criação da movimentação, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.error('🚀 -> BillsPage -> onAddTransaction -> error', error);
      throw error;
    }
  }

  async onAddBill(): Promise<void> {
    const l = await this.loadingController.create({
      message: 'Adicionando conta...',
    });
    l.present();
    try {
      const bill = {
              tipoConta: this.descricao,
              dataVencimento: this.vencimento.toString(),
              valorConta: this.valor,
              idUsuario: this.userLogged.idUsuario,
              receberNotificacao: !!this.checkbox
            };

      const resBillCreated = await this.billsService.createBill(bill);
      console.log('🚀 -> BillsPage -> onAddBill -> res', resBillCreated);

      if (this.checkbox) {
        this.addNotification(resBillCreated.idConta);
      }

      l.dismiss();

      const t = await this.toastController.create({
        message: 'Conta criada com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();
    } catch (error) {
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Falha na criação da conta, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.error('ERROR on onAddBill: ', error);
      throw error;
    }
  }

  preventDefault($event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  async refreshAvailableProducts() {
    const productsUnordered = await this.productService.getAvailableProducts();
    this.availableProducts = productsUnordered.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  async getAllBills() {
    try {
      const allBills = await this.billsService.getAllUserBills(this.userLogged.idUsuario);
      console.log('🚀 -> BillsPage -> getAllBills -> allBills', allBills);
      return allBills;
    } catch (error) {
      const t = await this.toastController.create({
        message: 'Falha na requisição de contas do usuário, por favor tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.error('ERROR on getAllBills: ', error);
      throw error;
    }
  }

   diaAnterior(){
      const lembrete = new Date(this.vencimento);
      const diaDoMes = lembrete.getUTCDate()-1;
      const dataLembrete = new Date(lembrete.getUTCFullYear(), lembrete.getUTCMonth(), diaDoMes);
      console.log(dataLembrete.getUTCFullYear(), dataLembrete.getUTCMonth(), dataLembrete.getUTCDate());
      const outro = `${dataLembrete.getUTCFullYear()}-${dataLembrete.getUTCMonth()}-${dataLembrete.getUTCDate()}`;
      console.log('Dia anterior');
      console.log(outro);

      return outro.toString();
  }


  async addNotification(idConta: number) {
    try {
      const lembrete = this.diaAnterior();
      console.log(lembrete);
      const newNotification: Notification = {
        idConta,
        idUsuario: this.userLogged.idUsuario,
        dataLembrete: lembrete
      };
      const resNotificationCreated = await this.notificationService.createNotification(newNotification);
      this.idNotificacao = resNotificationCreated.idNotificacao;
      console.log(resNotificationCreated.idNotificacao);
      console.log('🚀 -> BillsPage -> addNotification -> resNotificationCreated', resNotificationCreated);
    } catch (error) {
      console.error('ERROR on addNotification', error);
      throw error;
    }
  }
}

