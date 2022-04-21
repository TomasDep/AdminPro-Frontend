import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

import { ModalImagenService, FileUploadsService } from '@services/index';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {
  public imagenSubir!: File;
  public imgTemp: any = '';
  public themeColor: string = 'default';

  constructor(
    public translate: TranslateService,
    public modalImagenService: ModalImagenService, 
    public fileUploadsService: FileUploadsService,
  ) { }
  
  ngOnInit(): void {
    this.themeColor = localStorage.getItem('themeButton') || 'default';
  }

  cerrarModal(): void {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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
    const id: string = this.modalImagenService.id;
    const tipo: string = this.modalImagenService.tipo;

    this.fileUploadsService
        .actualizarFoto(this.imagenSubir, tipo, id)
        .then(img => {
          this.translate.get('MODALIMAGEN.SWAL.SUCCESS').subscribe(resp => {
            Swal.fire(resp.TITLE, resp.TEXT, 'success');
            this.modalImagenService.nuevaImagen.emit(img);
            this.cerrarModal();
          });
        }).catch(error => {
          this.translate.get('MODALIMAGEN.SWAL.ERROR').subscribe(resp => {
            console.log(error);
            Swal.fire(resp.TITLE, resp.TEXT, 'error');
          });
        });
  }
}
