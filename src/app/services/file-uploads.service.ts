import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class FileUploadsService {

  constructor() { }

  async actualizarFoto(
    archivo: File, 
    tipo: string,
    id: string
  ) {
    try {
      const url = `${ baseUrl }/uploads/${ tipo }/${ id }`;
      const formData = new FormData();

      formData.append('imagen', archivo);

      const resp = await fetch(url, { 
        method: 'PUT', 
        headers: { 'x-token': sessionStorage.getItem('token') || '' },
        body: formData
      });

      const data = await resp.json();
      
      if (data.ok) {
        return data.nombreArchivo
      } else {
        console.log(data.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
