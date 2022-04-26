import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { HospitalService, MedicoService, UsuarioService } from '@services/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public contUsuarios: number = 0;
  public contHospitales: number = 0;
  public contMedicos: number = 0;
  public totalUsuarios: number = 0;
  public totalHospitales: number = 0;
  public totalMedicos: number = 0;

  public contUsuariosStop: any = setInterval(() => {
    this.contUsuarios++;
    if (this.contUsuarios === this.totalUsuarios) {
      clearInterval(this.contUsuariosStop);
    }
  }, 60);

  public conthospitalesStop: any = setInterval(() => {
    this.contHospitales++;
    if (this.contHospitales === this.totalHospitales) {
      clearInterval(this.conthospitalesStop);
    }
  }, 60);

  public contMedicosStop: any = setInterval(() => {
    this.contMedicos++;
    if (this.contMedicos === this.totalMedicos) {
      clearInterval(this.contMedicosStop);
    }
  }, 60);

  constructor(
    private usuarioService: UsuarioService,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.usuarioService.cargaTotalUsuarios().subscribe(total => this.totalUsuarios = total);
    this.hospitalService.cargaTotalHosptiales().subscribe(total => this.totalHospitales = total);
    this.medicoService.cargaTotalMedicos().subscribe(total => this.totalMedicos = total);
  }
}
