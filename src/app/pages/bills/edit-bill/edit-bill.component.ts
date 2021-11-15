/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { alertController } from '@ionic/core';
import { BillsService } from 'src/app/services/bills.service';
import { UserService } from 'src/app/services/user.service';
import { BillResponse } from 'src/app/types/Bill';

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.scss'],
})
export class EditBillComponent implements OnInit {

  @Input() bill;
  bills: BillResponse[] = [];
  allertController: any;
  constructor(
    private billService: BillsService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private userService: UserService,
  ) { }


  valor: Number;
  descricao: string;
  vencimento: Date;
  checkbox: boolean;
  dataNotificacao: Date;
  ngOnInit() {}

  async salvarDataDeNotificacao(){
    if(!this.checkbox){
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
              this.checkbox = false;
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

  closeEditModal(){
    this.modalController.dismiss();
  }

}
