import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  notificationsList: any[];

  constructor() { }

  ngOnInit() {
    this.notificationsList = ['a','b','c','d'];
  }

}
