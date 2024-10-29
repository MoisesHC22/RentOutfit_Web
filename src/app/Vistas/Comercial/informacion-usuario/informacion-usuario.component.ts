import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FuncionesService } from '../../../Services/funciones.service';
import { response } from 'express';


@Component({
  selector: 'app-informacion-usuario',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './informacion-usuario.component.html',
  styleUrl: './informacion-usuario.component.css'
})
export class InformacionUsuarioComponent implements OnInit {

  constructor(private Funciones: FuncionesService ,private cookie: CookieService){}

  token: string | null = null;
  usuarioID: number | null = null

  nombre: string | null = null;
  apellidoP: string | null = null;
  apellidoM: string | null = null;
  img: string | null = null;
  email: string | null = null;
  telefono: string | null = null;
  codigoPostal: string | null = null;
  genero:string | null = null;

  ngOnInit(): void {
    this.token = this.cookie.get('info');

    if(this.token)
    {
      const obtener = this.Funciones.DecodificarToken(this.token);

      if (obtener?.Clientes) {
      const clienteData = JSON.parse(obtener.Clientes)[0];

      this.nombre = clienteData?.nombreCliente || null;
      this.apellidoP = clienteData?.apellidoPaterno || null;
      this.apellidoM = clienteData?.apellidoMaterno || null;
      this.img = clienteData?.linkImagenPerfil || null;
      this.email = clienteData?.email || null;
      this.telefono = clienteData?.telefono || null;
      this.genero = clienteData?.genero || null;
     }
    }
  }


}