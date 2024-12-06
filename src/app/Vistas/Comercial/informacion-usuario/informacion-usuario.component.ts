import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FuncionesService } from '../../../Services/funciones.service';
import { response } from 'express';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';


@Component({
  selector: 'app-informacion-usuario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    LottieComponent,
  ],
  templateUrl: './informacion-usuario.component.html',
  styleUrl: './informacion-usuario.component.css'
})
export class InformacionUsuarioComponent implements OnInit {

  constructor(private Funciones: FuncionesService ,private cookie: CookieService){}

  token: string | null = null;
  infRol: string | null = null;

  usuarioID: number | null = null

  nombre: string | null = null;
  apellidoP: string | null = null;
  apellidoM: string | null = null;
  img: string | null = null;
  email: string | null = null;
  telefono: string | null = null;
  codigoPostal: string | null = null;
  genero:string | null = null;

  rol: number | null = null;
  nombreRol: string | null = null;

  ngOnInit(): void {
    this.token = this.cookie.get('info');

    this.infRol = this.cookie.get('token');

    if(this.token)
    {
      const obtener = this.Funciones.DecodificarToken(this.token);
      const obtenerRol = this.Funciones.DecodificarToken(this.infRol);

      this.rol = obtenerRol?.role || null;

      if (obtener?.Clientes) {
      const clienteData = JSON.parse(obtener.Clientes)[0];

      this.nombre = clienteData?.nombreCliente || null;
      this.apellidoP = clienteData?.apellidoPaterno || null;
      this.apellidoM = clienteData?.apellidoMaterno || null;
      this.img = clienteData?.linkImagenPerfil || null;
      this.email = clienteData?.email || null;
      this.telefono = clienteData?.telefono || null;
      this.genero = clienteData?.genero || null;

      if(this.rol == 1)
        {
          this.nombreRol = 'Cliente';
        } else if(this.rol == 2) {
          this.nombreRol = 'Vendedor';
        } else if (this.rol == 3) {
          this.nombreRol = 'Administrador';
        }
     }

     
    }
  }


}