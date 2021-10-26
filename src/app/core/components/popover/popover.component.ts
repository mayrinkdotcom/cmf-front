import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { BillsService } from 'src/app/services/bills.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { NotificationResponse } from 'src/app/types/Notification';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, AfterViewInit {

  notificationsList: NotificationResponse[] = [];
  notificationsWithBills = [];

  loading = false;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private billsService: BillsService,
  ) { }

  ngOnInit() {
    this.refreshNotificationsList();
  }

  ngAfterViewInit() {
  }

  async refreshNotificationsList() {
    this.loading = true;
    try {
      const userId = this.userService.getLoggedUser().idUsuario;
      const unorderedNotifications = await this.notificationService.getAllUserNotifications(userId);
      this.notificationsList = unorderedNotifications;

      const userBills = await this.billsService.getAllUserBills(userId);

      this.notificationsWithBills = this.notificationsList.map(notif => {
        const relatedBill = userBills.filter(bill => bill.idConta === notif.idConta)[0];
        return relatedBill ? {...notif, relatedBill} : notif;
      });
      console.log('🚀 -> PopoverComponent -> refreshNotificationsList -> this.notificationsWithBills', this.notificationsWithBills);
    } catch (error) {
      console.error('ERROR on notificationsList', error);
    } finally {
      this.loading = false;
    }
  }

  onClickOpenNotification() {
    console.log('Not implemented yet');
  }

}
