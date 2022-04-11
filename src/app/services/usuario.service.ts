import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { environment } from '@env/environment';

import { Usuario } from '@models/usuario.model';
import { RegisterForm, loginForm, CargarUsuarios } from '@interfaces/index';

const baseUrl = environment.baseUrl;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public auth2: any;
  public usuario: Usuario = new Usuario('', '', '', 'USER_ROLE');

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private ngZone: NgZone
  ) { 
    this.googleInit();
  }

  get token(): string {
    return sessionStorage.getItem('token') || '';
  }

  get rolUsuario(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }
  
  get headers(): object {
    return { headers: { 'x-token': this.token } };
  }

  setStorage(token: string, menu: any): void {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('menu', JSON.stringify(menu));
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${ baseUrl }/login/renew`, this.headers)
                    .pipe(
                      map((resp: any) => {
                        const { email, google, nombre, role, img = '', uid } = resp.usuario;
                        this.usuario = new Usuario(uid, nombre, email, role, '', img, google);
                        this.setStorage(resp.token, resp.menu)
                        return true;
                      }),
                      catchError(error => of(false))
                    );
  }

  crearUsuario(formData: RegisterForm): Observable<any> {
    return this.http.post(`${ baseUrl }/usuarios`, formData)
                .pipe(
                  tap((resp: any) => {
                    this.setStorage(resp.token, resp.menu)
                  })
                );
  }

  actualizarPerfil(
    data: { email: string, nombre: string, role: string }
  ): Observable<Object> {
    data = {
      ...data,
      role: this.usuario.role!
    }

    return this.http.put(`${ baseUrl }/usuarios/${ this.uid }`, data, this.headers);
  }

  login(formData: loginForm): Observable<any> {
    return this.http.post(`${ baseUrl }/login`, formData)
                .pipe(
                  tap((resp: any) => {
                    this.setStorage(resp.token, resp.menu)
                  })
                );
  }

  loginGoogle(token: any): Observable<any> {
    return this.http.post(`${ baseUrl }/login/google`, { token })
                .pipe(
                  tap((resp: any) => {
                    this.setStorage(resp.token, resp.menu)
                  })
                );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('menu');
  
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  googleInit(): Promise<any> {
    return new Promise((resolve: any) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '712613946451-4b0rmmebdf0bfjb5ic4bqndhr5qh2n3v.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
      });
      resolve();
    });
  }

  cargarUsuarios(desde: number = 0): Observable<{ total: number; usuarios: Usuario[]; }> {
    const url = `${ baseUrl }/usuarios?desde=${ desde }`;
    
    return this.http.get<CargarUsuarios>(url, this.headers)
                    .pipe(
                      delay(1500),
                      map(resp => {
                        const usuarios = resp.usuarios.map(
                          user => new Usuario( user.uid, user.nombre, user.email, user.role, '', user.img, user.google)
                        );
                        return {
                          total: resp.total,
                          usuarios
                        }
                      })
                    );
  }

  eliminarUsuario(usuario: Usuario): Observable<CargarUsuarios> {
    const url = `${ baseUrl }/usuarios/${ usuario.uid }`;
    
    return this.http.delete<CargarUsuarios>(url, this.headers);
  }

  guardarUsuario(usuario: Usuario): Observable<Object> {
    return this.http.put(`${ baseUrl }/usuarios/${ usuario.uid }`, usuario, this.headers);
  }
}
