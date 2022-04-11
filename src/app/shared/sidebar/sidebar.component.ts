import { Component } from '@angular/core';

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
    public sidebarService: SidebarService
  ) { 
    this.usuario = usuarioService.usuario;
    this.menuItems = sidebarService.menu;
  }
}
