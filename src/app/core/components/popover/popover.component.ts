import { ModalController, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BillsService } from 'src/app/services/bills.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationResponse } from 'src/app/types/Notification';
import { ComponentBillComponent } from 'src/app/pages/bills/component-bill/component-bill.component';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  notificationsList: NotificationResponse[] = [];
  notificationsWithBills = [];

  loading = false;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private billsService: BillsService,
    private popoverController: PopoverController,
    private router: Router,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.refreshNotificationsList();
  }

  async refreshNotificationsList() {
    this.loading = true;
    try {
      const userId = this.userService.getLoggedUser().idUsuario;
      const unorderedNotifications = await this.notificationService.getAllUserNotifications(userId);
      this.notificationsList = unorderedNotifications;

      if (this.notificationsList.length > 0) {
        const userBills = await this.billsService.getAllUserBills(userId);

        this.notificationsWithBills = this.notificationsList.map(notif => {
          const relatedBill = userBills.find(bill => bill.idConta === notif.idConta);
          return relatedBill ? {...notif, relatedBill} : notif;
        });
      } else {
        this.notificationsWithBills = [];
      }
      console.log('🚀 -> PopoverComponent -> refreshNotificationsList -> this.notificationsWithBills', this.notificationsWithBills);
    } catch (error) {
      console.error('ERROR on notificationsList', error);
    } finally {
      this.loading = false;
    }
  }

  async onClickOpenNotification() {
    // this.router.navigate(['/bills/bills-list']);
    const modalBill = await this.modalController.create({
      component: ComponentBillComponent,
      backdropDismiss: true,
    });

    modalBill.present();
    this.popoverController.dismiss();
  }

}
