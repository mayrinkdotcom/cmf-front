import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, AfterViewInit {

  notificationsList: any[];

  loading = false;

  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.refreshNotificationsList();
  }

  async refreshNotificationsList() {
    this.loading = true;
    try {
      const userId = this.userService.getLoggedUser().idUsuario;
      const unorderedNotifications = await this.notificationService.getAllUserNotifications(userId);
      this.notificationsList = unorderedNotifications.length > 0 ? unorderedNotifications : ['a','b','c','d'];
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
