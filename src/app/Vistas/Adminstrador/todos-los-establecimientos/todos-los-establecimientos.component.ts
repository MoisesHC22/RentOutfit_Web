import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionesService } from '../../../Services/funciones.service';
import { RequerimientosDeMisEstablecimientos, TiendasCercanas } from '../../../Interfaces/tienda.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-todos-los-establecimientos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './todos-los-establecimientos.component.html',
  styleUrl: './todos-los-establecimientos.component.css'
})
export class TodosLosEstablecimientosComponent implements OnInit {

  constructor(private Rutas: ActivatedRoute, private Funciones: FuncionesService){}

  TiendasList: TiendasCercanas[]=[];
  usuario: number | null = null;
  pagina: number | null = null;

  ngOnInit(): void {

    this.Rutas.paramMap.subscribe(params => {
      const usuario = params.get('usuario');

      if(usuario) {
        this.usuario = +usuario;
        this.ListaDeEstablecimientos(this.usuario);
      }
    });
  }

  ListaDeEstablecimientos(usuario: number){

    const data: RequerimientosDeMisEstablecimientos = {
      usuario: this.usuario!,
      pagina: this.pagina!
    }

    this.Funciones.TodosLosEstablecimientos(data).subscribe({
      next: (result) => {
        this.TiendasList = result;
      },
      error: (err) => {
        console.log("Ocurrio un error.", err);
      }
    })
  }
}
