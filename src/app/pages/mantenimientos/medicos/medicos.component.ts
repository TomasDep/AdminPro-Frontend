import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

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
    });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(): void {
    this.cargando = true;
    this.medicoService.cargarMedicos(this.desde)
      .subscribe(medicos => {
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
      this.busquedaService.buscarMedicos(this.tipo, termino)
        .subscribe((resp: Medico[]) => {
          this.medicos = resp;
          return this.medicos;
        });
    }
    return [];
  }

  borrarMedico(medico: Medico): void {
    this.translate.get('MAINTAINERS.MEDICS.SWAL.DELETE').subscribe(resp => {
      let text: string = resp.TEXT;
      let textConfirm: string = resp.CONFIRMDELETE.TEXT;
      let titleConfirm: string = resp.CONFIRMDELETE.TITLE;
      
      text = text.replace('param', medico.nombre);
      textConfirm = textConfirm.replace('param', medico.nombre);

      Swal.fire({
        title: resp.TITLE,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: resp.BUTTON.CONFIRM,
        confirmButtonColor: this.confirmButtonColorTheme(),
        cancelButtonText: resp.BUTTON.CANCEL,
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          this.medicoService.borrarMedico(medico._id || '')
            .subscribe(resp => {
              this.cargarMedicos();

              Swal.fire({
                title: titleConfirm,
                text: textConfirm,
                icon: 'success',
                confirmButtonColor: this.confirmButtonColorTheme()
              });
            });
        }
      });
    });
  }

  confirmButtonColorTheme(): string {
    switch (this.themeColor) {
      case 'red':
        return '#ef5350';
      case 'red-dark':
        return '#ef5350';

      case 'green':
        return '#06d79c';
      case 'green-dark':
        return '#06d79c';

      case 'blue':
        return '#1976d2';
      case'blue-dark':
        return '#1976d2';

      case 'purple':
        return '#7460ee';
      case 'purple-dark':
        return '#7460ee';

      case 'megna':
        return '#56c0d8';
      case 'megna-dark':
        return '#56c0d8';

      default:
        return '#2a3e52';
    }
  }
}
