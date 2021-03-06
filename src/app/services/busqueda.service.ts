import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

import { Usuario, Hospital, Medico } from '@models/index';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  constructor(private http:HttpClient) { }
  
  get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  get headers(): any {
    return { headers: { 'x-token': this.token } };
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.uid, user.nombre, user.email, user.role, user.lang, '', user.img, user.google)
    );
  }

  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados;
  }

  private transformarMedicos(resultados: any[]): Medico[] {
    return resultados;
  }

  busquedaGlobal(termino: string): Observable<ArrayBuffer> {
    const url = `${ baseUrl }/todo/${ termino }`;
    
    return this.http.get(url, this.headers);
  }

  buscarUsuarios(tipo: string, termino: string): Observable<Usuario[]> {
    const url = `${ baseUrl }/todo/coleccion/${ tipo }/${ termino }`;
    
    return this.http.get<any[]>(url, this.headers)
                .pipe(
                  map((resp: any) => {
                    if (tipo.includes('usuarios')) {
                      return this.transformarUsuarios(resp.resultados);
                    } else {
                      return [];
                    }
                  })
                );
  }

  buscarHospitales(tipo: string, termino: string): Observable<Hospital[]> {
    const url = `${ baseUrl }/todo/coleccion/${ tipo }/${ termino }`;
    
    return this.http.get<any[]>(url, this.headers)
                .pipe(
                  map((resp: any) => {
                    if (tipo.includes('hospitales')) {
                      return this.transformarHospitales(resp.resultados);
                    } else {
                      return [];
                    }
                  })
                );
  }

  buscarMedicos(tipo: string, termino: string): Observable<Medico[]> {
    const url = `${ baseUrl }/todo/coleccion/${ tipo }/${ termino }`;
    
    return this.http.get<any[]>(url, this.headers)
                .pipe(
                  map((resp: any) => {
                    if (tipo.includes('medicos')) {
                      return this.transformarMedicos(resp.resultados);
                    } else {
                      return [];
                    }
                  })
                );
  }
}
