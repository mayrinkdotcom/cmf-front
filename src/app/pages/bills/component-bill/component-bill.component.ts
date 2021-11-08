/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { BillsService } from 'src/app/services/bills.service';
import { Bill, BillResponse } from 'src/app/types/Bill';

@Component({
  selector: 'app-component-bill',
  templateUrl: './component-bill.component.html',
  styleUrls: ['./component-bill.component.scss'],
})
export class ComponentBillComponent implements OnInit {

  bills: Bill[] = [];
  topbarService: any;
  constructor(
    private billService: BillsService,
    private loadingController: LoadingController,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.refreshAvailableCBills();
  }

  async refreshAvailableCBills() {
    const categoriesUnordered = await this.billService.getAvailableBills();
    this.bills = categoriesUnordered.sort((a, b) => a.tipoConta.localeCompare(b.tipoConta));
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
