import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '@components/components.module';
import { SharedModule } from '@shared/shared.module';
import { PipesModule } from '@pipes/pipes.module';
import { 
  AccountSettingsComponent,
  BusquedaComponent,
  DashboardComponent,
  Grafica1Component,
  HospitalesComponent,
  MedicoComponent,
  MedicosComponent,
  PagesComponent,
  PerfilComponent,
  UsuariosComponent,
} from '@pages/index';

@NgModule({
  declarations: [
    DashboardComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent,
    PerfilComponent,
    UsuariosComponent,
    HospitalesComponent,
    MedicosComponent,
    MedicoComponent,
    BusquedaComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    RouterModule,
    ComponentsModule,
    ReactiveFormsModule,
    PipesModule
  ],
  exports: [
    DashboardComponent,
    Grafica1Component,
    PagesComponent,
    AccountSettingsComponent
  ]
})
export class PagesModule { }
