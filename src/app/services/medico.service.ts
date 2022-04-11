import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

import { Medico } from '@models/medico.model';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return sessionStorage.getItem('token') || '';
  }
  
  get headers(): any {
    return { headers: { 'x-token': this.token, } };
  }

  cargarMedicos(): Observable<Medico[]> {
    const url: string = `${ baseUrl }/medicos`;

    return this.http.get(url, this.headers)
                .pipe(
                  map<any, Medico[]>((resp: { ok: boolean, message: string, medicos: Medico[] }) => resp.medicos)
                );
  }

  cargarMedicoPorId(uid: string): Observable<Medico> {
    const url: string = `${ baseUrl }/medicos/${ uid }`;

    return this.http.get(url, this.headers)
                .pipe(
                  map<any, Medico>((resp: { ok: boolean, message: string, medico: Medico }) => resp.medico)
                );
  }

  crearMedico(medico: { nombre: string, hospital: string }): Observable<ArrayBuffer> {
    const url: string = `${ baseUrl }/medicos`;

    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico): Observable<ArrayBuffer> {
    const url: string = `${ baseUrl }/medicos/${ medico._id }`;
    const { nombre, hospital } = medico;

    return this.http.put(url, { nombre, hospital }, this.headers);
  }

  borrarMedico(uid: string): Observable<ArrayBuffer> {
    const url: string = `${ baseUrl }/medicos/${ uid }`;

    return this.http.delete(url, this.headers);
  }
}
