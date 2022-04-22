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
  private createTitle: string = '';
  private createText: string = '';
  private createPlaceholder: string = '';
  private createButtonAdd: string = '';
  private createButtonCancel: string = '';
  public placeholderSearch: string = '';
  public placeholderName: string = '';
  public themeColor: string = 'default';
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

    this.themeColor = localStorage.getItem('themeButton') || 'default';

    this.imgSubs = this.modalImagenService.nuevaImagen
                        .pipe(delay(300))
                        .subscribe(img => this.cargarHospitales());

    this.translate.get('MAINTAINERS.HOSPITALS').subscribe(resp => {
      this.placeholderName = resp.PLACEHOLDER.NAME;
      this.placeholderSearch = resp.PLACEHOLDER.SEARCH;
      this.createTitle = resp.SWAL.CREATE.TITLE;
      this.createText = resp.SWAL.CREATE.TEXT;
      this.createPlaceholder = resp.SWAL.CREATE.PLACEHOLDER.NAME;
      this.createButtonAdd = resp.SWAL.CREATE.BUTTON.ADD;
      this.createButtonCancel = resp.SWAL.CREATE.BUTTON.CANCEL;
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
          this.translate.get('MAINTAINERS.HOSPITALS.SWAL.UPDATE')
            .subscribe(resp => {
              let text: string = resp.TEXT;
              text = text.replace('param', hospital.nombre);
              
              Swal.fire({
                title: resp.TITLE,
                text,
                icon: 'success',
                confirmButtonColor: this.confirmButtonColorTheme(),
              });
          });
        });
  }

  eliminarHospital(hospital: Hospital): void {
    this.hospitalService.borrarHospitales(hospital._id!)
        .subscribe(resp => {
          this.cargarHospitales();
          this.translate.get('MAINTAINERS.HOSPITALS.SWAL.DELETE')
            .subscribe(resp => {
              let text: string = resp.TEXT;
              text = text.replace('param', hospital.nombre);
              Swal.fire({
                title: resp.TITLE,
                text: text,
                icon: 'success',
                confirmButtonColor: this.confirmButtonColorTheme(),
              });
          });
        });
  }

  async crearHospital(): Promise<void> {
    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      title: this.createTitle,
      text: this.createText,
      inputPlaceholder: this.createPlaceholder,
      showCancelButton: true,
      confirmButtonText: this.createButtonAdd,
      confirmButtonColor: this.confirmButtonColorTheme(),
      cancelButtonText: this.createButtonCancel,
      cancelButtonColor: '#d33'
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
