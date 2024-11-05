import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { FuncionesService } from '../../../../Services/funciones.service';
import { RequerimientoCorreo } from '../../../../Interfaces/contrasena.interface';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-aviso-email',
  standalone: true,
  imports: [
    LottieComponent,
    CommonModule
  ],
  templateUrl: './aviso-email.component.html',
  styleUrl: './aviso-email.component.css'
})
export class AvisoEmailComponent implements OnInit{

  email: string | null = null;
  activarBoton: boolean = true;
  contador: string = '03:00';
  mostrarTimer: boolean = true;

  constructor(private funciones: FuncionesService ,private rutas: ActivatedRoute,  @Inject(PLATFORM_ID) private platformId: Object ){}

  ngOnInit(): void {
    this.rutas.paramMap.subscribe(params => {
       this.email = params.get('email');
       console.log(this.email);
    });

    if (isPlatformBrowser(this.platformId)) {
      this.IniciarTimer();
    }
  }
  
  animacionCorreo: AnimationOptions = {
    path: '/Animaciones/Correo2.json'
  }

  reenviar(email: string) {
    if(email) {

      const data: RequerimientoCorreo = {
        email: email!
      }
      
      this.funciones.EnviarCorreo(data).subscribe({
        next: (response) => {
          console.log('se reenvio con exito');
          this.IniciarTimer();
        },
        error: (err) => {
          console.log('Ocurrio algo inesperado.', err);
        }
      });

     }
  }

  IniciarTimer(){
    let timeLeft = 180;
    this.activarBoton = true;
    this.mostrarTimer = true;
    const timerInvertido = setInterval(() => {
      const minutos  = Math.floor(timeLeft / 60);
      const segundos = timeLeft % 60;
      this.contador = `${this.pad(minutos)}:${this.pad(segundos)}`;
      timeLeft--;

      if(timeLeft < 0){
        clearInterval(timerInvertido);
        this.activarBoton = false;
        this.contador = '00:00';
        this.mostrarTimer = false; 
      }
    }, 1000);
  }


  pad(value: number): string {
    return value < 10? `0${value}` : `${value}`;
  }

}
