import { Component, OnInit,} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { RequerimientosIniciarSesion } from '../../../Interfaces/iniciarSesion.interface';
import { FuncionesService } from '../../../Services/funciones.service';
import { CommonModule } from '@angular/common';
import { CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    LottieComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  
  datos: any;
  mensajeError: string | null = null;

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

 
  iniciarSesion(): void{
    const data: RequerimientosIniciarSesion = {
      email: this.datos.value.email!,
      contrasena: this.datos.value.contrasena!
    };

    this.funciones.IniciarSesion(data).subscribe({
      next: (response) => {
        this.cookie.set('token', response.token, { path: '/', secure: true });
        this.rutas.navigate(['/Cliente/home']);
      },
      error: (err) => {
        console.log('Ocurrio algo inesperado.');
      }
    });
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
