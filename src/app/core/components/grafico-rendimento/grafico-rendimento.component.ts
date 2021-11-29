import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-grafico-rendimento',
  templateUrl: './grafico-rendimento.component.html',
  styleUrls: ['./grafico-rendimento.component.scss'],
})
export class GraficoRendimentoComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: [61, 59, 80, 65, 45, 55, 40, 56, 76, 65, 77, 60], label: 'Gastos' },
    { data: [57, 50, 75, 87, 43, 46, 37, 48, 67, 56, 70, 50], label: 'Lucro bruto' },
    { data: [57, 50, 75, 87, 43, 46, 37, 48, 67, 56, 70, 50], label: 'Lucro liquido' },
  ];
  
  public lineChartLabels: Label[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 
  'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
  public lineChartOptions = {
    responsive: true,
  };
     
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
    
  constructor() { }
   
  ngOnInit() {
  }
}
