import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { Usuario } from '@models/usuario.model';
import { UsuarioService, FileUploadsService } from '@services/index';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public imgTemp: any = '';
  public placeholderName: string = '';
  public placeholderEmail: string = '';
  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;

  constructor(
    private formBuilder: FormBuilder, 
    private usuarioService: UsuarioService,
    private FileUploadsService: FileUploadsService,
    public translate: TranslateService
  ) { 
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.formBuilder.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
    
    this.translate.get("PERFIL.FORM.PLACEHOLDER").subscribe(resp => {
      this.placeholderName = resp.NAME;
      this.placeholderEmail = resp.EMAIL;
    });
  }

  actualizarPerfil(): void {
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe({
      next: resp => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        this.translate.get("PERFIL.SWAL.UPDATE").subscribe(resp => {
          Swal.fire(resp.TITLE, resp.TEXT, 'success');
        });
      },
      error: error => {
        this.translate.get("PERFIL.SWAL.ERROR").subscribe(resp => {
          Swal.fire(resp.TITLE, error.error.message, 'error');
        });
      }
    });
  }

  cambiarImagen(event: any): any {
    const file = event.target.files[0];
    this.imagenSubir = file;

    if (!file) { 
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

    return this.imgTemp;
  }

  subirImagen(): void {
    this.FileUploadsService
        .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
        .then(img => {
          this.usuario.img = img;
          this.translate.get("PERFIL.SWAL.IMAGE.UPDATE").subscribe(resp => {
            Swal.fire(resp.TITLE, resp.TEXT, 'success');
          });
        }).catch(error => {
          console.log(error);
          this.translate.get("PERFIL.SWAL.IMAGE.ERROR").subscribe(resp => {
            Swal.fire(resp.TITLE, resp.TEXT, 'error');
          });
        });
  }
}
