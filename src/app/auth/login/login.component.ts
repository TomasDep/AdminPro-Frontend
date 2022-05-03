import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { UsuarioService } from '@services/usuario.service';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  public auth2: any;
  public placeholderEmail: string = '';
  public placeholderPassword: string = '';
  public lang: string = localStorage.getItem('lang') || '';
  public formSubmitted: boolean = false;
  public loginForm: FormGroup = this.formBuilder.group({
    email: [
             sessionStorage.getItem('email') || '', 
             [ Validators.required, Validators.email ]
          ],
    password: [ '', Validators.required ],
    remember: [ false ],
    lang: [ this.lang ]
  });

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder, 
    private usuarioService: UsuarioService,
    private ngZone: NgZone,
    public translate: TranslateService
  ) { }
  
  ngOnInit(): void {
    this.getLang();
    this.renderButton();
    
    this.translate.get('LOGIN.PLACEHOLDER').subscribe(resp => {
      this.placeholderEmail = resp.EMAIL;
      this.placeholderPassword = resp.PASSWORD;
    });
  }
  
  getLang(): void {
    if (localStorage.getItem('lang')) {
      this.translate.use(localStorage.getItem('lang') || 'en');
    } else if (window.navigator.language.includes('es')) {
      localStorage.setItem('lang', 'es');
      this.translate.use('es');
    } else {
      localStorage.setItem('lang', 'en');
      this.translate.use('en');
    }

    this.lang = localStorage.getItem('lang') || 'en';
  }

  login(): void {
    this.usuarioService.login(this.loginForm.value)
        .subscribe({
          next: (resp: any) => {
            if (this.loginForm.get('remember')?.value) {
              sessionStorage.setItem('email', this.loginForm.get('email')!.value);
            } else {
              sessionStorage.removeItem('email');
            }
            this.router.navigateByUrl('/');
          },
          error: (error: any) => this.errorMessages(error)
        });
  }

  onSuccess(googleUser: any): void {
    var id_token = googleUser.getAuthResponse().id_token;
  }

  onFailure(error: any): void {
    console.log(error);
  }

  renderButton(): void {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();
  }

  async startApp(): Promise<void> {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  };

  attachSignin(element: any): void {
    this.auth2.attachClickHandler(element, {},
      (googleUser: any) => {
        const id_token = googleUser.getAuthResponse().id_token;
        this.usuarioService.loginGoogle(id_token).subscribe(resp => {
          this.ngZone.run(() => {
            this.router.navigateByUrl('/');
          })
        });
      }, (error: any) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }

  errorMessages(e: any): void {
    if (e.error.errors) {
      const { email, password } = e.error.errors;
      if (email) {
        Swal.fire('Error', email.msg, 'error');
      } else if (password) {
        Swal.fire('Error', password.msg, 'error');
      }
    } else {
      Swal.fire('Error', e.error.message, 'error');
    }
  }
}
