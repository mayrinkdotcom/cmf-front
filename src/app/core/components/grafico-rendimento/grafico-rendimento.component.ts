import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import { TransactionService } from 'src/app/services/transaction.service';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-grafico-rendimento',
  templateUrl: './grafico-rendimento.component.html',
  styleUrls: ['./grafico-rendimento.component.scss'],
})
export class GraficoRendimentoComponent implements OnInit {
  cont;
  lucro;
  liquido;
  async ngOnInit() {
    const january = await this.transactionService.getTransactionsByDate('2021-01-01', '2021-01-31');
    this.insertConta(january, 0);
    const fevereiro = await this.transactionService.getTransactionsByDate('2021-02-01', '2021-02-28');
    this.insertConta(fevereiro, 1);
    const marco = await this.transactionService.getTransactionsByDate('2021-03-01', '2021-03-31');
    this.insertConta(marco, 2);
    const abril = await this.transactionService.getTransactionsByDate('2021-04-01', '2021-04-30');
    this.insertConta(abril, 3);
    const maio = await this.transactionService.getTransactionsByDate('2021-05-01', '2021-05-31');
    this.insertConta(maio, 4);
    const junho = await this.transactionService.getTransactionsByDate('2021-06-01', '2021-06-30');
    this.insertConta(junho, 5);
    const julho = await this.transactionService.getTransactionsByDate('2021-07-01', '2021-07-31');
    this.insertConta(julho, 6);
    const agosto = await this.transactionService.getTransactionsByDate('2021-08-01', '2021-08-31');
    this.insertConta(agosto, 7);
    const setembro = await this.transactionService.getTransactionsByDate('2021-09-01', '2021-09-30');
    this.insertConta(setembro, 8);
    const outubro = await this.transactionService.getTransactionsByDate('2021-10-01', '2021-10-31');
    this.insertConta(outubro, 9);
    const novembro = await this.transactionService.getTransactionsByDate('2021-11-01', '2021-11-30');
    this.insertConta(novembro, 10);
    const dezembro = await this.transactionService.getTransactionsByDate('2021-12-01', '2021-12-31');
    this.insertConta(dezembro, 11);
  }
  insertConta(mes, numero) {
    this.cont = 0;
    this.lucro = 0;
    this.liquido = 0;
    for (let i = 0; i < mes.length; i++) {
      if (mes[i].ordem == 'SAIDA') {
        this.cont += mes[i].valor;        
      }
      if(mes[i].ordem == 'ENTRADA'){
        this.lucro += mes[i].valor;
      }
      this.liquido = this.lucro - this.cont;
    }
    console.log(this.lucro);
    this.lineChartData[0].data[numero] = this.cont;
    this.lineChartData[1].data[numero] = this.lucro;
    this.lineChartData[2].data[numero] = this.liquido;
  }

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Gastos' },
    { data: [], label: 'Lucro bruto' },
    { data: [], label: 'Lucro liquido' },
  ];

  public lineChartLabels: Label[] = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  public lineChartOptions = {
    responsive: true,
  };

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  constructor(private transactionService: TransactionService,) { }



}
