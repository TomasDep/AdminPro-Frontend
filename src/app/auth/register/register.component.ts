import { Component, OnInit } from '@angular/core';
import { 
  AbstractControl,
  FormControl,
  FormGroup, 
  Validators, 
  ValidatorFn 
} from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

import { UsuarioService } from '@services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public placeholderName: string = '';
  public placeholderEmail: string = '';
  public placeholderPassword: string = '';
  public placeholderConfirm: string = '';
  public formSubmitted: boolean = true;
  public registerForm: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required),
    terminos: new FormControl(false, Validators.required),
  }, { validators: this.contrasenasIguales('password', 'passwordConfirm') });

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    public translate: TranslateService
  ) { }
  
  ngOnInit(): void {
    this.translate.get('REGISTER.PLACEHOLDER').subscribe(resp => {
       this.placeholderName = resp.NAME;
       this.placeholderEmail = resp.EMAIL;
       this.placeholderPassword = resp.PASSWORD;
       this.placeholderConfirm = resp.CONFIRM;
    });
  }

  crearUsuario(): void {
    this.formSubmitted = true;
    
    if (this.registerForm.invalid) {
      return;
    }

    this.usuarioService.crearUsuario(this.registerForm.value)
        .subscribe({
          next: (resp: any) => this.router.navigateByUrl('/'),
          error: (err: any) => Swal.fire('Error', err.error.message, 'error')
        });
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  aceptarTerminos(): boolean {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  contrasenasInvalidas(): boolean {
    const password = this.registerForm.get('password')?.value;
    const passwordConfirm = this.registerForm.get('passwordConfirm')?.value;

    if (password !== passwordConfirm && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  contrasenasIguales(password: string, passwordConfirm: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const passControl = controls.get(password);
      const passConfirmControl = controls.get(passwordConfirm);

      if (passControl?.value === passConfirmControl?.value) {
        return null;
      } else {
        controls.get(passwordConfirm)?.setErrors({matching: true});
        return { matching: true };
      }
    }
  }
}
