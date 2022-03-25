import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl;

export class Usuario {
  constructor (
    public nombre?: string, 
    public email?: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string
  ) { }

  get imagenUrl() {
    if (this.img?.includes('https')) {
      return this.img;
    }

    if (this.img) {
      return `${ baseUrl }/uploads/usuarios/${ this.img }`
    }
    return `${ baseUrl }/uploads/usuarios/no-image`
  }
}