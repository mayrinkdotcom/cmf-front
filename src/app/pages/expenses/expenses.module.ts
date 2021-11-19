import { TransactionDataComponent } from './transaction-data/transaction-data.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from 'src/app/core/components/components.module';

import { ExpensesPageRoutingModule } from './expenses-routing.module';
import { ExpensesPage } from './expenses.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpensesPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
  ],
  declarations: [ExpensesPage, TransactionDataComponent]
})
export class ExpensesPageModule {}
