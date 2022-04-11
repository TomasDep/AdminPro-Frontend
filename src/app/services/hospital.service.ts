import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { Hospital } from '@models/hospital.model';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return sessionStorage.getItem('token') || '';
  }
  
  get headers(): any {
    return { headers: { 'x-token': this.token, } };
  }

  cargarHospitales(): Observable<Hospital[]> {
    const url: string = `${ baseUrl }/hospitales`;

    return this.http.get(url, this.headers)
                .pipe(
                  map<any, Hospital[]>((resp: { ok: boolean, message: string, hospitales: Hospital[] }) => resp.hospitales)
                );
  }

  crearHospitales(nombre: string): Observable<ArrayBuffer> {
    const url: string = `${ baseUrl }/hospitales`;

    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospitales(uid: string, nombre: string): Observable<ArrayBuffer> {
    const url: string = `${ baseUrl }/hospitales/${ uid }`;

    return this.http.put(url, { nombre }, this.headers);
  }

  borrarHospitales(uid: string): Observable<ArrayBuffer> {
    const url: string = `${ baseUrl }/hospitales/${ uid }`;

    return this.http.delete(url, this.headers);
  }
}
