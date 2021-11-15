/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BillsService } from 'src/app/services/bills.service';
import { UserService } from 'src/app/services/user.service';
import { Bill, BillResponse } from 'src/app/types/Bill';
import { EditBillComponent } from '../edit-bill/edit-bill.component';

@Component({
  selector: 'app-component-bill',
  templateUrl: './component-bill.component.html',
  styleUrls: ['./component-bill.component.scss'],
})
export class ComponentBillComponent implements OnInit {

  bills: BillResponse[] = [];
  constructor(
    private billService: BillsService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private userService: UserService,
    private allertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.refreshAvailableBills();
  }

  async onEditBill(bill: BillResponse) {
    const m = await this.modalController.create({
      component: EditBillComponent,
      componentProps: {bill},
      backdropDismiss: true,
    });
    m.present();
    this.refreshAvailableBills();
  }

  async onDeleteBill(item: BillResponse) {
    console.log('onDeleteBill');
    const alert = await this.allertController.create({
      header: 'Atenção!',
      message: 'Deseja realmente excluir ' + item.tipoConta + '? Essa ação não pode ser desfeita!',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => alert.dismiss(),
        },
        {
          text: 'Confirmar',
          handler: () => this.deleteBill(item.idConta),
        }
      ]
    });
    alert.present();
  }

  async deleteBill(billId: number) {
    console.log('deleteBill1');
    const l = await this.loadingController.create({
      message: 'Excluindo conta...',
    });

    l.present();
    try {
      const res = await this.billService.deleteBill(billId);
      l.dismiss();
      this.refreshAvailableBills();
      const t = await this.toastController.create({
        message: 'Conta excluída com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();
    } catch (error) {
      l.dismiss();
      const t = await this.toastController.create({
        message: 'Falha ao deletar a Conta, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.log('🚀 -> BillsPage -> onDeleteBill -> error', error);
      throw error;
    }
  }

  async refreshAvailableBills() {
    const loggedUser = await this.userService.getLoggedUser();
    const billsUnordered = await this.billService.getAvailableBills(loggedUser.idUsuario);
    this.bills = billsUnordered.sort((a, b) => a.tipoConta.localeCompare(b.tipoConta));
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
