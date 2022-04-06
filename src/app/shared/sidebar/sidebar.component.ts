import { Component } from '@angular/core';

import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent  {
  public usuario: Usuario;
  public menuItems: any[] = [];

  constructor(private usuarioService: UsuarioService, public sidebarService: SidebarService) { 
    this.usuario = usuarioService.usuario;
    this.menuItems = sidebarService.menu;
  }
}
