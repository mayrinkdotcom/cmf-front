import { PrintButtonComponent } from './print-button/print-button.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterCardComponent } from './register-card/register-card.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginCardComponent } from './login-card/login-card.component';
import { TopbarComponent } from './topbar/topbar.component';
import { NotificationComponent } from './notification/notification.component';
import { PopoverComponent } from './popover/popover.component';

@NgModule({
  declarations: [
    RegisterCardComponent,
    LoginCardComponent,
    TopbarComponent,
    NotificationComponent,
    PopoverComponent,
    PrintButtonComponent,
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  exports: [RegisterCardComponent, TopbarComponent, PrintButtonComponent],
})
export class ComponentsModule {}
