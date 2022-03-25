import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FileUploadsService } from '../../services/file-uploads.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor(
    private formBuilder: FormBuilder, 
    private usuarioService: UsuarioService,
    private FileUploadsService: FileUploadsService
  ) { 
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.formBuilder.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(resp => {
      const { nombre, email } = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;
      Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
    }, (error) => {
      Swal.fire('Error', error.error.message, 'error');
    });
  }

  cambiarImagen(event: any) {
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

    return true;
  }

  subirImagen() {
    this.FileUploadsService
        .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid!)
        .then(img => {
          this.usuario.img = img;
          Swal.fire('Guardado', 'Imagen del usuario actualizada', 'success');
        }).catch(error => {
          console.log(error);
          Swal.fire('Error','No se pudo subir la imagen', 'error');
        });
  }
}
