import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  public imgSubs: Subscription =  new Subscription();
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public cargando: boolean = true;

  constructor(
    private hospitalService: HospitalService, 
    private modalImagenService: ModalImagenService,
    private busquedaService: BusquedaService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
                        .pipe(delay(300))
                        .subscribe(img => this.cargarHospitales());
  }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales(): void {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(hospitales => {
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
      this.cargando = false;
    });
  }

  editarHospital(hospital: Hospital): void {
    this.hospitalService.actualizarHospitales(hospital._id!, hospital.nombre)
        .subscribe(resp => {
          Swal.fire('Actualizado', hospital.nombre, 'success');
        });
  }

  eliminarHospital(hospital: Hospital): void {
    this.hospitalService.borrarHospitales(hospital._id!)
        .subscribe(resp => {
          this.cargarHospitales();
          Swal.fire('Borrado', hospital.nombre, 'success');
        });
  }

  async crearHospital(): Promise<void> {
    const { value = '' } = await Swal.fire<string>({
      input: 'text',
      title: 'Nuevo hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true
    })
    
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
