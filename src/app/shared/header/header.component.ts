import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Usuario } from '@models/usuario.model';
import { TranslateService } from '@ngx-translate/core';
import { UsuarioService } from '@services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public usuario: Usuario;
  public lang: string = 'flag-icon flag-icon-us';
  
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    public translate: TranslateService
  ) {
    this.usuario = usuarioService.usuario;
  }
  
  ngOnInit(): void {
    if (localStorage.getItem('lang') === 'en') {
      this.setLang('en');
    } else {
      this.setLang('es');
    }
  }

  logout(): void {
    this.usuarioService.logout();
  }

  buscar(termino: string): void {
    if (termino.length === 0) {
      this.router.navigateByUrl('dashboard');
    } else {
      this.router.navigateByUrl(`/dashboard/busqueda/${ termino }`);
    }
  }

  setLang(value: string): string {
    if (value === 'en') {
      this.translate.use(value);
      localStorage.setItem('lang', value);
      return this.lang = 'flag-icon flag-icon-us';
    } else {
      this.translate.use(value);
      localStorage.setItem('lang', value);
      return this.lang = 'flag-icon flag-icon-es';
    }
  }
}
