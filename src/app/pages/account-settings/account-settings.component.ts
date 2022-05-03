import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { Usuario } from '@models/usuario.model';
import { SettingsService, UsuarioService } from '@services/index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  public themeColor: string = 'default';
  public usuario: Usuario = new Usuario('', '', '', 'USER_ROLE', 'en', '');
  public linkTheme: Element | null = document.querySelector('#theme');
  public langForm: FormGroup = this.formBuilder.group({
    lang: [localStorage.getItem('lang')]
  });

  constructor(
    private settingsService: SettingsService,
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    public translate: TranslateService
  ) {
    this.usuario = this.usuarioService.usuario;
  }

  ngOnInit(): void {
    this.settingsService.checkCurrentTheme();
    this.translate.use(localStorage.getItem('lang') || 'en');
    this.themeColor = localStorage.getItem('themeButton') || 'default';
  }
  
  changeTheme(theme: string): void {
    this.settingsService.changeTheme(theme);
    this.themeColor = localStorage.getItem('themeButton') || 'default';
  }

  changeLang(): void {
    this.usuario.lang = this.langForm.get('lang')?.value;
    localStorage.setItem('lang', this.usuario.lang);
    this.usuarioService.guardarUsuario(this.usuario).subscribe(resp => {
      this.translate.get('SETTINGS.LANG.SWAL').subscribe(lang => {
        Swal.fire({ 
          title: lang.TITLE, 
          text: lang.TEXT, 
          icon: 'success', 
          showConfirmButton: false 
        });
        window.location.reload();
      });
    });
  }
}