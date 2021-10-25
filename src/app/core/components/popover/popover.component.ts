import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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

  loading = false;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
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
