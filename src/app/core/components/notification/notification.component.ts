import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  notificationsToShow: any[];

  constructor(
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    this.notificationsToShow = ['a','b','c','d'];
  }

  async onClickNotifications() {
    const popover = await this.popoverController.create(
      {
        component: PopoverComponent,
        componentProps: this.notificationsToShow,
        animated: true,
      }
    );
    popover.present();
  }

}
