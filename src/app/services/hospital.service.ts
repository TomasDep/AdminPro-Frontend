import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { Hospital } from '@models/hospital.model';
import { ITotalHospitales } from '@interfaces/totalModels.interface';

const baseUrl: string = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  public totalHospitales: number = 0;

  constructor(private http: HttpClient) { }

  get token(): string {
    return sessionStorage.getItem('token') || '';
  }
  
  get headers(): object {
    return { headers: { 'x-token': this.token, } };
  }

  cargarHospitales(desde: number = 0): Observable<Hospital[]> {
    const url: string = `${ baseUrl }/hospitales?desde=${ desde }`;

    return this.http.get(url, this.headers)
                .pipe(
                  delay(1500),
                  map<any, Hospital[]>(resp => { 
                    this.totalHospitales = resp.total;
                    return resp.hospitales;
                  })
                );
  }

  cargaTotalHosptiales(): Observable<number> {
    const url = `${ baseUrl }/hospitales/total`;

    return this.http.get<ITotalHospitales>(url, this.headers)
              .pipe(
                map(resp => resp.hospitales)
              );
  }

  obtenerTotal(total: number): number {
    return total;
  } 

  crearHospitales(nombre: string): Observable<Object> {
    const url: string = `${ baseUrl }/hospitales`;

    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospitales(uid: string, nombre: string): Observable<Object> {
    const url: string = `${ baseUrl }/hospitales/${ uid }`;

    return this.http.put(url, { nombre }, this.headers);
  }

  borrarHospitales(uid: string): Observable<Object> {
    const url: string = `${ baseUrl }/hospitales/${ uid }`;

    return this.http.delete(url, this.headers);
  }
}
