import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { Usuario } from '@models/usuario.model';
import { UsuarioService } from '@services/usuario.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public usuario: Usuario;
  public lang: string = 'flag-icon flag-icon-us';
  public placeholderSearch: string = '';
  
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    public translate: TranslateService
  ) {
    this.usuario = usuarioService.usuario;
  }
  
  ngOnInit(): void {
    this.translate.get('SEARCH.PLACEHOLDER').subscribe(resp => {
      this.placeholderSearch = resp;
    });
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
}
