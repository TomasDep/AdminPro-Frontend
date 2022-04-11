import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '@env/environment';

const baseUrl: string = environment.baseUrl;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {
  transform(img: string, tipo: 'usuarios'|'medicos'|'hospitales'): string {
    if (!img) {
      return `${ baseUrl }/uploads/${ tipo }/no-image`

    } else if (img?.includes('https')) {
      return img;

    } else if (img) {
      return `${ baseUrl }/uploads/${ tipo }/${ img }`
      
    } else {
      return `${ baseUrl }/uploads/${ tipo }/no-image`
    }
  }
}
