import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { 
  DashboardComponent,
  AccountSettingsComponent,
  PerfilComponent,
  UsuariosComponent,
  HospitalesComponent,
  MedicosComponent,
  MedicoComponent,
  BusquedaComponent,
} from '@pages/index';
import { AdminGuard } from '@guards/admin.guard';

const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
  { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Account Settings' } },
  { path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'Coincidencias encontradas...' } },
  { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Grafica #1' } },
  { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' } },
  { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
  { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RXJS' } },
  { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de usuario' } },
  // Mantenimientos
  { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de hospitales' } },
  { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento de medicos' } },
  { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Mantenimiento de medicos' } },
  // Rutas Admin
  { 
    path: 'usuarios', 
    canActivate: [ AdminGuard ], 
    component: UsuariosComponent, 
    data: { titulo: 'Mantenimiento de usuarios' } 
  },
]

@NgModule({
  imports: [ RouterModule.forChild(childRoutes) ],
  exports: [ RouterModule ]
})
export class ChildRoutesModule { }
