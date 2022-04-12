import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';

import Swal from 'sweetalert2';

import { Hospital, Medico } from '@models/index';
import { HospitalService, MedicoService } from '@services/index';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital = new Hospital('', '');
  public medicoSeleccionado: Medico = new Medico('', new Hospital('', '') , '');

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges.subscribe(hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find(hospital => hospital._id === hospitalId)!;
    });
  }

  cargarHospitales(): void {
    this.hospitalService.cargarHospitales().subscribe((hospitales: Hospital[]) => {
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
    
    if (this.medicoSeleccionado) { 
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(data).subscribe(resp => {
        Swal.fire('Actualizado', `El medico ${ nombre } se ha actualizado correctamente`, 'success');
      });
    } else {
      this.medicoService.crearMedico({ nombre, hospital }).subscribe((resp: any) => {
        Swal.fire('Creado', `El medico ${ nombre } se ha creado correctamente`, 'success');
        this.router.navigateByUrl(`/dashboard/medico/${ resp.medico.uid }`);
      });
    }
  }
}
