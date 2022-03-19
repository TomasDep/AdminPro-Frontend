import { Component, Input } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-donuts',
  templateUrl: './donuts.component.html',
  styleUrls: ['./donuts.component.css']
})
export class DonutsComponent {
  
  @Input() public title: string = 'Sin titulo';
  @Input('labels') public doughnutChartLabels: string[] = ['label1', 'label2', 'label3'];
  @Input('data') public dataDonuts: number[] = [];
  @Input('ChartData') public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { 
        data: [],
        backgroundColor: []
      },
    ],
  };

  public doughnutChartType: ChartType = 'doughnut';
}
