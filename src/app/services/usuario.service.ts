import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { loginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';

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
  
  validarToken(): Observable<boolean> {
    
    return this.http.get(`${ baseUrl }/login/renew`, { headers: { 'x-token': this.token } })
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
      role: this.usuario.role || 'USER_ROLE'
    }
    return this.http.put(`${ baseUrl }/usuarios/${ this.uid }`, data, { headers: { 'x-token': this.token} });
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
}
