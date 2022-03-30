import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {
  public medicoForm!: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado!: Hospital;
  public medicoSeleccionado!: Medico;

  constructor(
    private fb: FormBuilder,
    private hospitalService: HospitalService,
    private medicoService: MedicoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges.subscribe(hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find(hospital => hospital.uid === hospitalId)!;
    });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe((hospitales: Hospital[]) => {
      this.hospitales = hospitales;
    });
  }

  guardarMedico() {
    const nombre: string = this.medicoForm.value.nombre;
    const hospital: string = this.medicoForm.value.hospital;
    this.medicoService.crearMedico({ nombre, hospital }).subscribe((resp: any) => {
      Swal.fire('Creado', `El medico ${ nombre } se ha creado correctamente`, 'success');
      this.router.navigateByUrl(`/dashboard/medico/${ resp.medico.uid }`);
    });
  }
}
