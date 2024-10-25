import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FuncionesService } from '../../../Services/funciones.service';
import { response } from 'express';
import { GeneroInterface } from '../../../Interfaces/genero.interfaces';


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

  datos: any;

  constructor(private Funciones: FuncionesService ,private cookie: CookieService){}

  GenerosList: GeneroInterface[]=[];
  token: string | null = null;
  usuarioID: number | null = null
  nombre: string | null = null;
  apellidoP: string | null = null;
  apellidoM: string | null = null;
  img: string | null = null;
  email: string | null = null;
  telefono: string | null = null;
  genero:string | null = null;

  ngOnInit(): void {
    this.token = this.cookie.get('info');

    if(this.token)
    {
      const obtener = this.DecodificarToken(this.token);

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

  
  DecodificarToken(token: string): any {
    try 
    {
      const payload = token.split('.')[1];
      const descodificacionPayload = this.base64UrlCode(payload);
    return JSON.parse(decodeURIComponent(escape(descodificacionPayload)));
    }
    catch(error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  base64UrlCode(str: string): string {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    
    switch (base64.length % 4) {
    case 2: base64 += '=='; break;
    case 3: base64 += '='; break;
  }
  return atob(base64);
  }

  ListaGeneros(){
    this.Funciones.ObtenerGeneros().subscribe({
      next: (result) => {
        this.GenerosList = result;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


}
