import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  constructor(private http:HttpClient) { }
  
  get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
    );
  }

  buscar(tipo: 'usuarios'|'medicos'|'hospitales', termino: string) {
    const url = `${ baseUrl }/todo/coleccion/${ tipo }/${ termino }`;
    return this.http.get<any []>(url, this.headers)
                .pipe(
                  map((resp: any) => {
                    switch (tipo) {
                      case 'usuarios':
                        return this.transformarUsuarios(resp.resultados);                    
                      default:
                        return [];
                    }
                  })
                );
  }
}
