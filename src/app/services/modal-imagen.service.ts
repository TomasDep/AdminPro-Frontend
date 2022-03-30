import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {
  private _ocultarModal: boolean = true;
  public nuevaImagen: EventEmitter<string> = new EventEmitter();
  public tipo: string = '';
  public id: string = '';
  public img: string = '';

  constructor() { }

  get ocultarModal(): boolean {
    return this._ocultarModal;
  }
  
  abrirModal(tipo: string, id: string, img: string = 'no-img'): void {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    this.img = img;
    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${ baseUrl }/uploads/${ tipo }/${ img }`;
    }
  }

  cerrarModal(): void {
    this._ocultarModal = true;
  }
}
