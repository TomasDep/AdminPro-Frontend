import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';

import { Medico } from 'src/app/models/medico.model';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';

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
    this.medicoService.cargarMedicos().subscribe(medicos => {
      this.cargando = false;
      this.medicos = medicos;
      this.medicosTemp = medicos;
    });
  }

  abrirModalMedico(medico: Medico): void {
    this.modalImagenService.abrirModal(this.tipo, medico.uid!, medico.img);
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

  borrarMedico(medico: Medico) {
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
        this.medicoService.borrarMedico(medico.uid || '').subscribe(resp => {
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
