import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuncionesService } from '../../../../Services/funciones.service';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ActualizarContrasena, ValidarToken } from '../../../../Interfaces/contrasena.interface';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

export function CaracteresContrasenaValidacion(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
  
    if(!value){
      return null;
    }

    const MayusculaEnCualquierParte = /[A-Z]/.test(value);
    const AlmenosDosNumeros = /\d.*\d/.test(value);
    const Caracteres = value.length >= 8;

    const valid = MayusculaEnCualquierParte  && AlmenosDosNumeros && Caracteres;

    if(!valid) {
      return {
        contrasenaVal: {
          MayusculaEnCualquierParte : MayusculaEnCualquierParte,
          AlmenosDosNumeros: AlmenosDosNumeros,
          Caracteres: Caracteres
        }
      };
    }
     return null;
  };
}

export function MatchContrasenaValidacion(contrasena: string, contrasenaConfirmar: string): ValidatorFn 
{
  return (formGroup: AbstractControl): {[key: string]: any } | null => {
      const contrasenaControl = formGroup.get(contrasena);
      const contrasenaConfirmarControl = formGroup.get(contrasenaConfirmar);

      if (contrasenaControl && contrasenaConfirmarControl && contrasenaControl.value !== contrasenaConfirmarControl.value) {
        return { contrasenaNoMatch: true };
      }
      return null;
    };
}

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    RouterLink, 
    RouterOutlet,
    LottieComponent
  ],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent implements OnInit {
  
  datos: any;
  nuevosDatos: any;
  formContrasena = false;
  email: string | null= null;
  token: string | null = null;
  imagenPerfil: string | null = null;
  mostrarAnimacionExito = false;

  ngOnInit(): void {

    this.email = this.Rutas.snapshot.queryParamMap.get('email');
    this.token = this.Rutas.snapshot.queryParamMap.get('token');

    if(this.email && this.token) {
      this.Validar(this.email, this.token);
    }

    this.nuevosDatos = this.form.group({
      contrasena: ['', [Validators.required, CaracteresContrasenaValidacion()]],
      contrasenaValidar: ['',Validators.required]
    },{
      validator: MatchContrasenaValidacion('contrasena','contrasenaValidar')
    });
  }

  animacionError: AnimationOptions = {
    path: '/Animaciones/Error.json'
  }

  animationExito: AnimationOptions = {
    path: '/Animaciones/Correcto.json'
  }

  constructor(private form: FormBuilder, private Funciones: FuncionesService, private Rutas: ActivatedRoute, private redireccion: Router){}

  Validar(email: string, token: string) : void {

     console.log(this.email, this.email);

    const data: ValidarToken = {
      email: email!,
      token: token!
    }

    this.Funciones.ValidarToken(data).subscribe({
      next: (result) => {
        
        if(result.tipoError === 2 || result.tipoError === 1 || result.tipoError === 3) {
          this.formContrasena = false;
        }
        else {
        this.formContrasena = true;
        this.imagenPerfil = result.imagen;
        }
      },
      error: (err) => {
        this.formContrasena = false;
        console.log("Ocurrio un error.", err);
      }
    });
  }



  NuevaContra() : void {

    const data: ActualizarContrasena = {
      contrasena: this.nuevosDatos.value.contrasena!,
      email: this.email!
    }

    this.Funciones.ActualizarContrasena(data).subscribe({
      next: (result) => {

        this.mostrarAnimacionExito = true;

        setTimeout(() => {
          this.redireccion.navigate(['/Login']);
        }, 1800);
      },
      error: (err) => {
        console.log("Ocurrio un error.", err);
      }
    });
  }


  

}
