import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { Hospital } from '@models/hospital.model';
import { 
  HospitalService, 
  ModalImagenService, 
  BusquedaService 
} from '@services/index';
@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy {
  private tipo: string = 'hospitales';
  private update: string = '';
  private delete: string = '';
  private createTitle: string = '';
  private createText: string = '';
  private createPlaceholder: string = '';
  public placeholderSearch: string = '';
  public placeholderName: string = '';
  public cargando: boolean = true;
  public desde: number = 0;
  public totalHospitales: number = 0;
  public imgSubs: Subscription =  new Subscription();
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];

  constructor(
    private hospitalService: HospitalService, 
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedaService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
                        .pipe(delay(300))
                        .subscribe(img => this.cargarHospitales());

    this.translate.get('MAINTAINERS.HOSPITALS').subscribe(resp => {
      this.placeholderName = resp.PLACEHOLDER.NAME;
      this.placeholderSearch = resp.PLACEHOLDER.SEARCH;
      this.update = resp.ALERTS.UPDATE;
      this.delete = resp.ALERTS.DELETE;
      this.createTitle = resp.ALERTS.CREATE.TITLE;
      this.createText = resp.ALERTS.CREATE.TEXT;
      this.createPlaceholder = resp.ALERTS.CREATE.PLACEHOLDER.NAME;
    });
  }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales(): void {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde).subscribe(hospitales => {
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
      this.totalHospitales = this.hospitalService.totalHospitales;
      this.cargando = false;
    });
  }

  cambiarPagina(valor: number): void {
    this.desde += valor;
    
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalHospitales) {
      this.desde -= valor;
    }

    this.cargarHospitales();
  }

  editarHospital(hospital: Hospital): void {
    this.hospitalService.actualizarHospitales(hospital._id!, hospital.nombre)
        .subscribe(resp => {
          Swal.fire(this.update, hospital.nombre, 'success');
        });
  }

  eliminarHospital(hospital: Hospital): void {
    this.hospitalService.borrarHospitales(hospital._id!)
        .subscribe(resp => {
          this.cargarHospitales();
          Swal.fire(this.delete, hospital.nombre, 'success');
        });
  }

  async crearHospital(): Promise<void> {
    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      title: this.createTitle,
      text: this.createText,
      inputPlaceholder: this.createPlaceholder,
      showCancelButton: true
    });
    
    if (value?.trim().length! > 0) {
      this.hospitalService.crearHospitales(value!).subscribe((resp: any) => {
        this.hospitales.push(resp.hospital);
      });
    }
  }

  abrirModalHospitales(hospital: Hospital): void {
    this.modalImagenService.abrirModal(this.tipo, hospital._id!, hospital.img);
  }

  buscar(termino: string): Hospital[] {
    if (termino.length === 0) {
      return this.hospitales = this.hospitalesTemp;
    } else {
      this.busquedaService.buscarHospitales(this.tipo, termino).subscribe((resp: Hospital[]) => {
        this.hospitales = resp;
        return this.hospitales;
      });
    }
    return [];
  }
}
