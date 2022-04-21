import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';

import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

import { Medico } from '@models/medico.model';
import { BusquedaService, MedicoService, ModalImagenService } from '@services/index';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {
  public tipo: string = 'medicos';
  public placeholderMedics: string = '';
  public deleteTitle: string = '';
  public deleteText: string = '';
  public deleteButton: string = '';
  public deleteCancel: string = '';
  public deleteConfirmTitle: string = '';
  public deleteConfirmText: string = '';
  public themeColor: string = 'default';
  public cargando: boolean = true;
  public desde: number = 0;
  public totalMedicos: number = 0;
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public imgSubs: Subscription = new Subscription();

  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedaService,
    public translate: TranslateService
  ) { }
  
  ngOnInit(): void {
    this.cargarMedicos();
    this.themeColor = localStorage.getItem('themeButton') || 'default';
    
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(delay(300))
    .subscribe(img => this.cargarMedicos());

    this.translate.get('MAINTAINERS.MEDICS').subscribe(resp => {
      this.placeholderMedics = resp.PLACEHOLDER.SEARCH;
      this.deleteTitle = resp.ALERTS.DELETE.TITLE;
      this.deleteText = resp.ALERTS.DELETE.TEXT;
      this.deleteButton = resp.ALERTS.DELETE.BUTTON.CONFIRM;
      this.deleteCancel = resp.ALERTS.DELETE.BUTTON.CANCEL;
      this.deleteConfirmTitle = resp.ALERTS.DELETE.SWALDELETE.TITLE;
      this.deleteConfirmText = resp.ALERTS.DELETE.SWALDELETE.TEXT;
    });
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
      title: this.deleteTitle,
      text: `${ this.deleteText } ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.deleteButton,
      cancelButtonText: this.deleteCancel
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.borrarMedico(medico._id || '').subscribe(resp => {
          this.cargarMedicos();
          Swal.fire(
          this.deleteConfirmTitle,
            `${ this.deleteConfirmText } ${ medico.nombre }`,
            'success'
          );
        });
      }
    });
  }
}
