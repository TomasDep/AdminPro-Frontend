import { environment } from "@env/environment";

const baseUrl = environment.baseUrl;

export class Usuario {
  constructor (
    public uid: string,
    public nombre: string, 
    public email: string,
    public role: 'ADMIN_ROLE' | 'USER_ROLE',
    public password?: string,
    public img?: string,
    public google?: boolean
  ) { }

  get imagenUrl() {
    if (!this.img) {
      return `${ baseUrl }/uploads/usuarios/no-image`

    } else if (this.img?.includes('https')) {
      return this.img;

    } else if (this.img) {
      return `${ baseUrl }/uploads/usuarios/${ this.img }`
      
    } else {
      return `${ baseUrl }/uploads/usuarios/no-image`
    }
  }
}