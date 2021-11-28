import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { GraficoRendimentoComponent } from 'src/app/core/components/grafico-rendimento/grafico-rendimento.component';

@NgModule({
  imports: [
    CommonModule,
    ChartsModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, GraficoRendimentoComponent],
})
export class HomePageModule {}
