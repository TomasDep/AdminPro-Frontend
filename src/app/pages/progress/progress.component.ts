import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent {

  public progreso1: number = 15;
  public progreso2: number = 25;

  get getProgreso1 () {
    return `${this.progreso1}%`
  }

  get getProgreso2 () {
    return `${this.progreso2}%`
  }

  
}
