import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { FileUploadsService } from '../../services/file-uploads.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {
  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor(public modalImagenService: ModalImagenService, public fileUploadsService: FileUploadsService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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
    const id: string = this.modalImagenService.id;
    const tipo: string = this.modalImagenService.tipo;

    this.fileUploadsService
        .actualizarFoto(this.imagenSubir, tipo, id)
        .then(img => {
          Swal.fire('Guardado', 'Imagen del usuario actualizada', 'success');
          this.modalImagenService.nuevaImagen.emit(img);
          this.cerrarModal();
        }).catch(error => {
          console.log(error);
          Swal.fire('Error','No se pudo subir la imagen', 'error');
        });
  }
}
