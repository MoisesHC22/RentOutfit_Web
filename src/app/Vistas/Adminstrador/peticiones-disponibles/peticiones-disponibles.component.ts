import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuncionesService } from '../../../Services/funciones.service';
import { MisEstablecimientos, RequerimientosDeMisEstablecimientos, TiendaInterface } from '../../../Interfaces/tienda.interface';
import { __param } from 'tslib';

@Component({
  selector: 'app-peticiones-disponibles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './peticiones-disponibles.component.html',
  styleUrl: './peticiones-disponibles.component.css'
})
export class PeticionesDisponiblesComponent implements OnInit{

  constructor(private Rutas: ActivatedRoute, private Funciones: FuncionesService){}

  TiendasList: MisEstablecimientos[]=[];
  usuario: number | null = null;
  pagina: number | null = 1;

  ngOnInit(): void {
    this.Rutas.paramMap.subscribe(params => {
       const usuarioID = params.get('usuario');

       if(usuarioID) {
        this.usuario = +usuarioID;

        this.Peticiones(this.usuario, this.pagina!);
       }
    });
  }

  Peticiones(usuarioID: number, pagina: number) {
    const data: RequerimientosDeMisEstablecimientos = 
    {
      usuario: this.usuario!,
      pagina: this.pagina!,
    }

    this.Funciones.ListaDeEstablecimientosParaAprobar(data).subscribe({
      next: (result) => {
        this.TiendasList = result;
      },
      error: (err) => {
        console.log('Ocurrio algo inesperado.', err);
      }
    });
  }



  aprobar(establecimientosID: number) {
      this.Funciones.AprobarEstablecimiento(establecimientosID).subscribe({
        next: (result) => {
          console.log(result);
        },
        error: (err) => {
          console.log('Ocurrio algo inesperado.', err);
        }
      });
  }

}
