import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Usuario } from '@models/usuario.model';
import { SidebarService, UsuarioService } from '@services/index';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent  {
  public usuario: Usuario;
  public menuItems: any[] = [];

  constructor(
    private usuarioService: UsuarioService, 
    public sidebarService: SidebarService,
    public translate: TranslateService
  ) { 
    this.usuario = usuarioService.usuario;
    this.menuItems = sidebarService.menu;
  }
}
