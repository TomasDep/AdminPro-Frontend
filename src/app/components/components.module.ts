import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { DonutsComponent } from './donuts/donuts.component';

@NgModule({
  declarations: [
    IncrementadorComponent,
    DonutsComponent
  ],
  exports: [
    IncrementadorComponent,
    DonutsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule
  ]
})
export class ComponentsModule { }
