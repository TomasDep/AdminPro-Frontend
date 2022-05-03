import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { environment } from '@env/environment';

import { Usuario } from '@models/usuario.model';
import { IRegisterForm, ILoginForm, ICargarUsuarios, ITotalUsuarios } from '@interfaces/index';

const baseUrl = environment.baseUrl;

declare const gapi: any;

interface ILangForm {
  lang: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public auth2: any;
  public usuario: Usuario = new Usuario('', '', '', 'USER_ROLE', 'en');
  public totalUsuarios: number = 0;

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

  setLang(): void {
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', 'en');
    }
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${ baseUrl }/login/renew`, this.headers)
                    .pipe(
                      map((resp: any) => {
                        const { email, google, nombre, role, lang, img = '', uid } = resp.usuario;
                        this.usuario = new Usuario(uid, nombre, email, role, lang, '', img, google);
                        this.setStorage(resp.token, resp.menu)
                        return true;
                      }),
                      catchError(error => of(false))
                    );
  }

  crearUsuario(formData: IRegisterForm): Observable<any> {
    return this.http.post(`${ baseUrl }/usuarios`, formData)
                .pipe(
                  tap((resp: any) => {
                    this.setStorage(resp.token, resp.menu);
                    this.setLang();
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

  login(formData: ILoginForm): Observable<any> {
    return this.http.post(`${ baseUrl }/login`, formData)
                .pipe(
                  tap((resp: any) => {
                    this.setStorage(resp.token, resp.menu);
                    this.setLang();
                  })
                );
  }

  loginGoogle(token: any): Observable<any> {
    return this.http.post(`${ baseUrl }/login/google`, { token })
                .pipe(
                  tap((resp: any) => {
                    this.setStorage(resp.token, resp.menu);
                    this.setLang();
                  })
                );
  }

  logout(): void {
    sessionStorage.clear();
  
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
    
    return this.http.get<ICargarUsuarios>(url, this.headers)
                    .pipe(
                      delay(1500),
                      map(resp => {
                        const usuarios = resp.usuarios.map(
                          user => new Usuario( 
                                               user.uid, 
                                               user.nombre, 
                                               user.email, 
                                               user.role,
                                               user.lang,
                                               '', 
                                               user.img, 
                                               user.google
                                              ));
                        this.totalUsuarios = resp.total;
                        return {
                          total: resp.total,
                          usuarios
                        };
                      })
                    );
  }

  cargaTotalUsuarios(): Observable<number> {
    const url = `${ baseUrl }/usuarios/total`;

    return this.http.get<ITotalUsuarios>(url, this.headers)
              .pipe(
                map(resp => resp.usuarios)
              );
  }

  eliminarUsuario(usuario: Usuario): Observable<ICargarUsuarios> {
    const url = `${ baseUrl }/usuarios/${ usuario.uid }`;
    
    return this.http.delete<ICargarUsuarios>(url, this.headers);
  }

  guardarUsuario(usuario: Usuario): Observable<Object> {
    return this.http.put(`${ baseUrl }/usuarios/${ usuario.uid }`, usuario, this.headers);
  }
}
