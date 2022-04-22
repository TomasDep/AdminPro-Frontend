import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

import { Hospital, Medico } from '@models/index';
import { HospitalService, MedicoService } from '@services/index';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
  public placeholderName: string = '';
  public themeColor: string = 'default';
  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital = new Hospital('', '');
  public medicoSeleccionado: Medico = new Medico('', new Hospital('', '') , '');

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.themeColor = localStorage.getItem('themeButton') || 'default';

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges
      .subscribe(hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find(hospital => hospital._id === hospitalId)!;
      });

    this.translate.get("MAINTAINERS.MEDICS.MEDIC.FORM.PLACEHOLDER")
      .subscribe(resp => {
        this.placeholderName = resp.NAME;
      });
  }
  
  cargarHospitales(): void {
    this.hospitalService.cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }
  
  cargarMedico(id: string): void {
    if (id === 'nuevo') {
      return;
    }

    this.medicoService.cargarMedicoPorId(id)
      .pipe(
        delay(300)
      )
      .subscribe(medico => {
        if (!medico) {
          return this.router.navigateByUrl('/dashboard/medicos');
        } else {
          const nombre: string = medico.nombre;
          const hospital: string = medico.hospital._id;
          this.medicoSeleccionado = medico;
          this.medicoForm.setValue({ nombre, hospital});
          return this.router.navigateByUrl(`/dashboard/medico/${ medico._id }`);
        }
      });
  }
  
  guardarMedico(): void {
    const nombre: string = this.medicoForm.value.nombre;
    const hospital: string = this.medicoForm.value.hospital;
    

    if (this.medicoSeleccionado._id !== '') { 
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      
      this.medicoService.actualizarMedico(data).subscribe(resp => {
        this.translate.get('MAINTAINERS.MEDICS.MEDIC.SWAL.UPDATE')
          .subscribe(resp => {
            let text: string = resp.TEXT;
            text = text.replace('param', nombre);

            Swal.fire({
              title: resp.TITLE,
              text,
              icon: 'success',
              confirmButtonColor: this.confirmButtonColorTheme()
            });
          });
      });
    } else {
      this.translate.get('MAINTAINERS.MEDICS.MEDIC.SWAL.CREATE')
        .subscribe(lang => {
          let text: string = lang.TEXT;
          text = text.replace('param', nombre);
          
          this.medicoService.crearMedico({ nombre, hospital })
            .subscribe((resp: any) => {
              Swal.fire({
                title: lang.TITLE, 
                text, 
                icon: 'success',
                confirmButtonColor: this.confirmButtonColorTheme()
              });
              this.router.navigateByUrl(`/dashboard/medico/${ resp.medico.uid }`);
            });
        });
    }
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
