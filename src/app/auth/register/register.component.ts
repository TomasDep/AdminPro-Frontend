import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public formSubmitted = true;
  public registerForm = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    passwordConfirm: ['', Validators.required],
    terminos: [false, Validators.required],
  }, {
    validators: this.contrasenasIguales('password', 'passwordConfirm')
  });

  constructor(
    private formBuilder: FormBuilder, 
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  crearUsuario() {
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }

    this.usuarioService.crearUsuario(this.registerForm.value)
        .subscribe(resp => {
          console.log('usuario creado');
          console.log(resp);
          this.router.navigateByUrl('/');
        }, (err) => {
          Swal.fire('Error', err.error.message, 'error');
        });
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo)?.invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  aceptarTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  contrasenasInvalidas() {
    const password = this.registerForm.get('password')?.value;
    const passwordConfirm = this.registerForm.get('passwordConfirm')?.value;

    if (password !== passwordConfirm && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }

  contrasenasIguales(password: string, passwordConfirm: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.get(password);
      const passConfirmControl = formGroup.get(passwordConfirm);

      if (passControl?.value === passConfirmControl?.value) {
        passConfirmControl?.setErrors(null);
      } else {
        passConfirmControl?.setErrors({ noEsIgual: true });
      }
    }
  }
}
