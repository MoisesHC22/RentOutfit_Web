import { Component, OnInit,} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { RequerimientosIniciarSesion } from '../../../Interfaces/iniciarSesion.interface';
import { FuncionesService } from '../../../Services/funciones.service';
import { CommonModule } from '@angular/common';
import { CookieService} from 'ngx-cookie-service';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RequerimientoCorreo } from '../../../Interfaces/contrasena.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    LottieComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  
  Advertencia = faTriangleExclamation;

  datos: any;
  mensajeError: string | null = null;
  anuncioError = false;

  mostrarAnimacionExito = false;

  constructor(private rutas: Router, private form: FormBuilder, private funciones: FuncionesService, private cookie: CookieService){}
  
  ngOnInit(): void {
    this.datos = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  
  animationOptions: AnimationOptions = {
    path: '/Animaciones/Login.json'
  }

  animacionExitoOptions: AnimationOptions = {
    path: '/Animaciones/LoginCarga.json'
  }
 
  iniciarSesion(): void{
    const data: RequerimientosIniciarSesion = {
      email: this.datos.value.email!,
      contrasena: this.datos.value.contrasena!
    };

    this.funciones.IniciarSesion(data).subscribe({
      next: (response) => {
        this.funciones.Login(response.token);
        this.funciones.iniciarlizarEstadoSesion();
        this.mostrarAnimacionExito = true;

        setTimeout(() => {
          this.rutas.navigate(['/Cliente/home']);
        }, 1800);
      },
      error: (err) => {
        console.log('Ocurrio algo inesperado.');
        this.anuncioError = true;
      }
    });
  }
  
  RecuperarContrasena(email: string) {
    
    if(email){

      const data: RequerimientoCorreo = {
        email: email!
      }
      console.log(email);

      this.funciones.EnviarCorreo(data).subscribe({
        next: (response) => {
          this.rutas.navigate(['/SeEnvioCorreo', email]);
        },
        error: (err) => {
          console.log('Ocurrio algo inesperado.', err);
        }
      });
    } else {
      console.log('Por favor, ingrese un correo valido.');
    }
  }




  
  cerrarModal() : void {
    this.anuncioError = false;
  }
  
  ValidarCorreo(event: KeyboardEvent){
    const charCode = event.charCode || event.keyCode;
    const charStr = String.fromCharCode(charCode);

    const regex = /^[a-zA-Z0-9@._-]$/;

    if(!regex.test(charStr)) {
      event.preventDefault();
    }
  }

  ValidarInputCorreo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value;

    input.value = valor.replace(/[^a-zA-Z0-9@._-]/g, '');
    input.value = input.value.trim();
  }



}
