import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { NgChartsModule } from 'ng2-charts';

import { IncrementadorComponent } from './incrementador/incrementador.component';
import { DonutsComponent } from './donuts/donuts.component';
import { ModalImagenComponent } from '@components/index';

@NgModule({
  declarations: [
    IncrementadorComponent,
    DonutsComponent,
    ModalImagenComponent
  ],
  exports: [
    IncrementadorComponent,
    DonutsComponent,
    ModalImagenComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgChartsModule,
    TranslateModule
  ]
})
export class ComponentsModule { }
