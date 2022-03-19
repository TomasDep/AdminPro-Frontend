import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-donuts',
  templateUrl: './donuts.component.html',
  styleUrls: ['./donuts.component.css']
})
export class DonutsComponent implements OnInit{
  
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
  
  /* public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { 
        data: this.dataDonuts,
        backgroundColor: ['#6857e6', '#009fee', '#f02059']
      },
    ],
  }; */

  public doughnutChartType: ChartType = 'doughnut';

  ngOnInit(): void {
    console.log(this.dataDonuts);
    console.log(this.doughnutChartLabels);
  }
}
