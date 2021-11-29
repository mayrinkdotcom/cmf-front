import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillsPage } from './bills.page';
import { ComponentBillComponent } from './component-bill/component-bill.component';

const routes: Routes = [
  {
    path: '',
    component: BillsPage
  },
  {
    path: 'bills-list',
    component: ComponentBillComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillsPageRoutingModule {}
