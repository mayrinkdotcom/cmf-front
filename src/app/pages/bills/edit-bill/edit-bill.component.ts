/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { BillsService } from 'src/app/services/bills.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { Bill, BillResponse, DEFAULT_BILL } from 'src/app/types/Bill';
import { Notification, NotificationResponse } from 'src/app/types/Notification';
import { UserResponse } from 'src/app/types/User';

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.scss'],
})
export class EditBillComponent implements OnInit {

  @Input() bill: BillResponse = {
    ...DEFAULT_BILL,
    idConta: 0
  };
  @Input() idNotificacao: number;
  bills: BillResponse[] = [];
  dataNotificacao: Date;
  userLogged: UserResponse;

  constructor(
    private router: Router,
    private billsService: BillsService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private userService: UserService,
    private allertController: AlertController,
    private notificationService: NotificationService
  ) { }


  ngOnInit() {
    this.checkUserLogged();
    this.userLogged = this.userService.getLoggedUser();
  }



  checkUserLogged() {
    if (!window.localStorage.getItem('loggedUser')) {
      this.router.navigate(['external/login']);
    }
  }

  async salvarDataDeNotificacao(){
    if(!this.bill.receberNotificacao){
      const alert = await this.allertController.create({
        message: 'Digite a data para receber a notificação',
        backdropDismiss: false,
        inputs: [
          {
            name: 'notificacao',
            type: 'date'
          }
        ],
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {alertController.dismiss();
              this.bill.receberNotificacao = false;
            },
          },
          {
            text: 'Confirmar',
             handler: (data: Date) => this.dataNotificacao = data
          }
        ]
      });

      alert.present();
    }
  }

  async onUpdateBill() {
    const l = await this.loadingController.create({
      message: 'Editando conta...',
    });
    l.present();
    try {

      const resBillEdited = await this.billsService.updateBill(this.bill);
      l.dismiss();
      console.log('🚀 -> BillsPage -> onEditBill -> res', resBillEdited);

       if (this.bill.receberNotificacao) {
         this.editNotification(resBillEdited.idConta);
       }


      const t = await this.toastController.create({
        message: 'Conta editada com sucesso!',
        duration: 4000,
        color: 'success',
      });
      t.present();
      this.modalController.dismiss(true);
    } catch (error) {
      l.dismiss();

      const t = await this.toastController.create({
        message: 'Falha na Edição da conta, por favor verifique os dados e tente novamente.',
        duration: 4000,
        color: 'danger',
      });
      t.present();
      console.error('ERROR on onEditBill: ', error);
      throw error;
    }
  }

  diaAnterior(){
    const lembrete = new Date(this.bill.dataVencimento);
    const diaDoMes = lembrete.getUTCDate()-1;
    const dataLembrete = new Date(lembrete.getUTCFullYear(), lembrete.getUTCMonth(), diaDoMes);
    console.log(dataLembrete.getUTCFullYear(), dataLembrete.getUTCMonth(), dataLembrete.getUTCDate());
    const outro = `${dataLembrete.getUTCFullYear()}-${dataLembrete.getUTCMonth()}-${dataLembrete.getUTCDate()}`;
    console.log('Dia anterior');
    console.log(outro);

    return outro.toString();
}

  async editNotification(idConta: number) {
    try {
      const lembrete = this.diaAnterior();
      console.log(lembrete);
      const newNotification: NotificationResponse = {
        idConta,
        idUsuario: this.userLogged.idUsuario,
        dataLembrete: lembrete,
        idNotificacao: this.idNotificacao
      };
      const resNotificationCreated = await this.notificationService.updateNotification(newNotification);
      console.log('🚀 -> BillsPage -> addNotification -> resNotificationCreated', resNotificationCreated);
    } catch (error) {
      console.error('ERROR on addNotification', error);
      throw error;
    }
  }

  closeEditModal(){
    this.modalController.dismiss();
  }

}
