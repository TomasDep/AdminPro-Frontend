import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Usuario } from '../models/usuario.model';
import { RegisterForm } from '../interfaces/register-form.interface';
import { loginForm } from '../interfaces/login-form.interface';
import { CargarUsuarios } from '../interfaces/cargar-usuarios.interface';

const baseUrl = environment.baseUrl;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public auth2: any;
  public usuario: Usuario = new Usuario();

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

  get uid(): string {
    return this.usuario.uid || '';
  }
  
  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  validarToken(): Observable<boolean> {
    
    return this.http.get(`${ baseUrl }/login/renew`, this.headers)
                    .pipe(
                      map((resp: any) => {
                        const { email, google, nombre, role, img = '', uid } = resp.usuario;
                        this.usuario = new Usuario(nombre, email, '', img, google,role, uid);
                        sessionStorage.setItem('token', resp.token);
                        return true;
                      }),
                      catchError(error => of(false))
                    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${ baseUrl }/usuarios`, formData)
                .pipe(
                  tap((resp: any) => {
                    sessionStorage.setItem('token', resp.token);
                  })
                );
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string }) {
    data = {
      ...data,
      role: this.usuario.role!
    }

    return this.http.put(`${ baseUrl }/usuarios/${ this.uid }`, data, this.headers);
  }

  login(formData: loginForm) {
    return this.http.post(`${ baseUrl }/login`, formData)
                .pipe(
                  tap((resp: any) => {
                    sessionStorage.setItem('token', resp.token);
                  })
                );
  }

  loginGoogle(token: any) {
    return this.http.post(`${ baseUrl }/login/google`, { token })
                .pipe(
                  tap((resp: any) => {
                    sessionStorage.setItem('token', resp.token);
                  })
                );
  }

  logout() {
    sessionStorage.removeItem('token');
    
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  googleInit() {
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

  cargarUsuarios(desde: number = 0) {
    const url = `${ baseUrl }/usuarios?desde=${ desde }`;
    
    return this.http.get<CargarUsuarios>(url, this.headers)
                    .pipe(
                      delay(1500),
                      map(resp => {
                        const usuarios = resp.usuarios.map(
                          user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                        );
                        return {
                          total: resp.total,
                          usuarios
                        }
                      })
                    );
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${ baseUrl }/usuarios/${ usuario.uid }`;
    return this.http.delete<CargarUsuarios>(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(`${ baseUrl }/usuarios/${ usuario.uid }`, usuario, this.headers);
  }
}
