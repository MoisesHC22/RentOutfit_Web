import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuncionesService } from '../../../Services/funciones.service';
import { MisEstablecimientos, RequerimientosDeMisEstablecimientos, RequerimientosDenegarEstablecimientos, TiendaInterface } from '../../../Interfaces/tienda.interface';
import { __param } from 'tslib';

@Component({
  selector: 'app-peticiones-disponibles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './peticiones-disponibles.component.html',
  styleUrl: './peticiones-disponibles.component.css'
})
export class PeticionesDisponiblesComponent implements OnInit{

  constructor(private Rutas: ActivatedRoute, private Funciones: FuncionesService, private form: FormBuilder){}

  datos: any;
  TiendasList: MisEstablecimientos[]=[];
  usuario: number | null = null;
  pagina: number | null = 1;
  establecimientoID: number | null = null;
  nombreEstablecimiento: string | null = null;

  MostrarModal: boolean = false;

  ngOnInit(): void {

    this.datos = this.form.group({
       motivo: ['', [Validators.required]]
    })

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
          this.Peticiones(this.usuario!, this.pagina!);
        },
        error: (err) => {
          console.log('Ocurrio algo inesperado.', err);
        }
      });
  }
  
  abrirModal(establecimientoID: number, nombreEstablecimiento: string) {
     this.establecimientoID = establecimientoID;
     this.nombreEstablecimiento = nombreEstablecimiento;
     this.MostrarModal = true;
  }

  cerrarModal() {
    this.MostrarModal = false;
    this.datos.reset();
  }

  denegar() {

    const data: RequerimientosDenegarEstablecimientos = 
    {
      establecimientoID: this.establecimientoID!,
      motivo: this.datos.value.motivo!
    }

    this.Funciones.DenegarEstablecimiento(data).subscribe({
      next: (result) => {
        this.cerrarModal();
        this.Peticiones(this.usuario!, this.pagina!);
      },
      error: (err) => {
        console.log('Ocurrio algo inesperado.', err);
      }
    });
  }



}
