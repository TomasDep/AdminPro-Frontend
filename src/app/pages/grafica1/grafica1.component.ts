import { Component } from '@angular/core';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {
  public titulo1: string = 'Finanzas';
  public titulo2: string = 'Marketing';
  public titulo3: string = 'Seguridad';
  public titulo4: string = 'Atenciones';

  public label1: string[] = ['Ingresos', 'Perdidas', 'Deudas'];
  public label2: string[] = ['Likes', 'Dislikes', 'Sin clasificar'];
  public label3: string[] = ['Vulnerabilidades', 'Hackeos', 'Soluciones'];
  public label4: string[] = ['Enero', 'Febrero', 'Marzo'];

  public data1:number[] = [5800000, 3000000, 100000];
  public data2:number[] = [1000580, 120560, 1002];
  public data3:number[] = [150, 3, 120];
  public data4:number[] = [150000, 120000, 175000];

  public grafica1: ChartData<'doughnut'> = {
    labels: this.label1,
    datasets: [
      { 
        data: this.data1,
        backgroundColor: ['#6857e6', '#009fee', '#f02059']
      },
    ],
  };

  public grafica2: ChartData<'doughnut'> = {
    labels: this.label2,
    datasets: [
      { 
        data: this.data2,
        backgroundColor: ['#6857e6', '#009fee', '#f02059']
      },
    ],
  };

  public grafica3: ChartData<'doughnut'> = {
    labels: this.label3,
    datasets: [
      { 
        data: this.data3,
        backgroundColor: ['#6857e6', '#009fee', '#f02059']
      },
    ],
  };
  
  public grafica4: ChartData<'doughnut'> = {
    labels: this.label4,
    datasets: [
      { 
        data: this.data4,
        backgroundColor: ['#6857e6', '#009fee', '#f02059']
      },
    ],
  };
}
