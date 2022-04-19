import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { HospitalService, MedicoService, UsuarioService } from '@services/index';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
    this.hospitalService.cargaTotalHosptiales().subscribe(total => this.totalHospitales = total);
    this.medicoService.cargaTotalMedicos().subscribe(total => this.totalMedicos = total);;
  }

}
