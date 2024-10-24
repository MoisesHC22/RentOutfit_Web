import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../../../Services/funciones.service';
import { CookieService } from 'ngx-cookie-service';
import { ListaVestimenta, RequerimientosVestimentas } from '../../../../Interfaces/Vestimenta.interface';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-vestimentas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './lista-vestimentas.component.html',
  styleUrl: './lista-vestimentas.component.css'
})
export class ListaVestimentasComponent implements OnInit{

  constructor(private Funciones: FuncionesService, private cookie: CookieService, private Rutas: Router){}
  
  token: string | null = null;
  estado: string | null = null;
  municipio: string | null = null;
  pagina: number | null = null;

  VestimentasList: ListaVestimenta[]=[];

  ngOnInit(): void {
    this.token = this.cookie.get('token');

    if(this.token)
      {
        const obtener = this.DecodificarToken(this.token);

        this.estado = obtener?.estado || null;
        this.municipio = obtener?.municipio || null

        if(this.estado != null && this.municipio != null){
          this.ListaVestimentas(this.estado, this.municipio);
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

  ListaVestimentas(estado: string, municipio: string){

    const data: RequerimientosVestimentas = {
       estado: this.estado!,
       municipio: this.municipio!,
       pagina: this.pagina!
    }

    this.Funciones.MostrarVestimentas(data).subscribe({
      next: (result) => {
        this.VestimentasList = result;
      },
      error: (err) =>{
        console.log("Ocurrio un error.");
      }
    });
  }


   MasInformacion(vestimenta?: number): void{
    if(vestimenta){
      this.Rutas.navigate(['/Cliente/masInformacion', vestimenta]);
    } else {
      console.error('No se encontro el libro');
    }
   }


}
