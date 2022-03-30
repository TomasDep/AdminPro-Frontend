import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

import { Medico } from '../models/medico.model';
import { Observable } from 'rxjs';

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

  crearMedico(medico: { nombre: string, hospital: string }) {
    const url: string = `${ baseUrl }/medicos`;
    console.log('servicio', medico);
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico) {
    const url: string = `${ baseUrl }/medicos/${ medico.uid }`;

    return this.http.put(url, { medico }, this.headers);
  }

  borrarMedico(uid: string) {
    const url: string = `${ baseUrl }/medicos/${ uid }`;

    return this.http.delete(url, this.headers);
  }

}
