import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { environment } from '@env/environment';

import { Medico } from '@models/medico.model';
import { ITotalMedicos } from '@interfaces/totalModels.interface';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  public totalMedicos: number = 0;

  constructor(private http: HttpClient) { }

  get token(): string {
    return sessionStorage.getItem('token') || '';
  }
  
  get headers(): object {
    return { headers: { 'x-token': this.token } };
  }

  cargarMedicos(desde: number = 0): Observable<Medico[]> {
    const url: string = `${ baseUrl }/medicos?desde=${ desde }`;

    return this.http.get(url, this.headers)
                .pipe(
                  delay(1500),
                  map<any, Medico[]>(resp =>{
                    this.totalMedicos = resp.total;
                    return resp.medicos;
                  })
                );
  }

  cargaTotalMedicos(): Observable<number> {
    const url: string = `${ baseUrl }/medicos/total`;

    return this.http.get<ITotalMedicos>(url, this.headers)
                .pipe(
                  map(resp => resp.medicos)
                );
  }
  
  cargarMedicoPorId(uid: string): Observable<Medico> {
    const url: string = `${ baseUrl }/medicos/${ uid }`;

    return this.http.get(url, this.headers)
                .pipe(
                  map<any, Medico>((resp: { ok: boolean, message: string, medico: Medico }) => resp.medico)
                );
  }

  crearMedico(medico: { nombre: string, hospital: string }): Observable<Object> {
    const url: string = `${ baseUrl }/medicos`;

    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico(medico: Medico): Observable<Object> {
    const url: string = `${ baseUrl }/medicos/${ medico._id }`;
    const { nombre, hospital } = medico;

    return this.http.put(url, { nombre, hospital }, this.headers);
  }

  borrarMedico(uid: string): Observable<Object> {
    const url: string = `${ baseUrl }/medicos/${ uid }`;

    return this.http.delete(url, this.headers);
  }
}
