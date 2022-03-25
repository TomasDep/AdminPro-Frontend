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
  public usuario: Usuario = new Usuario();
  public menuItems: any[] = [];

  constructor(private sidebarService: SidebarService, private usuarioService: UsuarioService) { 
    this.menuItems = sidebarService.menu;
    this.usuario = usuarioService.usuario;
  }
}
