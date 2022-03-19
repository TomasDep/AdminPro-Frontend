import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styleUrls: ['./incrementador.component.css']
})
export class IncrementadorComponent implements OnInit {
  /* @Input('valor') public progreso: number = 50; */
  @Input() public progreso: number = 50;
  @Input() public btnClass: string = 'btn-primary';

  @Output() public valorSalida: EventEmitter<number> = new EventEmitter();

  /* get getPorcentage() {
    return `${this.progreso}%`
  } */

  ngOnInit(): void {
    this.btnClass = `btn ${ this.btnClass }`
  }

  cambiarValor(valor: number) {
    if (this.progreso >= 100 && valor >= 0) {
      this.valorSalida.emit(100);
      return this.progreso = 100;
    } else if (this.progreso <= 0 && valor < 0) {
      this.valorSalida.emit(0);
      return this.progreso = 0;
    } else {
      this.progreso = this.progreso + valor;
      this.valorSalida.emit(this.progreso);
      return this.progreso;
    }
  }

  onChange(valor: number) {
    if (valor >= 100) {
      this.progreso = 100;
    } else if (valor <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = valor;
    }

    this.valorSalida.emit(valor);
  }
}
