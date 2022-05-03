import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { HospitalService, MedicoService, UsuarioService } from '@services/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public contUsuariosStop: any;
  public conthospitalesStop: any;
  public contMedicosStop: any;
  public contUsuarios: number = 0;
  public contHospitales: number = 0;
  public contMedicos: number = 0;
  public totalUsuarios: number = 0;
  public totalHospitales: number = 0;
  public totalMedicos: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.usuarioService.cargaTotalUsuarios().subscribe(total => this.totalUsuarios = total);
    this.setContUsuarios();
    this.hospitalService.cargaTotalHosptiales().subscribe(total => this.totalHospitales = total);
    this.setContHospitales();
    this.medicoService.cargaTotalMedicos().subscribe(total => this.totalMedicos = total);
    this.setContMedicos();
  }

  setContUsuarios(): void {
    this.contUsuariosStop = setInterval(() => {
      this.contUsuarios++;
      console.log('Total usuarios', this.totalUsuarios);
      if (this.contUsuarios === this.totalUsuarios) {
        console.log('STOP');
        clearInterval(this.contUsuariosStop);
      }
    }, 100);
  }

  setContHospitales(): void {
    this.conthospitalesStop = setInterval(() => {
      this.contHospitales++;
      console.log('Total hospitales', this.totalHospitales);
      if (this.contHospitales === this.totalHospitales) {
        clearInterval(this.conthospitalesStop);
        console.log('STOP');
      }
    }, 100);
  }

  setContMedicos(): void {
    this.contMedicosStop = setInterval(() => {
      this.contMedicos++;
      console.log('Total medicos', this.totalMedicos);
      if (this.contMedicos === this.totalMedicos) {
        clearInterval(this.contMedicosStop);
        console.log('STOP');
      }
    }, 100);
  }
}
