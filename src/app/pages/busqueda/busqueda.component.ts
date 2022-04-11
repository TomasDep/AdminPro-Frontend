import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Hospital, Medico, Usuario } from '@models/index';
import { BusquedaService } from '@services/busqueda.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public medicos: Medico[] = [];
  public hospitales: Hospital[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private busqudaService: BusquedaService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ termino }) => this.busquedaGlobal(termino));
  }

  busquedaGlobal(termino: string): void {
    this.busqudaService.busquedaGlobal(termino).subscribe((resp: any) => {
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
      this.hospitales = resp.hospitales;
    });
  }
}
