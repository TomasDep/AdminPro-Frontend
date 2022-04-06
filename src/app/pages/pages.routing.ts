import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  { 
    path: 'dashboard', 
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
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
        canActivate: [AdminGuard], 
        component: UsuariosComponent, 
        data: { titulo: 'Mantenimiento de usuarios' } 
      },
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PagesRoutingModule {}
