import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { Usuario } from '@models/usuario.model';
import { UsuarioService, BusquedaService, ModalImagenService } from '@services/index';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  private tipo: string = 'usuarios';
  public placeholderSearch: string = '';  
  public themeColor: string = 'default';
  public cargando: boolean = true;
  public totalUsuarios: number = 0;
  public desde: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs: Subscription = new Subscription();

  constructor(
    private usuarioService: UsuarioService, 
    private busquedaService: BusquedaService,
    private modalImagenService: ModalImagenService,
    public translate: TranslateService
  ) { }
  
  ngOnInit(): void {
    this.cargarUsuarios();
    
    this.themeColor = localStorage.getItem('themeButton') || 'default';
    
    this.imgSubs = this.modalImagenService.nuevaImagen
                        .pipe(delay(300))
                        .subscribe(img => this.cargarUsuarios());

    this.translate.get("MAINTAINERS.USERS.PLACEHOLDER.SEARCH").subscribe((resp: string) => {
      this.placeholderSearch = resp;      
    })
  }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe(({total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina(valor: number): void {
    this.desde += valor;
    
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string): Usuario[] {
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    } else {
      this.busquedaService.buscarUsuarios(this.tipo, termino).subscribe(resp => {
        this.usuarios = resp;
        return this.usuarios;
      });
    }
    return [];
  }

  eliminarUsuario(usuario: Usuario): any {
    if (usuario.uid === this.usuarioService.uid) {
      this.translate.get("MAINTAINERS.USERS.SWAL.ERROR").subscribe(resp => {
        return Swal.fire({
          title: resp.TITLE, 
          text: resp.TEXT, 
          icon: 'error',
          confirmButtonColor: this.confirmButtonColorTheme()
        });
      });
    } else {
      this.translate.get("MAINTAINERS.USERS.SWAL.DELETE").subscribe(resp => {
        const title: string = resp.TITLE;
        const confirmButtonText: string = resp.BUTTON.CONFIRM;
        const cancelButtonText: string = resp.BUTTON.CANCEL;
        const successTitle: string = resp.SUCCESS.TITLE;
        let text: string = resp.TEXT;
        let successText: string = resp.SUCCESS.TEXT;

        text = text.replace('param', usuario.nombre);
        successText = successText.replace('param', usuario.nombre);
        
        return Swal.fire({
          title,
          text,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: this.confirmButtonColorTheme(),
          cancelButtonColor: '#d33',
          confirmButtonText,
          cancelButtonText
        }).then((result) => {
          if (result.isConfirmed) {
            this.usuarioService.eliminarUsuario(usuario).subscribe(resp => {
              this.cargarUsuarios();
              Swal.fire({
                title: successTitle,
                text: successText,
                icon: 'success',
                confirmButtonColor: this.confirmButtonColorTheme()
              }
              );
            });
          }
        });
      });
    }
  }

  cambiarRole(usuario: Usuario): void {
    this.usuarioService.guardarUsuario(usuario).subscribe();
  }

  abrirModal(usuario: Usuario): void {
    this.modalImagenService.abrirModal(this.tipo, usuario.uid!, usuario.img);
  }

  confirmButtonColorTheme(): string {
    switch (this.themeColor) {
      case 'red':
        return '#ef5350';
      case 'red-dark':
        return '#ef5350';

      case 'green':
        return '#06d79c';
      case 'green-dark':
        return '#06d79c';

      case 'blue':
        return '#1976d2';
      case'blue-dark':
        return '#1976d2';

      case 'purple':
        return '#7460ee';
      case 'purple-dark':
        return '#7460ee';

      case 'megna':
        return '#56c0d8';
      case 'megna-dark':
        return '#56c0d8';

      default:
        return '#2a3e52';
    }
  }
}
