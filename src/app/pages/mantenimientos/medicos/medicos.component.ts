import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { Medico } from '@models/medico.model';
import { BusquedaService, MedicoService, ModalImagenService } from '@services/index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public tipo: string = 'medicos';
  public cargando: boolean = true;
  public imgSubs: Subscription = new Subscription();
  public desde: number = 0;
  public totalMedicos: number = 0;

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedaService
  ) { }
  
  ngOnInit(): void {
    this.cargarMedicos();
    
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(300))
    .subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(): void {
    this.cargando = true;
    this.medicoService.cargarMedicos(this.desde).subscribe(medicos => {
      this.medicos = medicos;
      this.medicosTemp = medicos;
      this.totalMedicos = this.medicoService.totalMedicos;
      this.cargando = false;
    });
  }

  cambiarPagina(valor: number): void {
    this.desde += valor;
    
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalMedicos) {
      this.desde -= valor;
    }

    this.cargarMedicos();
  }

  abrirModalMedico(medico: Medico): void {
    this.modalImagenService.abrirModal(this.tipo, medico._id!, medico.img);
  }

  buscar(termino: string): Medico[] {
    if (termino.length === 0) {
      return this.medicos = this.medicosTemp;
    } else {
      this.busquedaService.buscarMedicos(this.tipo, termino).subscribe((resp: Medico[]) => {
        this.medicos = resp;
        return this.medicos;
      });
    }
    return [];
  }

  borrarMedico(medico: Medico): void {
    Swal.fire({
      title: '¿Borrar medico?',
      text: `Esta seguro de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id || '').subscribe(resp => {
          this.cargarMedicos();
          Swal.fire(
            'Borrado!',
            `El medico ${ medico.nombre } a sido borrado correctamente`,
            'success'
          );
        });
      }
    });
  }
}
